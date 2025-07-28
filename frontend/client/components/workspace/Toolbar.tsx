import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  previewVisible: boolean;
  onTogglePreview: () => void;
  isMobile: boolean;
}

export function Toolbar({
  sidebarCollapsed,
  onToggleSidebar,
  isDarkMode,
  onToggleTheme,
  previewVisible,
  onTogglePreview,
  isMobile
}: ToolbarProps) {
  const handleExport = () => {
    // Simulate code export
    console.log('Exporting code...');
  };

  const handleDeploy = () => {
    // Simulate deployment
    console.log('Deploying to Vercel...');
  };

  const handleSave = () => {
    // Simulate save
    console.log('Saving session...');
  };

  const handleClear = () => {
    // Simulate clear session
    if (confirm('Are you sure you want to clear this session?')) {
      console.log('Clearing session...');
    }
  };

  return (
    <div className="h-16 border-b border-border/50 glass-subtle flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="h-9 w-9 p-0 interactive hover:bg-primary/10"
        >
          <Icons.menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
              <Icons.code className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-base">AI Frontend Playground</span>
          </div>
          <div className="w-px h-4 bg-border/50" />
          <span className="text-muted-foreground font-medium">Current Session</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Mobile Preview Toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="h-8"
          >
            <Icons.eye className="w-4 h-4 mr-2" />
            {previewVisible ? 'Code' : 'Preview'}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className={cn("h-9 interactive hover:bg-primary/10", isMobile && "hidden sm:flex")}
        >
          <Icons.save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          className="h-9 interactive hover:bg-primary/10"
        >
          <Icons.download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Icons.upload className="w-4 h-4 mr-2" />
              Deploy
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDeploy}>
              <Icons.upload className="w-4 h-4 mr-2" />
              Deploy to Vercel
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icons.github className="w-4 h-4 mr-2" />
              Export to GitHub
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icons.share className="w-4 h-4 mr-2" />
              Share Preview Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-4 bg-border" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="h-9 w-9 p-0 interactive hover:bg-primary/10"
        >
          {isDarkMode ? (
            <Icons.sun className="h-5 w-5" />
          ) : (
            <Icons.moon className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 interactive hover:bg-primary/10">
              <Icons.settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleClear}>
              <Icons.reset className="w-4 h-4 mr-2" />
              Clear Session
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icons.settings className="w-4 h-4 mr-2" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icons.github className="w-4 h-4 mr-2" />
              GitHub Integration
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
