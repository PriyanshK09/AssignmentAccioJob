import React, { useEffect, useRef, useState } from 'react';
import * as Babel from '@babel/standalone';
import { createRoot, Root } from 'react-dom/client';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Component {
  id: string;
  name: string;
  jsx: string;
  css: string;
  props: Record<string, any>;
}

export function ComponentPreview({ component, props = {}, className }: {
  component?: Component;
  props?: Record<string, any>;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  // Create fresh container and root on mount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      // Mark component as unmounted to prevent state updates
      mountedRef.current = false;
      
      // Clean up React root
      if (rootRef.current) {
        try {
          rootRef.current.unmount();
        } catch (e) {
          console.error('Error unmounting React root:', e);
        }
        rootRef.current = null;
      }
    };
  }, []);

  // Render whenever component or props change
  useEffect(() => {
    if (!component || !containerRef.current) return;
    setError(null);
    setIsLoading(true);

    // Ensure container is empty and create a fresh root
    if (rootRef.current) {
      try {
        rootRef.current.unmount();
      } catch (e) {
        console.warn('Error unmounting previous root:', e);
      }
      rootRef.current = null;
    }
    
    // Create new root
    try {
      rootRef.current = createRoot(containerRef.current);
    } catch (e) {
      console.error('Error creating root:', e);
      setError(`Failed to create rendering context: ${e}`);
      setIsLoading(false);
      return;
    }

    // Inject CSS if needed
    if (component.css) {
      const existing = document.getElementById('component-preview-style');
      if (existing) existing.remove();
      const style = document.createElement('style');
      style.id = 'component-preview-style';
      style.textContent = component.css;
      document.head.appendChild(style);
    }

    try {
      // 1. Remove imports
      const withoutImports = component.jsx.replace(/^\s*import.*;?\s*$/gm, '');

      // 2. Detect the default export name
      const match = withoutImports.match(/export\s+default\s+(?:function\s+)?(\w+)/m);
      const compName = match?.[1] || 'UnknownComponent';

      // 3. Strip only the export keyword
      let cleaned = withoutImports
        .replace(/^\s*export\s+default\s+/m, '')
        .replace(/^\s*export\s+\{[^}]*\}\s*;?\s*$/gm, '');

      // 4. Ensure exports.default points at our component
      cleaned += `\nexports.default = ${compName};`;

      // 5. Compile via Babel with classic runtime
      const { code } = Babel.transform(cleaned, {
        filename: 'preview.tsx',
        presets: [
          ['react', { 
            runtime: 'classic',
            pragma: 'React.createElement',
            pragmaFrag: 'React.Fragment'
          }],
          ['typescript', {
            isTSX: true,
            allExtensions: true
          }]
        ]
      });

      // 6. Eval and render
      const Comp = (() => {
        const exports: any = {};
        const module = { exports };
        // eslint-disable-next-line no-eval
        // wrap in IIFE so React from closure is available
        eval(`(function(React){${code};})(React);`);
        return exports.default || module.exports;
      })();

      if (typeof Comp !== 'function') {
        throw new Error('Invalid component export');
      }
      
      // Only render if component is still mounted
      if (mountedRef.current && rootRef.current) {
        rootRef.current.render(React.createElement(Comp, { ...component.props, ...props }));
      }
      
      // Don't update state if unmounted
      if (mountedRef.current) {
        setIsLoading(false);
      }
    } catch (e: any) {
      // Enhanced error message with more details
      setError(`Render error: ${e.message || String(e)}\n\nThis might be due to invalid JSX or TypeScript code in the component.`);
      console.error('Component render error:', e);
      setIsLoading(false);
    }
  }, [component, props]);

  if (!component) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-muted/10", className)}>
        <Icons.code className="w-12 h-12 text-muted-foreground/60" />
        <p className="ml-2 text-muted-foreground">No component to preview</p>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full flex flex-col", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
          <Icons.spinner className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      )}
      {error && !isLoading && (
        <div className="absolute inset-0 p-4 bg-red-50 border border-red-200 rounded z-20">
          <div className="flex items-start space-x-2">
            <Icons.alertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-medium text-red-800">Render Error</h4>
              <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
              <Button size="sm" variant="outline" onClick={() => setError(null)} className="mt-3">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
      <div ref={containerRef} className="flex-1" />
    </div>
  );
}