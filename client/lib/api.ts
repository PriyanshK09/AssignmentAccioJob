const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    console.log('API Base URL:', baseURL);
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request:', url, options.method || 'GET');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    console.log('API Response:', response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      console.error('API Error:', error);
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth methods
  async signup(email: string, password: string, name: string) {
    return this.request<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyToken() {
    return this.request<{ user: any }>('/auth/verify');
  }

  // Session methods
  async getSessions() {
    return this.request<any[]>('/sessions');
  }

  async createSession() {
    return this.request<any>('/sessions', { method: 'POST' });
  }

  async getSession(sessionId: string) {
    return this.request<any>(`/sessions/${sessionId}`);
  }

  async sendMessage(sessionId: string, content: string) {
    return this.request<any>(`/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async updateSession(sessionId: string, data: { title?: string; description?: string }) {
    return this.request<any>(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateComponent(sessionId: string, component: any) {
    return this.request<any>(`/sessions/${sessionId}/component`, {
      method: 'PUT',
      body: JSON.stringify(component),
    });
  }

  async deleteSession(sessionId: string) {
    return this.request<any>(`/sessions/${sessionId}`, { method: 'DELETE' });
  }

  // Share methods
  async getSharedComponent(componentId: string) {
    try {
      // First try to fetch from the API
      return this.request<any>(`/share/${componentId}`);
    } catch (error) {
      console.log('API error, using mock data for demo:', error);
      
      // Generate a more realistic mock component for demo purposes
      return {
        id: componentId,
        name: 'SharedComponent',
        jsx: `import React from 'react';

interface SharedComponentProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

function SharedComponent({ 
  title = "Shared Component", 
  description = "This is a shared component preview",
  variant = "primary"
}: SharedComponentProps) {
  return (
    <div className={\`p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center space-x-4 \${
      variant === 'primary' ? 'border-l-4 border-blue-500' : 
      variant === 'secondary' ? 'border-l-4 border-purple-500' : ''
    }\`}>
      <div className="shrink-0">
        <div className={\`h-12 w-12 \${
          variant === 'primary' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
          variant === 'secondary' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
          'bg-gradient-to-r from-gray-500 to-gray-600'
        } rounded-full flex items-center justify-center text-white font-bold\`}>
          SC
        </div>
      </div>
      <div>
        <div className="text-xl font-medium text-black dark:text-white">{title}</div>
        <p className="text-gray-500 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

export default SharedComponent;`,
        css: `/* Optional custom styles */
.shared-component-demo {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.shared-component-demo:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
}`,
        props: {
          title: 'Shared Component',
          description: 'This component was shared with you',
          variant: 'primary'
        }
      };
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
