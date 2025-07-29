import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as Babel from '@babel/standalone';
// ...other existing imports...

// Injected preview component using Babel + ReactDOM:
const ComponentPreview: React.FC<{ options: { jsx: string; css: string; props: any } }> = ({ options }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [removedImports, setRemovedImports] = useState<string[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    setError(null);

    // 1. extract and strip import/export lines (remove entire lines)
    const importExportPattern = /^[ \t]*(?:import|export)[\s\S]*?;?[\r\n]*/gm;
    const imports = options.jsx.match(importExportPattern) || [];
    setRemovedImports(imports);
    const codeToTransform = options.jsx.replace(importExportPattern, '');

    // 2. unmount previous render
    ReactDOM.unmountComponentAtNode(containerRef.current);

    // 3. inject CSS
    if (options.css) {
      let styleTag = document.getElementById('component-preview-style');
      if (styleTag) styleTag.remove();
      styleTag = document.createElement('style');
      styleTag.id = 'component-preview-style';
      styleTag.textContent = options.css;
      document.head.appendChild(styleTag);
    }

    try {
      // 4. transform stripped code
      const { code } = Babel.transform(codeToTransform, {
        filename: 'preview.tsx',
        presets: ['typescript', 'react'],
      });
      // wrap code in an eval sandbox
      const Component = (() => {
        const exports: any = {};
        const module = { exports }; // ← add this line
        // eslint-disable-next-line no-eval
        eval(`${code}; exports.default = exports.default || module.exports;`);
        return exports.default;
      })();
      if (!Component) throw new Error('No component exported');

      // render into our container
      ReactDOM.render(React.createElement(Component, options.props), containerRef.current);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [options]);

  return (
    <div>
      {/* show notice if imports were stripped */}
      {removedImports.length > 0 && (
        <div className="text-xs text-muted-foreground mb-2">
          Removed imports: {removedImports.map((i, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && ', '}
              <code>{i}</code>
            </React.Fragment>
          ))}
        </div>
      )}
      <div ref={containerRef} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default ComponentPreview;
// …rest of existing code…
