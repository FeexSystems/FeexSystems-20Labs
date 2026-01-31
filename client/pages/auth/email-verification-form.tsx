import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, Mail, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/store/auth";

interface EmailVerificationFormProps {
  token?: string;
}

export function EmailVerificationForm({ token }: EmailVerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(!!token);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  // Auto-verify if token is provided
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  async function verifyEmail(verificationToken: string) {
    setIsVerifying(true);
    setVerificationStatus('pending');

    try {
      const response = await authService.verifyEmail({ token: verificationToken });

      if (response.success) {
        setVerificationStatus('success');
        
        // Update user's email verification status
        if (user) {
          setUser({ ...user, emailVerified: true });
        }

        toast({
          title: "Email Verified!",
          description: "Your email has been successfully verified.",
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        throw new Error(response.error?.message || "Verification failed");
      }
    } catch (error: any) {
      setVerificationStatus('error');
      setErrorMessage(error.message || "An unexpected error occurred");
      
      toast({
        title: "Verification Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  }

  async function resendVerificationEmail() {
    setIsLoading(true);

    try {
      const response = await authService.resendVerificationEmail();

      if (response.success) {
        toast({
          title: "Verification Email Sent",
          description: "A new verification email has been sent to your inbox.",
        });
      } else {
        throw new Error(response.error?.message || "Failed to send verification email");
      }
    } catch (error: any) {
      toast({
        title: "Failed to Send Email",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // If we're verifying with a token
  if (token) {
    if (isVerifying) {
      return (
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying your email address...</p>
        </div>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Email Verified!</h3>
            <p className="text-muted-foreground">
              Your email has been successfully verified. Redirecting to dashboard...
            </p>
          </div>
        </div>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <div className="space-y-4">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button
              onClick={() => resendVerificationEmail()}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Send New Verification Email
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </div>
      );
    }
  }

  // If no token provided, show resend verification form
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold">Check Your Email</h3>
        <p className="text-muted-foreground">
          We've sent a verification link to your email address. Please click the link to verify your account.
        </p>
      </div>

      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          Didn't receive the email? Check your spam folder or click below to send a new verification email.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Button
          onClick={resendVerificationEmail}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend Verification Email
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/auth")}
          className="w-full"
        >
          Back to Login
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Make sure to check your spam folder. If you continue to have issues, 
          please contact our support team.
        </p>
      </div>
    </div>
  );
}