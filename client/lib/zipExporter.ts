import JSZip from 'jszip';

interface Component {
  id: string;
  name: string;
  jsx: string;
  css?: string;
  props?: Record<string, any>;
}

interface ExportOptions {
  component: Component;
  componentName: string;
  includeReadme?: boolean;
  includePackageJson?: boolean;
}

/**
 * Creates a README.md file with component documentation
 */
function generateReadme(component: Component, componentName: string): string {
  return `# ${componentName}

A React component generated with AI Frontend Playground.

## Description

${component.name} is a React component that can be integrated into your projects.

## Usage

\`\`\`tsx
import { ${componentName} } from './${componentName}';

function App() {
  return <${componentName} />;
}
\`\`\`

## Props

The component accepts the following props:

\`\`\`tsx
// Add any props your component accepts
\`\`\`

## License

MIT
`;
}

/**
 * Creates a package.json file for the component
 */
function generatePackageJson(componentName: string): string {
  return JSON.stringify(
    {
      name: componentName.toLowerCase(),
      version: '1.0.0',
      description: `${componentName} React component`,
      main: `${componentName}.tsx`,
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      keywords: ['react', 'component', 'typescript', 'tailwindcss'],
      author: '',
      license: 'MIT',
      peerDependencies: {
        react: '>=16.8.0',
        'react-dom': '>=16.8.0',
      },
    },
    null,
    2
  );
}

/**
 * Creates a simple index.ts file to export the component
 */
function generateIndexFile(componentName: string): string {
  return `export * from './${componentName}';\n`;
}

/**
 * Cleans up TypeScript JSX code by removing React imports 
 * and adding proper import statements
 */
function processJsxCode(jsx: string): string {
  // Add React import if not present
  if (!jsx.includes('import React')) {
    jsx = `import React from 'react';\n${jsx}`;
  }
  
  // Remove any temporary React globals that might be in the code
  jsx = jsx.replace(/const React = window\.React;/g, '');
  jsx = jsx.replace(/const \{ useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createElement, Fragment \} = React;/g, '');
  
  return jsx;
}

/**
 * Exports a component as a ZIP file containing all necessary files
 */
export async function exportComponentAsZip({
  component,
  componentName,
  includeReadme = true,
  includePackageJson = true
}: ExportOptions): Promise<void> {
  try {
    // Initialize JSZip
    const zip = new JSZip();
    
    // Create a folder for the component
    const folder = zip.folder(componentName);
    if (!folder) throw new Error('Failed to create folder in ZIP');
    
    // Process and add the main component file
    const processedJsx = processJsxCode(component.jsx);
    folder.file(`${componentName}.tsx`, processedJsx);
    
    // Add CSS file if it exists
    if (component.css && component.css.trim()) {
      folder.file(`${componentName}.css`, component.css);
    }
    
    // Add index file for easier imports
    folder.file('index.ts', generateIndexFile(componentName));
    
    // Add README.md if requested
    if (includeReadme) {
      folder.file('README.md', generateReadme(component, componentName));
    }
    
    // Add package.json if requested
    if (includePackageJson) {
      folder.file('package.json', generatePackageJson(componentName));
    }
    
    // Generate the ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${componentName}.zip`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error('Error generating ZIP:', error);
    throw new Error('Failed to create ZIP file');
  }
}
