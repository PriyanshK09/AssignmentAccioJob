import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';

interface PreviewPanelProps {
  onClose?: () => void;
}

export function PreviewPanel({ onClose }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState('preview');
  
  const sampleComponent = `import React from 'react';
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
}`;

  const sampleCSS = `.custom-component {
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.custom-component h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.custom-component p {
  color: #6b7280;
  margin-bottom: 1rem;
}`;

  // Sample preview component
  const PreviewComponent = () => (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Custom Component</h2>
      <p className="text-gray-600 mb-4">
        This is a sample component based on your request.
      </p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Click me
      </button>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-preview-bg">
      <div className="border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between px-4 py-2">
            <TabsList className="grid w-full max-w-sm grid-cols-4">
              <TabsTrigger value="preview" className="text-xs">
                <Icons.eye className="w-3 h-3 mr-1" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs">
                <Icons.fileCode className="w-3 h-3 mr-1" />
                Code
              </TabsTrigger>
              <TabsTrigger value="props" className="text-xs">
                <Icons.settings className="w-3 h-3 mr-1" />
                Props
              </TabsTrigger>
              <TabsTrigger value="styles" className="text-xs">
                <Icons.palette className="w-3 h-3 mr-1" />
                CSS
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-1">
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                  <Icons.close className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Icons.download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Icons.share className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="preview" className="mt-0 h-full">
            <div className="h-full bg-gray-50">
              <div className="p-6">
                <div className="bg-white rounded-lg border border-gray-200 p-1">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-t-md">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="ml-auto text-xs text-gray-500">
                      Live Preview
                    </div>
                  </div>
                  <div className="p-8 bg-white">
                    <PreviewComponent />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="mt-0 h-full">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="bg-editor-bg rounded-lg border border-border">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <span className="text-sm font-medium">CustomComponent.tsx</span>
                    <Button variant="ghost" size="sm">
                      <Icons.fileCode className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="p-4 text-sm font-mono overflow-x-auto">
                    <code className="text-foreground">{sampleComponent}</code>
                  </pre>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="props" className="mt-0 h-full">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <h3 className="text-sm font-medium">Component Props</h3>
                <div className="space-y-3">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">title</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">string</span>
                    </div>
                    <input 
                      type="text" 
                      defaultValue="Custom Component"
                      className="w-full text-sm p-2 border border-border rounded"
                    />
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">description</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">string</span>
                    </div>
                    <textarea 
                      defaultValue="This is a sample component based on your request."
                      className="w-full text-sm p-2 border border-border rounded resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">buttonText</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">string</span>
                    </div>
                    <input 
                      type="text" 
                      defaultValue="Click me"
                      className="w-full text-sm p-2 border border-border rounded"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="styles" className="mt-0 h-full">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="bg-editor-bg rounded-lg border border-border">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <span className="text-sm font-medium">styles.css</span>
                    <Button variant="ghost" size="sm">
                      <Icons.palette className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="p-4 text-sm font-mono overflow-x-auto">
                    <code className="text-foreground">{sampleCSS}</code>
                  </pre>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
