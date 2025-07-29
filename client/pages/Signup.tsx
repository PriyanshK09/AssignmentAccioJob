import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(formData.email, formData.password, formData.name);
      toast.success('Account created successfully!');
      navigate('/workspace');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.info('Google signup not implemented yet');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-400/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in-scale">
            <Link to="/" className="inline-block group">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center mb-6 shadow-xl transition-transform group-hover:scale-105">
                <Icons.code className="w-10 h-10" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="text-muted-foreground">
              Join the AI Frontend Playground today
            </p>
          </div>

          {/* Signup Card */}
          <Card className="card-enhanced glass-subtle border-0 shadow-2xl animate-slide-up" style={{animationDelay: '200ms'}}>
            <CardHeader className="space-y-2 pb-6 text-center">
              <CardTitle className="text-xl font-semibold">Sign up</CardTitle>
              <CardDescription>
                Create your account to start building
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Signup */}
              <Button 
                variant="outline" 
                className="w-full h-12 text-base interactive glass border-border/50 hover:border-primary/50"
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
                <Icons.google className="mr-3 h-5 w-5" />
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-card px-4 text-muted-foreground font-medium">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 text-base border-border/50 focus:border-primary/50 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 text-base border-border/50 focus:border-primary/50 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password (min. 6 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-12 text-base border-border/50 focus:border-primary/50 transition-colors"
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base btn-primary shadow-lg"
                  disabled={isLoading || !formData.name || !formData.email || !formData.password}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create your account'
                  )}
                </Button>
              </form>

              {/* Sign in link */}
              <div className="text-center pt-2">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{animationDelay: '400ms'}}>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                <Icons.code className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">AI-Powered</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                <Icons.eye className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Live Preview</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                <Icons.download className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Export Code</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center animate-fade-in" style={{animationDelay: '600ms'}}>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}