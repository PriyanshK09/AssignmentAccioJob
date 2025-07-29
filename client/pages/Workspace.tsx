import { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Toolbar } from '@/components/workspace/Toolbar';
import { Sidebar } from '@/components/workspace/Sidebar';
import { ChatPanel } from '@/components/workspace/ChatPanel';
import { PreviewPanel } from '@/components/workspace/PreviewPanel';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';

export default function Workspace() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentSession, setCurrentSession] = useState('new-session');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<any>(null);
  const [refreshSessions, setRefreshSessions] = useState(0);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Set theme based on saved preference or system default
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(initialDarkMode);
    
    // Apply theme to document
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setPreviewVisible(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const togglePreview = () => setPreviewVisible(!previewVisible);
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const handleComponentUpdate = (component: any) => {
    setCurrentComponent(component);
  };

  const handleSessionIdChange = (newSessionId: string) => {
    setCurrentSession(newSessionId);
    // Trigger session list refresh when a new session is created
    setRefreshSessions(prev => prev + 1);
  };

  const handleSessionChange = async (sessionId: string) => {
    setCurrentSession(sessionId);
    setCurrentComponent(null); // Reset component when changing sessions
    
    // Load session data to get current component
    if (sessionId !== 'new-session') {
      try {
        const session = await apiClient.getSession(sessionId);
        if (session.currentComponent) {
          setCurrentComponent(session.currentComponent);
        }
      } catch (error) {
        console.error('Failed to load session component:', error);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Toolbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        previewVisible={previewVisible}
        onTogglePreview={togglePreview}
        isMobile={isMobile}
        currentComponent={currentComponent}
      />

      <div className="flex-1 flex overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-72 flex-shrink-0 transition-all duration-200 ease-in-out">
            <Sidebar
              collapsed={sidebarCollapsed}
              currentSession={currentSession}
              onSessionChange={handleSessionChange}
              refreshTrigger={refreshSessions}
            />
          </div>
        )}

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={isMobile ? 100 : 50} minSize={30}>
            <ChatPanel 
              sessionId={currentSession} 
              onComponentUpdate={handleComponentUpdate}
              onSessionIdChange={handleSessionIdChange}
            />
          </ResizablePanel>

          {!isMobile && (
            <>
              <ResizableHandle className="w-1 bg-border/30 hover:bg-border/50 transition-colors duration-200" />
              <ResizablePanel defaultSize={50} minSize={30}>
                <PreviewPanel currentComponent={currentComponent} />
              </ResizablePanel>
            </>
          )}

          {isMobile && previewVisible && (
            <div className="absolute inset-0 bg-background z-10">
              <PreviewPanel 
                currentComponent={currentComponent}
                onClose={() => setPreviewVisible(false)} 
              />
            </div>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
