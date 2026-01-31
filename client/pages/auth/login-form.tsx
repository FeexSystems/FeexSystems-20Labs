import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/store/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setError } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(values);

      if (response.success && response.user && response.token) {
        login(
          response.user,
          response.token,
          response.refreshToken,
          response.expiresIn
        );

        toast({
          title: "Welcome back!",
          description: `Good to see you again, ${response.user.firstName}!`,
        });

        // Redirect to intended page or dashboard
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        throw new Error(response.error?.message || "Login failed");
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      
      setError({
        type: 'LOGIN_ERROR',
        message: errorMessage,
        code: 'LOGIN_FAILED',
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Remember me
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="link"
            size="sm"
            className="px-0 font-normal"
            onClick={() => navigate("/auth?mode=reset-password")}
            disabled={isLoading}
          >
            Forgot password?
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            type="button"
            variant="link"
            size="sm"
            className="px-0 font-normal"
            onClick={() => navigate("/auth?mode=register")}
            disabled={isLoading}
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
}
