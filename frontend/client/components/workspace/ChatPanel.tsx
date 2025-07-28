import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;
}

interface ChatPanelProps {
  sessionId: string;
}

export function ChatPanel({ sessionId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI frontend assistant. I can help you build React components, create layouts, and generate code. What would you like to build today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I'll help you with that! Here's a React component based on your request:`,
        timestamp: new Date(),
        codeBlocks: [{
          language: 'tsx',
          code: `import React from 'react';
import { Button } from '@/components/ui/button';

export function CustomComponent() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Custom Component</h2>
      <p className="text-gray-600 mb-4">
        This is a sample component based on your request.
      </p>
      <Button>Click me</Button>
    </div>
  );
}`
        }]
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedPrompts = [
    "Build a responsive navigation header",
    "Create a modern login form",
    "Design a product card component",
    "Generate a dashboard layout"
  ];

  return (
    <div className="h-full flex flex-col bg-background scroll-smooth">
      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        <div className="max-w-4xl mx-auto py-8 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex space-x-3",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Icons.code className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div className={cn(
                "max-w-3xl rounded-2xl px-6 py-5 w-full shadow-sm transition-all duration-200 hover:shadow-md",
                message.type === 'user'
                  ? "bg-gradient-to-br from-chat-user-bg to-chat-user-bg/90 text-chat-user-fg ml-4 sm:ml-16 shadow-primary/20"
                  : "bg-chat-ai-bg border border-chat-border/50 text-chat-ai-fg hover:border-chat-border"
              )}>
                <div className="prose prose-base max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-base">{message.content}</p>
                  
                  {message.codeBlocks?.map((block, index) => (
                    <div key={index} className="mt-6">
                      <div className="code-block border border-border/50 rounded-xl p-5 overflow-x-auto bg-editor-bg/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                            <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                              {block.language}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 interactive hover:bg-primary/10"
                          >
                            <Icons.fileCode className="w-3 h-3" />
                          </Button>
                        </div>
                        <pre className="text-sm font-mono leading-relaxed">
                          <code className="text-foreground/90">{block.code}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-medium text-primary-foreground">
                    U
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Icons.code className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-chat-ai-bg border border-chat-border rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Icons.spinner className="w-4 h-4 animate-spin" />
                  <span className="text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Prompts (show when no messages) */}
      {messages.length === 1 && (
        <div className="px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-3">Try these examples</h3>
              <p className="text-muted-foreground">Click on any prompt to get started</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="group text-left p-6 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 interactive"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icons.message className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2">
                        {prompt}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary/70 transition-colors">
                        <span>Try this prompt</span>
                        <Icons.chevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
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
      <div className="border-t border-border/50 glass-subtle">
        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the component or layout you want to build..."
                className="min-h-[80px] max-h-40 pr-16 resize-none border-border/50 focus:border-primary/50 transition-colors text-base leading-relaxed"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                className={cn(
                  "absolute right-3 bottom-3 h-10 w-10 p-0 btn-primary shadow-lg transition-all",
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
              <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
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
