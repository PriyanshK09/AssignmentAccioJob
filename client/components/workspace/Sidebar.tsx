import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface Session {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  preview?: string;
}

interface SidebarProps {
  collapsed: boolean;
  currentSession: string;
  onSessionChange: (sessionId: string) => void;
  refreshTrigger?: number;
}

export function Sidebar({ collapsed, currentSession, onSessionChange, refreshTrigger }: SidebarProps) {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  // Refresh sessions when refreshTrigger changes
  useEffect(() => {
    if (user && refreshTrigger && refreshTrigger > 0) {
      loadSessions();
    }
  }, [refreshTrigger, user]);

  const handleNewSession = async () => {
    try {
      const newSession = await apiClient.createSession();
      setSessions(prev => [newSession, ...prev]);
      onSessionChange(newSession._id);
      toast.success('New session created');
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to create session');
    }
  };

  const handleDeleteSession = async (sessionId: string, sessionTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${sessionTitle}"?`)) {
      return;
    }

    try {
      await apiClient.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      
      // If deleting current session, switch to first available session or create new one
      if (currentSession === sessionId) {
        const remainingSessions = sessions.filter(s => s._id !== sessionId);
        if (remainingSessions.length > 0) {
          onSessionChange(remainingSessions[0]._id);
        } else {
          onSessionChange('new-session');
        }
      }
      
      toast.success('Session deleted');
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast.error('Failed to delete session');
    }
  };

  const handleRenameSession = (sessionId: string, currentTitle: string) => {
    setEditingSession(sessionId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = async (sessionId: string) => {
    if (!editingTitle.trim()) {
      setEditingSession(null);
      return;
    }

    try {
      const updatedSession = await apiClient.updateSession(sessionId, { title: editingTitle.trim() });
      setSessions(prev => prev.map(s => 
        s._id === sessionId 
          ? { ...s, title: updatedSession.title, updatedAt: updatedSession.updatedAt }
          : s
      ));
      setEditingSession(null);
      toast.success('Session renamed');
    } catch (error) {
      console.error('Failed to rename session:', error);
      toast.error('Failed to rename session');
      setEditingSession(null);
    }
  };

  const handleCancelRename = () => {
    setEditingSession(null);
    setEditingTitle('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleSignOut = () => {
    logout();
  };

  if (collapsed) return null;

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border/40 shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
      <div className="p-4 border-b border-sidebar-border/30 bg-gradient-to-r from-sidebar-bg to-sidebar-bg/95">
        <Button
          onClick={handleNewSession}
          className="w-full justify-start h-10 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-sm hover:shadow transition-all duration-200 rounded-md font-medium"
          disabled={isLoading}
        >
          <Icons.plus className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>

      <ScrollArea className="flex-1 px-1">
        <div className="py-3 px-2 space-y-1">
          <div className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3 px-3 flex items-center justify-between">
            <span>Recent Sessions</span>
            {isLoading && (
              <div className="flex items-center text-primary/70">
                <Icons.spinner className="w-3 h-3 animate-spin mr-1" />
                <span className="text-[10px]">Loading...</span>
              </div>
            )}
          </div>

          {isLoading && sessions.length === 0 ? (
            <div className="py-8 px-4 text-center text-muted-foreground/80">
              <div className="w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icons.spinner className="w-4 h-4 animate-spin text-primary/70" />
              </div>
              <p className="text-sm font-medium">Loading sessions</p>
              <p className="text-xs mt-1 opacity-70">Please wait a moment</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-8 px-4 text-center text-muted-foreground/80">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-muted/50 to-muted/20 border border-border/40 flex items-center justify-center mx-auto mb-3">
                <Icons.code className="w-5 h-5 text-foreground/40" />
              </div>
              <p className="text-sm font-medium">No sessions yet</p>
              <p className="text-xs mt-1 opacity-70">Create your first session to get started</p>
            </div>
          ) : (
            sessions.map((session) => (
              <ContextMenu key={session._id}>
                <ContextMenuTrigger>
                  <div
                    onClick={() => editingSession !== session._id && onSessionChange(session._id)}
                    className={cn(
                      "group w-full text-left p-3 rounded-md transition-all duration-200 relative overflow-hidden border cursor-pointer",
                      currentSession === session._id 
                        ? "bg-gradient-to-r from-sidebar-accent/15 to-transparent border-sidebar-accent/40 shadow-sm" 
                        : "hover:bg-sidebar-hover border-transparent hover:border-sidebar-border/50"
                    )}
                  >
                    {currentSession === session._id && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-sidebar-accent" />
                    )}

                    <div className="relative space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {editingSession === session._id ? (
                            <Input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveRename(session._id);
                                } else if (e.key === 'Escape') {
                                  handleCancelRename();
                                }
                                e.stopPropagation();
                              }}
                              onBlur={() => handleSaveRename(session._id)}
                              className="h-7 text-sm font-medium bg-background/90 border-primary/50 focus:border-primary rounded-sm px-2 flex-1"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <div className={cn(
                              "font-medium text-sm truncate flex-1 transition-colors",
                              currentSession === session._id
                                ? "text-sidebar-foreground"
                                : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                            )}>
                              {session.title}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {currentSession === session._id && editingSession !== session._id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-6 w-6 p-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-muted/60",
                                  currentSession === session._id ? "focus:opacity-100" : "",
                                  editingSession === session._id && "hidden"
                                )}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Icons.ellipsis className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRenameSession(session._id, session.title);
                                }}
                                className="cursor-pointer"
                              >
                                <Icons.edit className="w-3.5 h-3.5 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSessionChange(session._id);
                                }}
                                className="cursor-pointer"
                              >
                                <Icons.eye className="w-3.5 h-3.5 mr-2" />
                                Open
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(session._id, session.title);
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Icons.trash className="w-3.5 h-3.5 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {editingSession !== session._id && (
                        <>
                          <div className={cn(
                            "text-xs flex items-center gap-1.5",
                            currentSession === session._id
                              ? "text-sidebar-foreground/70" 
                              : "text-sidebar-foreground/50"
                          )}>
                            <Icons.clock className="w-3 h-3 flex-shrink-0" />
                            {formatDate(session.updatedAt)}
                          </div>
                          {session.preview && (
                            <div className={cn(
                              "text-xs line-clamp-2 leading-relaxed",
                              currentSession === session._id
                                ? "text-sidebar-foreground/60" 
                                : "text-sidebar-foreground/40"
                            )}>
                              {session.preview}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                  <ContextMenuItem 
                    onClick={() => handleRenameSession(session._id, session.title)}
                    className="cursor-pointer"
                  >
                    <Icons.edit className="w-3.5 h-3.5 mr-2" />
                    Rename
                  </ContextMenuItem>
                  <ContextMenuItem 
                    onClick={() => onSessionChange(session._id)}
                    className="cursor-pointer"
                  >
                    <Icons.eye className="w-3.5 h-3.5 mr-2" />
                    Open
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem 
                    onClick={() => handleDeleteSession(session._id, session.title)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Icons.trash className="w-3.5 h-3.5 mr-2" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-sidebar-border/30 bg-sidebar-bg/80 backdrop-blur-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-3 group cursor-pointer p-2 rounded-md hover:bg-sidebar-hover transition-all duration-200">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center justify-center shadow-sm">
                <span className="text-primary font-semibold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-sidebar-foreground truncate group-hover:text-sidebar-foreground transition-colors">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-sidebar-foreground/60 truncate flex items-center">
                  <span className="bg-primary/10 text-primary/90 px-1.5 py-0.5 rounded text-[10px] font-medium">
                    {user?.plan || 'Free'}
                  </span>
                  <span className="ml-1.5">Plan</span>
                </div>
              </div>
              <Icons.chevronUp className="w-3 h-3 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70 transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuItem>
              <Icons.user className="w-3.5 h-3.5 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icons.settings className="w-3.5 h-3.5 mr-2" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icons.github className="w-3.5 h-3.5 mr-2" />
              GitHub Integration
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <Icons.logOut className="w-3.5 h-3.5 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
