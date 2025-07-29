import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { ComponentPreview } from '@/components/workspace/ComponentPreview';
import { apiClient } from '@/lib/api';
import { CodeHighlight } from '@/components/ui/code-highlight';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface SharedComponent {
  id: string;
  name: string;
  jsx: string;
  css: string;
  props: Record<string, any>;
}

export default function Share() {
  const { componentId } = useParams();
  const [component, setComponent] = useState<SharedComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    const fetchSharedComponent = async () => {
      if (!componentId) {
        setError('Invalid component ID');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching component with ID:', componentId);
        setIsLoading(true);
        
        // Fetch the component data
        const response = await apiClient.getSharedComponent(componentId);
        console.log('Received component data:', response);
        setComponent(response);
      } catch (err) {
        console.error('Error fetching shared component:', err);
        setError('Unable to load the shared component. It may have expired or been removed.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedComponent();
  }, [componentId]);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/10">
        <Icons.spinner className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading shared component...</p>
        <p className="text-muted-foreground mt-2">Component ID: {componentId}</p>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/10 p-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Icons.alertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Component Not Found</h1>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {error || "The component you're looking for doesn't exist or has been removed."}
        </p>
        <p className="text-sm text-muted-foreground mb-6">Component ID: {componentId}</p>
        <Link to="/">
          <Button className="btn-primary">
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center shadow-lg">
              <Icons.code className="w-4 h-4" />
            </div>
            <span className="font-semibold text-lg">AI Frontend Playground</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/signup">
              <Button size="sm" className="btn-primary shadow-sm">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Component Info */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{component.name}</h1>
            <p className="text-muted-foreground">
              Shared component preview. Create your own AI-generated components at AI Frontend Playground.
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/30 border border-border/30 rounded-lg p-1 mb-6">
              <TabsTrigger value="preview" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Icons.eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Icons.fileCode className="w-4 h-4 mr-2" />
                Code
              </TabsTrigger>
              <TabsTrigger value="styles" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Icons.palette className="w-4 h-4 mr-2" />
                CSS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="p-6 border rounded-lg bg-card/30 shadow-sm min-h-[400px]">
              <ComponentPreview component={component} />
            </TabsContent>

            <TabsContent value="code">
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                  <span className="font-medium">
                    {component.name}.tsx
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(component.jsx)}
                    className="h-8 px-3 rounded-lg hover:bg-muted/60"
                  >
                    <Icons.copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </Button>
                </div>
                <div className="p-4 bg-muted/10">
                  <CodeHighlight 
                    code={component.jsx} 
                    language="tsx"
                    className="max-h-[500px] overflow-auto"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="styles">
              {component.css ? (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <span className="font-medium">
                      styles.css
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(component.css)}
                      className="h-8 px-3 rounded-lg hover:bg-muted/60"
                    >
                      <Icons.copy className="w-3.5 h-3.5 mr-1.5" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/10">
                    <CodeHighlight 
                      code={component.css} 
                      language="css"
                      className="max-h-[400px] overflow-auto"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 border rounded-lg bg-card/30">
                  <Icons.palette className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                  <p className="font-medium mb-1">No CSS Found</p>
                  <p className="text-muted-foreground text-sm">This component uses Tailwind CSS classes for styling.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Want to create your own components with AI assistance?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button className="btn-primary w-full sm:w-auto">
                  Sign Up Free
                  <Icons.chevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-background/50 mt-10">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Frontend Playground. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
