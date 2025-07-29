import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';
import { toast } from 'sonner';
import { CodeHighlight } from '@/components/ui/code-highlight';
import { ComponentPreview } from './ComponentPreview';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Component {
  id: string;
  name: string;
  jsx: string;
  css: string;
  props: Record<string, any>;
}

interface PreviewPanelProps {
  currentComponent?: Component;
  onClose?: () => void;
}

export function PreviewPanel({ currentComponent, onClose }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const [propValues, setPropValues] = useState<Record<string, any>>({});
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  // Extract props from JSX code
  const extractedProps = useMemo(() => {
    if (!currentComponent?.jsx) return [];
    
    const propsRegex = /interface\s+\w+Props\s*\{([^}]+)\}/;
    const match = currentComponent.jsx.match(propsRegex);
    
    if (!match) return [];
    
    const propsString = match[1];
    const propLines = propsString.split('\n').filter(line => line.trim());
    
    return propLines.map(line => {
      const cleanLine = line.trim().replace(/[;,]/g, '');
      const [name, type] = cleanLine.split(':').map(s => s.trim());
      const optional = name?.includes('?');
      const cleanName = name?.replace('?', '');
      
      return {
        name: cleanName,
        type: type || 'string',
        optional,
        defaultValue: getDefaultValue(type, cleanName)
      };
    }).filter(prop => prop.name);
  }, [currentComponent?.jsx]);

  function getDefaultValue(type: string, name: string) {
    if (type?.includes('string')) {
      if (name?.toLowerCase().includes('title')) return 'Sample Title';
      if (name?.toLowerCase().includes('text')) return 'Sample text content';
      if (name?.toLowerCase().includes('label')) return 'Label';
      return 'Sample text';
    }
    if (type?.includes('number')) return 0;
    if (type?.includes('boolean')) return false;
    return '';
  }

  // Copy to clipboard function
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  // Share functionality
  const handleShare = () => {
    if (!currentComponent) {
      toast.error('No component to share');
      return;
    }

    // Generate a share URL (in a real app, this would create a shareable link)
    const componentId = currentComponent.id || Math.random().toString(36).substring(2, 10);
    const shareUrl = `${window.location.origin}/share/${componentId}`;
    setShareLink(shareUrl);
    setIsShareDialogOpen(true);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => toast.success('Share link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/5">
      <div className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between px-4 py-2">
            <TabsList className="grid w-full max-w-sm grid-cols-4 bg-muted/30 border border-border/30 rounded-lg p-1">
              <TabsTrigger value="preview" className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Icons.eye className="w-3 h-3 mr-1.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Icons.fileCode className="w-3 h-3 mr-1.5" />
                Code
              </TabsTrigger>
              <TabsTrigger value="props" className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Icons.settings className="w-3 h-3 mr-1.5" />
                Props
              </TabsTrigger>
              <TabsTrigger value="styles" className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Icons.palette className="w-3 h-3 mr-1.5" />
                CSS
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-1">
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden h-8 w-8 p-0 rounded-lg">
                  <Icons.close className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex h-8 px-3 rounded-lg hover:bg-muted/60"
                onClick={() => currentComponent?.jsx && copyToClipboard(currentComponent.jsx)}
              >
                <Icons.copy className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex h-8 px-3 rounded-lg hover:bg-muted/60"
                onClick={handleShare}
              >
                <Icons.share className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="preview" className="mt-0 flex-1">
            <div className="h-[calc(100vh-12rem)]">
              <ComponentPreview 
                component={currentComponent}
                props={propValues}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="mt-0 flex-1">
            <div className="h-[calc(100vh-12rem)] overflow-hidden">
              <div className="p-4 lg:p-6 h-full">
                <div className="bg-slate-950 rounded-xl border border-slate-800/50 h-full flex flex-col shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50 flex-shrink-0 rounded-t-xl">
                    <span className="text-sm font-medium text-slate-200">
                      {currentComponent?.name || 'Component'}.tsx
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => currentComponent?.jsx && copyToClipboard(currentComponent.jsx)}
                      className="text-slate-400 hover:text-white hover:bg-slate-800/50 h-7 px-2 rounded-md"
                    >
                      <Icons.copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto bg-slate-950/50">
                    <div className="p-4">
                      {currentComponent?.jsx ? (
                        <CodeHighlight 
                          code={currentComponent.jsx} 
                          language="tsx"
                        />
                      ) : (
                        <div className="text-center text-slate-400 py-12">
                          <Icons.code className="w-12 h-12 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">No code generated yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="props" className="mt-0 flex-1">
            <div className="h-[calc(100vh-12rem)] overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <h3 className="text-sm font-medium">Component Props</h3>
                  {extractedProps.length > 0 ? (
                    <div className="space-y-3">
                      {extractedProps.map((prop) => (
                        <div key={prop.name} className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{prop.name}</span>
                            <span className="text-xs bg-muted px-2 py-1 rounded">{prop.type}</span>
                          </div>
                          {prop.type.includes('string') ? (
                            <input 
                              type="text" 
                              value={propValues[prop.name] || prop.defaultValue}
                              onChange={(e) => setPropValues(prev => ({ ...prev, [prop.name]: e.target.value }))}
                              className="w-full text-sm p-2 border border-border rounded"
                            />
                          ) : prop.type.includes('boolean') ? (
                            <input 
                              type="checkbox" 
                              checked={propValues[prop.name] || prop.defaultValue}
                              onChange={(e) => setPropValues(prev => ({ ...prev, [prop.name]: e.target.checked }))}
                              className="w-4 h-4"
                            />
                          ) : (
                            <input 
                              type="text" 
                              value={propValues[prop.name] || prop.defaultValue}
                              onChange={(e) => setPropValues(prev => ({ ...prev, [prop.name]: e.target.value }))}
                              className="w-full text-sm p-2 border border-border rounded"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Icons.settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No props found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="styles" className="mt-0 flex-1">
            <div className="h-[calc(100vh-12rem)] overflow-hidden">
              <div className="p-4 lg:p-6 h-full">
                <div className="bg-slate-950 rounded-xl border border-slate-800/50 h-full flex flex-col shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/50 flex-shrink-0 rounded-t-xl">
                    <span className="text-sm font-medium text-slate-200">styles.css</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => currentComponent?.css && copyToClipboard(currentComponent.css)}
                      className="text-slate-400 hover:text-white hover:bg-slate-800/50 h-7 px-2 rounded-md"
                    >
                      <Icons.copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto bg-slate-950/50">
                    <div className="p-4">
                      {currentComponent?.css ? (
                        <CodeHighlight 
                          code={currentComponent.css} 
                          language="css"
                        />
                      ) : (
                        <div className="text-center text-slate-400 py-12">
                          <Icons.palette className="w-12 h-12 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">No custom CSS</p>
                          <p className="text-xs opacity-60 mt-1">Component uses Tailwind classes</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Component</DialogTitle>
            <DialogDescription>
              Share this component with others via this link
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 pt-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                readOnly
                value={shareLink}
                className="h-9"
              />
            </div>
            <Button onClick={handleCopyShareLink} size="sm" className="px-3">
              <span className="sr-only">Copy</span>
              <Icons.copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="secondary"
              onClick={() => setIsShareDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}