import { useEffect, ReactNode } from 'react';
import { AuthContext, createAuthProvider } from '@/lib/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const authData = createAuthProvider();

  useEffect(() => {
    console.log('AuthProvider: Checking authentication...');
    authData.checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
}
