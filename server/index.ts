import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/auth";
import sessionRoutes from "./routes/sessions";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Connect to database
  connectDatabase();

  // Middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body ? JSON.stringify(req.body).substring(0, 100) : '');
    next();
  });

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/sessions", sessionRoutes);
  
  // Add public share endpoint (no auth required)
  app.get("/api/share/:componentId", async (req, res) => {
    try {
      const { componentId } = req.params;
      console.log('🔗 Fetching shared component:', componentId);
      
      // In a real implementation, you would look up the component in a database
      // For now, we'll return a mock response with more realistic data
      res.json({
        id: componentId,
        name: 'SharedComponent',
        jsx: `import React from 'react';

interface SharedComponentProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

function SharedComponent({ 
  title = "Shared Component", 
  description = "This is a shared component preview",
  variant = "primary"
}: SharedComponentProps) {
  return (
    <div className={\`p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center space-x-4 \${
      variant === 'primary' ? 'border-l-4 border-blue-500' : 
      variant === 'secondary' ? 'border-l-4 border-purple-500' : ''
    }\`}>
      <div className="shrink-0">
        <div className={\`h-12 w-12 \${
          variant === 'primary' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
          variant === 'secondary' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
          'bg-gradient-to-r from-gray-500 to-gray-600'
        } rounded-full flex items-center justify-center text-white font-bold\`}>
          SC
        </div>
      </div>
      <div>
        <div className="text-xl font-medium text-black dark:text-white">{title}</div>
        <p className="text-gray-500 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

export default SharedComponent;`,
        css: `/* Optional custom styles */
.shared-component-demo {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.shared-component-demo:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
}`,
        props: {
          title: 'Shared Component',
          description: 'This component was shared with you',
          variant: 'primary'
        }
      });
    } catch (error) {
      console.error('❌ Failed to fetch shared component:', error);
      res.status(500).json({ error: 'Failed to fetch shared component' });
    }
  });
  
  app.get("/api/demo", handleDemo);

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  return app;
}

// Start server if run directly
const isRunningDirectly = process.argv[1] && process.argv[1].includes('index.ts');

if (isRunningDirectly || !process.env.NODE_ENV) {
  const app = createServer();
  const port = process.env.PORT || 3001;
  
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`🌍 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
