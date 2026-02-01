import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { globalErrorHandler } from "@/lib/error-handler";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import NotFound from "./pages/NotFound";

// Protected pages
import UserProfile from "./pages/UserProfile";

// Dashboard pages
import DashboardIndex from "./pages/dashboard/index";
import AIServicesPage from "./pages/dashboard/ai-services";
import AnalyticsPage from "./pages/dashboard/analytics";
import BillingPage from "./pages/dashboard/billing";
import DevOpsPage from "./pages/dashboard/devops";
import SecurityPage from "./pages/dashboard/security";
import SettingsPage from "./pages/dashboard/settings";
import TeamsPage from "./pages/dashboard/teams";
import DashboardProfilePage from "./pages/dashboard/profile";

// Admin pages
import AdminIndex from "./pages/admin/index";
import AdminUsers from "./pages/admin/users";
import AdminHealth from "./pages/admin/health";
import AdminSecurity from "./pages/admin/security";
import AdminAuditLogs from "./pages/admin/audit-logs";
import AdminSubscriptions from "./pages/admin/subscriptions";

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

                  {/* Authentication routes */}
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

                  {/* Dashboard routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardIndex />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/ai"
                    element={
                      <ProtectedRoute>
                        <AIServicesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/ai-services"
                    element={
                      <ProtectedRoute>
                        <AIServicesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/analytics"
                    element={
                      <ProtectedRoute>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/billing"
                    element={
                      <ProtectedRoute>
                        <BillingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/devops"
                    element={
                      <ProtectedRoute>
                        <DevOpsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/security"
                    element={
                      <ProtectedRoute>
                        <SecurityPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/teams"
                    element={
                      <ProtectedRoute>
                        <TeamsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/profile"
                    element={
                      <ProtectedRoute>
                        <DashboardProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Legacy route redirects */}
                  <Route path="/ai" element={<Navigate to="/dashboard/ai" replace />} />
                  <Route path="/ai-services" element={<Navigate to="/dashboard/ai-services" replace />} />
                  <Route path="/devops" element={<Navigate to="/dashboard/devops" replace />} />
                  <Route path="/security" element={<Navigate to="/dashboard/security" replace />} />
                  <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
                  <Route path="/billing" element={<Navigate to="/dashboard/billing" replace />} />
                  <Route path="/teams" element={<Navigate to="/dashboard/teams" replace />} />
                  <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
                  <Route path="/subscription" element={<Navigate to="/dashboard/billing" replace />} />

                  {/* User profile route */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminIndex />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/health"
                    element={
                      <ProtectedRoute>
                        <AdminHealth />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/security"
                    element={
                      <ProtectedRoute>
                        <AdminSecurity />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/audit-logs"
                    element={
                      <ProtectedRoute>
                        <AdminAuditLogs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/subscriptions"
                    element={
                      <ProtectedRoute>
                        <AdminSubscriptions />
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
