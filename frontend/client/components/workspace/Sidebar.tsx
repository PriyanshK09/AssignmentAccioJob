import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

interface SidebarProps {
  collapsed: boolean;
  currentSession: string;
  onSessionChange: (sessionId: string) => void;
}

export function Sidebar({ collapsed, currentSession, onSessionChange }: SidebarProps) {
  const [sessions] = useState<Session[]>([
    {
      id: 'session-1',
      title: 'React Component Builder',
      timestamp: '2 hours ago',
      preview: 'Built a responsive navigation component...'
    },
    {
      id: 'session-2', 
      title: 'Dashboard Layout',
      timestamp: 'Yesterday',
      preview: 'Created a modern dashboard with charts...'
    },
    {
      id: 'session-3',
      title: 'Landing Page Design',
      timestamp: '3 days ago',
      preview: 'Designed a hero section with animations...'
    },
  ]);

  const handleNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    onSessionChange(newSessionId);
  };

  if (collapsed) return null;

  return (
    <div className="h-full flex flex-col bg-sidebar-bg backdrop-blur-sm">
      <div className="p-6 border-b border-sidebar-border/50">
        <Button
          onClick={handleNewSession}
          className="w-full justify-start h-12 btn-primary shadow-lg glow text-base font-medium"
        >
          <Icons.plus className="mr-3 h-5 w-5" />
          New Session
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-2">
            Recent Sessions
          </div>
          {sessions.map((session, index) => (
            <button
              key={session.id}
              onClick={() => onSessionChange(session.id)}
              className={cn(
                "group w-full text-left p-4 rounded-xl transition-all duration-200 hover:bg-sidebar-hover hover:shadow-sm relative overflow-hidden",
                currentSession === session.id && "bg-sidebar-hover shadow-sm ring-1 ring-primary/20"
              )}
            >
              {/* Gradient overlay for active session */}
              {currentSession === session.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl" />
              )}

              <div className="relative space-y-2">
                <div className="flex items-start justify-between">
                  <div className="font-semibold text-sm truncate flex-1 group-hover:text-primary transition-colors">
                    {session.title}
                  </div>
                  {currentSession === session.id && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2 animate-pulse" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {session.timestamp}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {session.preview}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-sidebar-border/50 bg-gradient-to-r from-sidebar-bg to-sidebar-bg/50">
        <div className="flex items-center space-x-3 group cursor-pointer interactive">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
            <Icons.code className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">John Doe</div>
            <div className="text-xs text-muted-foreground">Pro Plan • Unlimited</div>
          </div>
          <Icons.settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </div>
  );
}
