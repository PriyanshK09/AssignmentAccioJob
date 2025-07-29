import { Router } from 'express';
import { Session } from '../models/Session';
import { authenticateToken } from '../middleware/auth';
import { generateComponent } from '../services/aiService';
import { z } from 'zod';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

const messageSchema = z.object({
  content: z.string(),
  type: z.enum(['user', 'ai']).optional(),
});

// Get all sessions for user
router.get(
  '/',
  async (req: any, res) => {
    try {
      console.log('📋 Fetching sessions for user:', req.user._id);
      const sessions = await Session.find({ userId: req.user._id })
        .sort({ updatedAt: -1 })
        .select('title description preview createdAt updatedAt');

      console.log(`✅ Found ${sessions.length} sessions`);
      res.json(sessions);
    } catch (error) {
      console.error('❌ Failed to fetch sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  }
);

// Create new session
router.post(
  '/',
  async (req: any, res) => {
    try {
      console.log('➕ Creating new session for user:', req.user._id);
      const session = new Session({
        userId: req.user._id,
        title: 'New Session',
        messages: [{
          id: Date.now().toString(),
          type: 'ai',
          content: "Hello! I'm your AI frontend assistant. I can help you build React components, create layouts, and generate code. What would you like to build today?",
          timestamp: new Date(),
        }],
      });

      await session.save();
      console.log('✅ Created session:', session._id);
      res.status(201).json(session);
    } catch (error) {
      console.error('❌ Failed to create session:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  }
);

// Get specific session
router.get(
  '/:sessionId',
  async (req: any, res) => {
    try {
      console.log('📄 Fetching session:', req.params.sessionId);
      const session = await Session.findOne({
        _id: req.params.sessionId,
        userId: req.user._id,
      });

      if (!session) {
        console.log('❌ Session not found:', req.params.sessionId);
        return res.status(404).json({ error: 'Session not found' });
      }

      console.log('✅ Found session:', session._id);
      res.json(session);
    } catch (error) {
      console.error('❌ Failed to fetch session:', error);
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  }
);

// Send message and generate component
router.post(
  '/:sessionId/messages',
  async (req: any, res) => {
    try {
      console.log('💬 Processing message for session:', req.params.sessionId);
      const { content } = messageSchema.parse(req.body);
      
      let session;
      
      // Handle new session case
      if (req.params.sessionId === 'new-session') {
        console.log('➕ Creating new session for message');
        session = new Session({
          userId: req.user._id,
          title: 'New Session',
          messages: [{
            id: Date.now().toString(),
            type: 'ai',
            content: "Hello! I'm your AI frontend assistant. I can help you build React components, create layouts, and generate code. What would you like to build today?",
            timestamp: new Date(),
          }],
        });
        await session.save();
        console.log('✅ Created new session:', session._id);
      } else {
        // Find existing session
        session = await Session.findOne({
          _id: req.params.sessionId,
          userId: req.user._id,
        });

        if (!session) {
          return res.status(404).json({ error: 'Session not found' });
        }
      }

      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content,
        timestamp: new Date(),
      };
      session.messages.push(userMessage);

      // Generate AI response
      console.log('🤖 Generating AI response...');
      const aiResponse = await generateComponent({
        prompt: content,
        previousCode: session.currentComponent?.jsx,
      });

      // Add AI message with generated code
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse.explanation,
        timestamp: new Date(),
        codeBlocks: [{
          language: 'tsx',
          code: aiResponse.jsx,
        }],
      };
      session.messages.push(aiMessage);

      // Update current component
      session.currentComponent = {
        id: Date.now().toString(),
        name: aiResponse.componentName,
        jsx: aiResponse.jsx,
        css: aiResponse.css,
        props: {},
        createdAt: new Date(),
      };

      // Update session title if it's the first user message
      if (session.messages.filter(m => m.type === 'user').length === 1) {
        session.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        session.preview = content;
      }

      await session.save();
      console.log('✅ Message processed and session updated');
      
      res.json({ 
        userMessage, 
        aiMessage, 
        component: session.currentComponent,
        sessionId: session._id // Include the actual session ID for new sessions
      });
    } catch (error) {
      console.error('❌ Message processing error:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  }
);

// Update component
router.put(
  '/:sessionId/component',
  async (req: any, res) => {
    try {
      console.log('🔧 Updating component for session:', req.params.sessionId);
      const session = await Session.findOne({
        _id: req.params.sessionId,
        userId: req.user._id,
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const { jsx, css, props } = req.body;
      
      if (session.currentComponent) {
        session.currentComponent.jsx = jsx || session.currentComponent.jsx;
        session.currentComponent.css = css || session.currentComponent.css;
        session.currentComponent.props = props || session.currentComponent.props;
      }

      await session.save();
      console.log('✅ Component updated');
      res.json(session.currentComponent);
    } catch (error) {
      console.error('❌ Failed to update component:', error);
      res.status(500).json({ error: 'Failed to update component' });
    }
  }
);

// Update session (title, description, etc.)
router.put(
  '/:sessionId',
  async (req: any, res) => {
    try {
      console.log('📝 Updating session:', req.params.sessionId);
      const session = await Session.findOne({
        _id: req.params.sessionId,
        userId: req.user._id,
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const { title, description } = req.body;
      
      if (title !== undefined) session.title = title;
      if (description !== undefined) session.description = description;

      await session.save();
      console.log('✅ Session updated');
      res.json({
        _id: session._id,
        title: session.title,
        description: session.description,
        updatedAt: session.updatedAt
      });
    } catch (error) {
      console.error('❌ Failed to update session:', error);
      res.status(500).json({ error: 'Failed to update session' });
    }
  }
);

// Delete session
router.delete(
  '/:sessionId',
  async (req: any, res) => {
    try {
      console.log('🗑️  Deleting session:', req.params.sessionId);
      const session = await Session.findOneAndDelete({
        _id: req.params.sessionId,
        userId: req.user._id,
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      console.log('✅ Session deleted');
      res.json({ message: 'Session deleted successfully' });
    } catch (error) {
      console.error('❌ Failed to delete session:', error);
      res.status(500).json({ error: 'Failed to delete session' });
    }
  }
);

// Public endpoint for shared components
router.get(
  '/share/:componentId',
  async (req, res) => {
    try {
      console.log('🔗 Fetching shared component:', req.params.componentId);
      
      // In a real implementation, you would have a separate SharedComponent model
      // For now, we'll look up the component in sessions
      const session = await Session.findOne({
        "components.id": req.params.componentId
      });

      if (!session) {
        return res.status(404).json({ error: 'Shared component not found' });
      }

      const component = session.components.find(c => c.id === req.params.componentId);
      
      if (!component) {
        return res.status(404).json({ error: 'Component not found' });
      }

      // Return the component without sensitive session info
      res.json({
        id: component.id,
        name: component.name,
        jsx: component.jsx,
        css: component.css,
        props: component.props,
      });
    } catch (error) {
      console.error('❌ Failed to fetch shared component:', error);
      res.status(500).json({ error: 'Failed to fetch shared component' });
    }
  }
);

export default router;