import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthFormSkeleton } from '@/components/LoadingSkeletons';
import { ButtonLoading } from '@/components/LoadingIndicators';
import { useEffect } from 'react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoading, error, clearError } = useAuth();
  const location = useLocation();
  
  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Show loading skeleton while auth is initializing
  if (isLoading && !error) {
    return <AuthFormSkeleton />;
  }

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Focus on email field when component mounts
  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, from);
    } catch (error) {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your FeexSystems account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                data-testid="email-input"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <div id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                data-testid="password-input"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <div id="password-error" className="text-sm text-destructive" role="alert">
                  {errors.password.message}
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm text-destructive" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="login-button"
            >
              <ButtonLoading 
                isLoading={isLoading} 
                loadingText="Signing in..."
              >
                Sign In
              </ButtonLoading>
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Create account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}