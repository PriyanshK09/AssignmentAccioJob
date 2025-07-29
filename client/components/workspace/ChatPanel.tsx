import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { CodeHighlight } from '@/components/ui/code-highlight';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date | string;
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;
}

interface ChatPanelProps {
  sessionId: string;
  onComponentUpdate?: (component: any) => void;
  onSessionIdChange?: (sessionId: string) => void; // Add this prop
}

export function ChatPanel({ sessionId, onComponentUpdate, onSessionIdChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load session when sessionId changes
  useEffect(() => {
    if (sessionId && sessionId !== 'new-session') {
      loadSession();
    } else {
      // Default welcome message for new sessions
      setMessages([{
        id: '1',
        type: 'ai',
        content: "Hello! I'm your AI frontend assistant. I can help you build React components, create layouts, and generate code. What would you like to build today?",
        timestamp: new Date(),
      }]);
    }
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setSessionLoading(true);
      const session = await apiClient.getSession(sessionId);
      const formattedMessages = session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load session:', error);
      toast.error('Failed to load session');
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userContent = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately for better UX
    const tempUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userContent,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      // Send message to backend
      const response = await apiClient.sendMessage(sessionId, userContent);
      
      // Handle new session ID if this was a new session
      if (response.sessionId && sessionId === 'new-session' && onSessionIdChange) {
        // Update the session ID in parent and trigger refresh
        onSessionIdChange(response.sessionId);
      }
      
      // Replace temp user message and add AI response
      setMessages(prev => {
        const withoutTemp = prev.slice(0, -1);
        return [
          ...withoutTemp,
          {
            ...response.userMessage,
            timestamp: new Date(response.userMessage.timestamp)
          },
          {
            ...response.aiMessage,
            timestamp: new Date(response.aiMessage.timestamp)
          }
        ];
      });

      // Update component in parent
      if (response.component && onComponentUpdate) {
        onComponentUpdate(response.component);
      }

    } catch (error: any) {
      console.error('Message error:', error);
      toast.error(error.message || 'Failed to send message');
      
      // Remove the temp user message on error
      setMessages(prev => prev.slice(0, -1));
      setInput(userContent); // Restore input
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedPrompts = [
    "Create a modern login form",
    "Build a responsive navigation header", 
    "Design a product card component",
    "Generate a dashboard layout"
  ];

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  if (sessionLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/5">
      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex space-x-3",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.type === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-primary/25 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Icons.code className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              
              <div className={cn(
                "max-w-3xl rounded-2xl px-5 py-4 w-full shadow-sm transition-all duration-200 hover:shadow-md border",
                message.type === 'user'
                  ? "bg-gradient-to-br from-primary to-primary/90 text-white border-primary/20"
                  : "bg-card border-border/40 text-foreground hover:border-border/60 hover:shadow-lg"
              )}>
                <div className="prose prose-sm max-w-none">
                  <p className={cn(
                    "whitespace-pre-wrap leading-relaxed text-sm mb-0",
                    message.type === 'user' ? "text-white" : "text-foreground"
                  )}>
                    {message.content}
                  </p>
                  
                  {message.codeBlocks?.map((block, index) => (
                    <div key={index} className="mt-4">
                      <div className="bg-slate-950 rounded-xl border border-slate-800/50 overflow-hidden shadow-lg">
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                            <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                              {block.language}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md"
                            onClick={() => copyToClipboard(block.code)}
                          >
                            <Icons.copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="p-4 overflow-auto bg-slate-950/50">
                          <CodeHighlight 
                            code={block.code} 
                            language={block.language}
                            className="whitespace-pre-wrap break-words min-w-0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {message.type === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <span className="text-xs font-semibold text-primary-foreground">
                    U
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex space-x-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-primary/25 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <Icons.code className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-card border border-border/40 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <Icons.spinner className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-muted-foreground text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Prompts (show when few messages) */}
      {messages.length <= 1 && (
        <div className="px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2 text-foreground/90">Try these examples</h3>
              <p className="text-muted-foreground text-sm">Click on any prompt to get started</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="group text-left p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-primary/25 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:from-primary/25 group-hover:to-primary/35 transition-all duration-200">
                      <Icons.message className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground/90 group-hover:text-foreground transition-colors mb-1">
                        {prompt}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                        <span>Try this prompt</span>
                        <Icons.chevronRight className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border/30 bg-gradient-to-r from-background to-muted/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the component or layout you want to build..."
                className="min-h-[72px] max-h-36 pr-14 resize-none border-border/40 focus:border-primary/40 transition-all duration-200 text-sm leading-relaxed rounded-xl shadow-sm hover:shadow-md focus:shadow-md bg-background/80 backdrop-blur-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                className={cn(
                  "absolute right-2 bottom-2 h-8 w-8 p-0 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm hover:shadow-md transition-all duration-200",
                  (!input.trim() || isLoading) && "opacity-50 cursor-not-allowed"
                )}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="w-4 h-4 animate-spin" />
                ) : (
                  <Icons.upload className="w-4 h-4" />
                )}
              </Button>
            </div>
            {input.trim() && (
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground/70">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>{input.length} characters</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
