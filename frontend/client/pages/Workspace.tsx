import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/workspace/Sidebar';
import { ChatPanel } from '@/components/workspace/ChatPanel';
import { PreviewPanel } from '@/components/workspace/PreviewPanel';
import { Toolbar } from '@/components/workspace/Toolbar';

export default function Workspace() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentSession, setCurrentSession] = useState('new-session');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden scroll-smooth">
      {/* Mobile Sidebar Overlay */}
      {!sidebarCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out border-r border-sidebar-border bg-sidebar-bg z-50",
        isMobile
          ? cn(
              "fixed left-0 top-0 h-full",
              sidebarCollapsed ? "-translate-x-full w-80" : "translate-x-0 w-80"
            )
          : cn(
              "relative",
              sidebarCollapsed ? "w-0" : "w-80"
            )
      )}>
        <Sidebar
          collapsed={sidebarCollapsed}
          currentSession={currentSession}
          onSessionChange={setCurrentSession}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <Toolbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          previewVisible={previewVisible}
          onTogglePreview={togglePreview}
          isMobile={isMobile}
        />

        {/* Main Workspace */}
        <div className="flex-1 flex min-h-0 relative">
          {/* Chat Panel */}
          <div className={cn(
            "flex flex-col min-w-0 transition-all duration-300",
            previewVisible && !isMobile ? "flex-1 max-w-4xl" : "w-full"
          )}>
            <ChatPanel sessionId={currentSession} />
          </div>

          {/* Preview Panel */}
          {previewVisible && (
            <div className={cn(
              "border-l border-border transition-all duration-300",
              isMobile
                ? "absolute top-0 right-0 bottom-0 w-full bg-background z-30"
                : "w-1/2 min-w-96"
            )}>
              <PreviewPanel onClose={isMobile ? () => setPreviewVisible(false) : undefined} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
