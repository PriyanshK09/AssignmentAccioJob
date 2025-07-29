import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
});

export interface ComponentGenerationRequest {
  prompt: string;
  previousCode?: string;
  context?: string;
}

export interface ComponentGenerationResponse {
  jsx: string;
  css: string;
  explanation: string;
  componentName: string;
}

export async function generateComponent(request: ComponentGenerationRequest): Promise<ComponentGenerationResponse> {
  const systemPrompt = `You are an expert React developer. Generate clean, modern React components based on user requirements.

Rules:
1. Always return valid TSX/JSX code that can be compiled and executed
2. Use modern React patterns (hooks, functional components)
3. Include proper TypeScript types and interfaces
4. Use Tailwind CSS classes for styling
5. Make components responsive and accessible
6. Include proper imports for React hooks used
7. Generate a meaningful component name in PascalCase
8. Ensure the component is fully functional and interactive
9. Add proper event handlers and state management where needed
10. Use semantic HTML elements for accessibility
11. Make the output code self-contained and not rely on external libraries beyond React and standard hooks
12. Make sure the component is self-contained and executable. Do not use external dependencies beyond React and standard hooks.
13. Strip out all TypeScript syntax (interfaces, type annotations, generics) and output plain JavaScript (JSX) code that Babel can parse.

Important: The component must be self-contained and executable. Do not use external dependencies beyond React and standard hooks.

Format your response as JSON:
{
  "jsx": "complete component code with imports",
  "css": "additional CSS if needed (usually empty with Tailwind)",
  "explanation": "brief explanation of the component and its features",
  "componentName": "PascalCaseComponentName"
}`;

  const userPrompt = request.previousCode 
    ? `Modify this existing component:\n\n${request.previousCode}\n\nUser request: ${request.prompt}`
    : `Create a React component: ${request.prompt}`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000, // Increased for more complete components
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    // Try to parse as JSON, fallback to extracting code blocks
    try {
      return JSON.parse(response);
    } catch {
      // Extract code blocks if JSON parsing fails
      const jsxMatch = response.match(/```(?:tsx?|jsx?)\n([\s\S]*?)\n```/);
      const cssMatch = response.match(/```css\n([\s\S]*?)\n```/);
      
      return {
        jsx: jsxMatch?.[1] || response,
        css: cssMatch?.[1] || '',
        explanation: 'Component generated successfully',
        componentName: 'GeneratedComponent'
      };
    }
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate component');
  }
}
