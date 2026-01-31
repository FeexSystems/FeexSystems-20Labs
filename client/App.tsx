import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { globalErrorHandler } from "@/lib/error-handler";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors
        if (error instanceof Error && error.message.includes('401')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      globalErrorHandler.captureException(error, {
        componentStack: errorInfo.componentStack,
        section: 'app-root',
      });
    }}
  >
    <div className="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary
              onError={(error, errorInfo) => {
                globalErrorHandler.captureException(error, {
                  componentStack: errorInfo.componentStack,
                  section: 'router',
                });
              }}
            >
              <AuthProvider>
                <Routes>
                  {/* Public routes - redirect to dashboard if authenticated */}
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <Index />
                      </PublicRoute>
                    }
                  />

                  {/* Authentication routes - will be added in next task */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicRoute>
                        <ForgotPassword />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <PublicRoute>
                        <ResetPassword />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/verify-email"
                    element={
                      <PublicRoute>
                        <EmailVerification />
                      </PublicRoute>
                    }
                  />

                  {/* Protected routes - require authentication */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscription"
                    element={
                      <ProtectedRoute>
                        <div>Subscription Page - Coming Soon</div>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ai"
                    element={
                      <ProtectedRoute>
                        <div>AI Services Page - Coming Soon</div>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/devops"
                    element={
                      <ProtectedRoute>
                        <div>DevOps Page - Coming Soon</div>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/security"
                    element={
                      <ProtectedRoute>
                        <div>Security Page - Coming Soon</div>
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  </ErrorBoundary>
);

export default App;
