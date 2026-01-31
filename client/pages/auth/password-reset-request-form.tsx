import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { passwordResetRequestSchema, PasswordResetRequestData } from "@/lib/validations/auth";
import { authService } from "@/lib/services/auth.service";

export function PasswordResetRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PasswordResetRequestData>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: PasswordResetRequestData) {
    setIsLoading(true);

    try {
      const response = await authService.requestPasswordReset(values);

      if (response.success) {
        setIsSuccess(true);
        toast({
          title: "Reset Link Sent",
          description: "Check your email for password reset instructions.",
        });
      } else {
        throw new Error(response.error?.message || "Failed to send reset email");
      }
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
          
          <Button
            onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}
            variant="ghost"
            className="w-full"
          >
            Send Another Reset Link
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Didn't receive the email? Check your spam folder or try again.</p>
        </div>
      </div>
    );
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
                    placeholder="Enter your email address"
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

        <div className="text-sm text-muted-foreground">
          <p>
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Reset Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate("/auth")}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </form>
    </Form>
  );
}