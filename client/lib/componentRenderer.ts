import { transform } from '@babel/standalone';

export interface RenderOptions {
  jsx: string;
  css?: string;
  props?: Record<string, any>;
}

export function renderComponent() {
  console.warn('componentRenderer is deprecated—use direct Babel + ReactDOM in ComponentPreview.tsx');
}
const compilationCache = new Map<string, string>();

// Generate hash for caching
function generateHash(jsx: string, props: Record<string, any>): string {
  return btoa(jsx + JSON.stringify(props)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
}

export class ComponentRenderer {
  private iframe: HTMLIFrameElement | null = null;
  private container: HTMLElement | null = null;
  private isReady = false;
  private pendingRender: (() => void) | null = null;
  private renderTimeout: NodeJS.Timeout | null = null;
  private currentHash = '';
  private initPromise: Promise<void> | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    console.log('Initializing ComponentRenderer...');
    
    // Clean up existing iframe
    if (this.iframe) {
      this.iframe.remove();
    }

    return new Promise((resolve, reject) => {
      this.iframe = document.createElement('iframe');
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.iframe.style.border = 'none';
      this.iframe.style.display = 'block';
      
      // Use minimal sandbox for better compatibility
      this.iframe.setAttribute('sandbox', 'allow-scripts');
      
      // Create iframe content immediately
      this.iframe.srcdoc = this.createIframeContent();
      
      this.container?.appendChild(this.iframe);
      
      // Wait for iframe to load
      let attempts = 0;
      const maxAttempts = 30;
      
      const checkReady = () => {
        attempts++;
        
        try {
          const win = this.iframe?.contentWindow as any;
          const doc = this.iframe?.contentDocument;
          
          if (win && doc && win.React && win.ReactDOM) {
            console.log('ComponentRenderer ready!');
            this.isReady = true;
            resolve();
            
            // Execute pending render if any
            if (this.pendingRender) {
              this.pendingRender();
              this.pendingRender = null;
            }
            return;
          }
        } catch (error) {
          console.warn('Error checking iframe readiness:', error);
        }
        
        if (attempts >= maxAttempts) {
          console.error('ComponentRenderer initialization timeout');
          reject(new Error('Initialization timeout'));
        } else {
          setTimeout(checkReady, 200);
        }
      };
      
      // Start checking after iframe loads
      this.iframe.onload = () => {
        setTimeout(checkReady, 100);
      };
      
      this.iframe.onerror = () => {
        reject(new Error('Failed to load iframe'));
      };
    });
  }

  private createIframeContent(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio"></script>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background: #ffffff;
              color: #000000;
              min-height: 100vh;
              overflow: auto;
            }
            * { box-sizing: border-box; }
            #root {
              min-height: 100vh;
              width: 100%;
              display: block;
            }
            .error-boundary {
              padding: 20px;
              background: #fee;
              border: 1px solid #fcc;
              border-radius: 8px;
              color: #c33;
              font-family: monospace;
              white-space: pre-wrap;
              margin: 20px;
            }
            .loading {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 200px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div id="root"><div class="loading">Loading component...</div></div>
          <script>
            window.renderError = function(error) {
              console.error('Render error:', error);
              const root = document.getElementById('root');
              if (root) {
                root.innerHTML = '<div class="error-boundary">Component Error:\\n' + error + '</div>';
              }
            };
            
            window.addEventListener('error', function(e) {
              console.error('Window error:', e);
              if (window.renderError) {
                window.renderError(e.message + '\\n' + (e.stack || ''));
              }
            });
            
            window.rootInstance = null;
            console.log('Iframe content loaded');
          </script>
        </body>
      </html>
    `;
  }

  public async render(options: RenderOptions): Promise<void> {
    // Wait for initialization
    if (this.initPromise) {
      await this.initPromise;
    }

    // Clear any existing timeout
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }

    // Debounce renders
    const hash = generateHash(options.jsx, options.props || {});
    if (hash === this.currentHash) {
      console.log('Skipping render - same content');
      return;
    }
    this.currentHash = hash;

    return new Promise((resolve) => {
      this.renderTimeout = setTimeout(async () => {
        try {
          await this.performRender(options);
          resolve();
        } catch (error) {
          console.error('Render error:', error);
          this.renderError(error as Error);
          resolve();
        }
      }, 100);
    });
  }

  private async performRender(options: RenderOptions): Promise<void> {
    if (!this.isReady) {
      console.log('Renderer not ready, queuing render');
      this.pendingRender = () => this.performRender(options);
      return;
    }

    console.log('Performing render...');
    
    try {
      const compiledCode = await this.compileComponent(options);
      this.executeInIframe(compiledCode, options.css || '');
    } catch (error) {
      console.error('Render failed:', error);
      this.renderError(error as Error);
    }
  }

  private async compileComponent(options: RenderOptions): Promise<string> {
    const { jsx, props = {} } = options;
    
    // Clean JSX code
    let componentCode = jsx;
    
    // Extract component name
    const componentNameMatch = jsx.match(/(?:export\s+(?:default\s+)?)?(?:function|const|class)\s+(\w+)/) ||
                              jsx.match(/const\s+(\w+)\s*[:=]/) ||
                              jsx.match(/function\s+(\w+)/);
    const componentName = componentNameMatch?.[1] || 'GeneratedComponent';
    
    // Remove imports and exports
    componentCode = componentCode.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '');
    componentCode = componentCode.replace(/import\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];?\s*/g, '');
    componentCode = componentCode.replace(/export\s+default\s+/g, '');
    componentCode = componentCode.replace(/export\s+/g, '');
    
    // Add React globals
    const reactGlobals = `
      const React = window.React;
      const { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createElement, Fragment } = React;
    `;
    
    componentCode = reactGlobals + componentCode;

    try {
      const result = transform(componentCode, {
        filename: 'component.tsx',
        presets: [
          ['react', { 
            runtime: 'classic',
            pragma: 'React.createElement',
            pragmaFrag: 'React.Fragment'
          }],
          ['typescript', { 
            isTSX: true, 
            allExtensions: true,
            allowDeclareFields: true,
            onlyRemoveTypeImports: true
          }]
        ]
      });

      if (!result.code) {
        throw new Error('Babel transformation returned empty code');
      }

      const propsString = JSON.stringify(props);
      
      return `
        try {
          console.log('Executing compiled component code');
          ${result.code}
          
          // Create root if needed
          if (!window.rootInstance) {
            const rootElement = document.getElementById('root');
            if (!rootElement) {
              throw new Error('Root element not found');
            }
            window.rootInstance = ReactDOM.createRoot(rootElement);
          }
          
          function App() {
            try {
              return React.createElement(${componentName}, ${propsString});
            } catch (error) {
              console.error('Component render error:', error);
              return React.createElement('div', { className: 'error-boundary' }, 
                'Component Error: ' + error.message
              );
            }
          }
          
          window.rootInstance.render(React.createElement(App));
          console.log('Component rendered successfully');
        } catch (error) {
          console.error('Execution error:', error);
          window.renderError('Execution Error: ' + error.message);
        }
      `;
    } catch (error) {
      console.error('Compilation error:', error);
      throw new Error(`Compilation failed: ${error}`);
    }
  }

  private executeInIframe(compiledCode: string, css: string) {
    if (!this.iframe?.contentDocument) {
      console.error('No iframe document available');
      return;
    }

    const doc = this.iframe.contentDocument;
    
    // Add CSS if provided
    if (css) {
      let styleElement = doc.querySelector('#custom-styles') as HTMLStyleElement;
      if (!styleElement) {
        styleElement = doc.createElement('style');
        styleElement.id = 'custom-styles';
        doc.head.appendChild(styleElement);
      }
      styleElement.textContent = css;
    }

    // Execute the code
    try {
      const script = doc.createElement('script');
      script.textContent = compiledCode;
      doc.body.appendChild(script);
      
      // Clean up script element
      setTimeout(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }, 100);
    } catch (error) {
      console.error('Script execution failed:', error);
      this.renderError(error as Error);
    }
  }

  public verifyRender(): boolean {
    try {
      const doc = this.iframe?.contentDocument;
      if (!doc) return false;
      
      const root = doc.getElementById('root');
      if (!root) return false;
      
      const hasContent = !root.innerHTML.includes('Loading component') && 
                        !root.innerHTML.includes('class="loading"') &&
                        root.children.length > 0;
      
      return hasContent;
    } catch (error) {
      console.error('Error verifying render:', error);
      return false;
    }
  }

  private renderError(error: Error) {
    if (!this.iframe?.contentWindow) return;
    
    try {
      const win = this.iframe.contentWindow as any;
      if (typeof win.renderError === 'function') {
        win.renderError(error.message + '\n' + (error.stack || ''));
      }
    } catch (err) {
      console.error('Failed to render error in iframe:', err);
    }
  }

  public destroy() {
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
    this.isReady = false;
    this.pendingRender = null;
    this.initPromise = null;
  }
}
