import { cn } from '@/lib/utils';

interface CodeHighlightProps {
  code: string;
  language?: string;
  className?: string;
}

const tokenPatterns = {
  // Keywords (blue)
  keyword: /\b(import|export|from|as|default|const|let|var|function|class|interface|type|enum|public|private|protected|static|readonly|async|await|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|abstract|namespace|module|declare|any|string|number|boolean|object|undefined|null|void|never)\b/g,
  
  // React/JSX keywords (purple)
  react: /\b(React|Component|useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|Fragment|jsx|tsx)\b/g,
  
  // Strings (green)
  string: /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g,
  
  // Comments (gray)
  comment: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
  
  // Numbers (orange)
  number: /\b\d+(\.\d+)?\b/g,
  
  // JSX tags (red)
  jsxTag: /<\/?[A-Z][a-zA-Z0-9]*\b[^>]*>/g,
  
  // HTML tags (red)
  htmlTag: /<\/?[a-z][a-zA-Z0-9-]*\b[^>]*>/g,
  
  // Props/attributes (cyan)
  prop: /\b[a-zA-Z][a-zA-Z0-9]*(?=\s*=)/g,
  
  // Functions (yellow)
  function: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g,
  
  // Operators (white/default)
  operator: /[+\-*/%=<>!&|^~?:]/g,
  
  // Brackets and punctuation
  punctuation: /[{}[\]();,.]/g,
};

const tokenStyles = {
  keyword: 'text-blue-400',
  react: 'text-purple-400',
  string: 'text-green-400',
  comment: 'text-gray-500 italic',
  number: 'text-orange-400',
  jsxTag: 'text-red-400',
  htmlTag: 'text-red-400',
  prop: 'text-cyan-400',
  function: 'text-yellow-400',
  operator: 'text-gray-300',
  punctuation: 'text-gray-300',
};

export function CodeHighlight({ code, language = 'tsx', className }: CodeHighlightProps) {
  const highlightCode = (text: string) => {
    let highlightedCode = text;
    let offset = 0;
    const tokens: Array<{ start: number; end: number; type: keyof typeof tokenStyles; match: string }> = [];

    // Extract all tokens
    Object.entries(tokenPatterns).forEach(([type, pattern]) => {
      const matches = Array.from(text.matchAll(pattern));
      matches.forEach(match => {
        if (match.index !== undefined) {
          tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            type: type as keyof typeof tokenStyles,
            match: match[0]
          });
        }
      });
    });

    // Sort tokens by position and remove overlaps
    tokens.sort((a, b) => a.start - b.start);
    const cleanTokens = [];
    let lastEnd = 0;

    for (const token of tokens) {
      if (token.start >= lastEnd) {
        cleanTokens.push(token);
        lastEnd = token.end;
      }
    }

    // Apply highlighting
    const parts = [];
    let currentIndex = 0;

    cleanTokens.forEach(token => {
      // Add text before token
      if (currentIndex < token.start) {
        parts.push(
          <span key={`text-${currentIndex}`} className="text-gray-200">
            {text.slice(currentIndex, token.start)}
          </span>
        );
      }

      // Add highlighted token
      parts.push(
        <span key={`token-${token.start}`} className={tokenStyles[token.type]}>
          {token.match}
        </span>
      );

      currentIndex = token.end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(
        <span key={`text-${currentIndex}`} className="text-gray-200">
          {text.slice(currentIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <pre className={cn("text-sm font-mono leading-relaxed overflow-auto min-w-max", className)}>
      <code className="block">
        {highlightCode(code)}
      </code>
    </pre>
  );
}
