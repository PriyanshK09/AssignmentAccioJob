import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { exportComponentAsZip } from '@/lib/zipExporter';

interface ToolbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  previewVisible: boolean;
  onTogglePreview: () => void;
  isMobile: boolean;
  currentComponent?: any;
}

export function Toolbar({
  sidebarCollapsed,
  onToggleSidebar,
  isDarkMode,
  onToggleTheme,
  previewVisible,
  onTogglePreview,
  isMobile,
  currentComponent
}: ToolbarProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isZipExporting, setIsZipExporting] = useState(false);

  const handleExport = () => {
    if (!currentComponent) {
      toast.error('No component to export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Create a blob with the component's JSX code
      const fileContent = currentComponent.jsx;
      const fileName = `${currentComponent.name || 'Component'}.tsx`;
      const blob = new Blob([fileContent], { type: 'text/plain' });
      
      // Create a download link and trigger it
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      downloadLink.click();
      
      // Clean up
      URL.revokeObjectURL(downloadLink.href);
      
      toast.success(`Successfully exported ${fileName}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export component');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCss = () => {
    if (!currentComponent || !currentComponent.css) {
      toast.error('No CSS to export');
      return;
    }
    
    try {
      // Create a blob with the component's CSS code
      const fileContent = currentComponent.css;
      const fileName = `${currentComponent.name || 'Component'}.css`;
      const blob = new Blob([fileContent], { type: 'text/plain' });
      
      // Create a download link and trigger it
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      downloadLink.click();
      
      // Clean up
      URL.revokeObjectURL(downloadLink.href);
      
      toast.success(`Successfully exported ${fileName}`);
    } catch (error) {
      console.error('CSS Export error:', error);
      toast.error('Failed to export CSS');
    }
  };

  const handleExportAsZip = async () => {
    if (!currentComponent) {
      toast.error('No component to export');
      return;
    }
    
    setIsZipExporting(true);
    
    try {
      // Generate component name for the file
      const componentName = currentComponent.name || 'Component';
      
      await exportComponentAsZip({
        component: currentComponent,
        componentName
      });
      
      toast.success(`Successfully exported ${componentName} as ZIP`);
    } catch (error) {
      console.error('ZIP Export error:', error);
      toast.error('Failed to export as ZIP');
    } finally {
      setIsZipExporting(false);
    }
  };

  const handleDeploy = () => {
    if (!currentComponent) {
      toast.error('No component to deploy');
      return;
    }
    
    // In a real application, this would connect to Vercel's API
    toast.loading('Deploying to Vercel...', {
      duration: 2000,
      onAutoClose: () => {
        toast.success('Successfully deployed to Vercel');
      },
    });
  };

  const handleExportToGithub = () => {
    // This would handle GitHub export logic
    toast.info('GitHub export feature coming soon');
  };

  const handleShare = () => {
    if (!currentComponent) {
      toast.error('No component to share');
      return;
    }

    // Generate a mock share URL with the actual component ID or a stable random ID
    const componentId = currentComponent.id || Math.floor(Date.now()).toString();
    const shareUrl = `${window.location.origin}/share/${componentId}`;
    setShareLink(shareUrl);
    setIsShareDialogOpen(true);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success('Session saved successfully');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear this session? This action cannot be undone.')) {
      toast.success('Session cleared successfully');
    }
  };

  return (
    <div className="h-14 border-b border-border/30 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="h-8 w-8 p-0 rounded-lg hover:bg-muted/60 transition-all duration-200"
        >
          <Icons.menu className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-purple-600/15 border border-primary/20 flex items-center justify-center">
              <Icons.code className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-sm text-foreground/90">AI Frontend Playground</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-3">
            <div className="w-px h-3 bg-border/50" />
            <span className="text-xs text-muted-foreground font-medium">
              {currentComponent ? currentComponent.name || 'Untitled Component' : 'Current Session'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {/* Mobile Preview Toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="h-8 px-3 rounded-lg hover:bg-muted/60 transition-all duration-200"
          >
            <Icons.eye className="w-4 h-4 mr-1.5" />
            <span className="text-xs">{previewVisible ? 'Code' : 'Preview'}</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className={cn("h-8 px-3 rounded-lg hover:bg-muted/60 transition-all duration-200", isMobile && "hidden sm:flex")}
        >
          <Icons.save className="w-4 h-4 mr-1.5" />
          <span className="text-xs">Save</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-lg hover:bg-muted/60 transition-all duration-200"
              disabled={isExporting || isZipExporting || !currentComponent}
            >
              {isExporting || isZipExporting ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-1.5 animate-spin" />
                  <span className="text-xs">Exporting...</span>
                </>
              ) : (
                <>
                  <Icons.download className="w-4 h-4 mr-1.5" />
                  <span className="text-xs">Export</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleExport} disabled={!currentComponent}>
              <Icons.fileCode className="w-4 h-4 mr-2" />
              Export as TSX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCss} disabled={!currentComponent || !currentComponent?.css}>
              <Icons.palette className="w-4 h-4 mr-2" />
              Export CSS
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleExportAsZip} 
              disabled={!currentComponent || isZipExporting}
            >
              <Icons.download className="w-4 h-4 mr-2" />
              {isZipExporting ? (
                <>Preparing ZIP...</>
              ) : (
                <>Export as ZIP</>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg hover:bg-muted/60 transition-all duration-200">
              <Icons.upload className="w-4 h-4 mr-1.5" />
              <span className="text-xs">Deploy</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleDeploy}>
              <Icons.upload className="w-4 h-4 mr-2" />
              Deploy to Vercel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportToGithub}>
              <Icons.github className="w-4 h-4 mr-2" />
              Export to GitHub
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleShare}>
              <Icons.share className="w-4 h-4 mr-2" />
              Share Preview Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-4 bg-border/40 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="h-8 w-8 p-0 rounded-lg hover:bg-muted/60 transition-all duration-200"
        >
          {isDarkMode ? (
            <Icons.sun className="h-4 w-4" />
          ) : (
            <Icons.moon className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-muted/60 transition-all duration-200">
              <Icons.settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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
              <Icons.logOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Component</DialogTitle>
            <DialogDescription>
              Share a preview link of your component with others
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 pt-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="share-link" className="sr-only">Link</Label>
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                className="h-9"
              />
            </div>
            <Button size="sm" onClick={handleCopyShareLink}>
              <Icons.copy className="h-3.5 w-3.5 mr-1" />
              Copy
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsShareDialogOpen(false)}
              className="mt-2"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
