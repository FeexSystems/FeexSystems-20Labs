import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { useAuthStore } from "@/store/auth";
import { AppInitializer } from "@/components/AppInitializer";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthenticationPage = lazy(() => import("./pages/auth"));
const DashboardPage = lazy(() => import("./pages/dashboard"));
const AIServicesPage = lazy(() => import("./pages/dashboard/ai"));
const DevOpsPage = lazy(() => import("./pages/dashboard/devops"));
const SecurityPage = lazy(() => import("./pages/dashboard/security"));
const TeamsPage = lazy(() => import("./pages/dashboard/teams"));
const BillingPage = lazy(() => import("./pages/dashboard/billing"));
const AnalyticsPage = lazy(() => import("./pages/dashboard/analytics"));
const SettingsPage = lazy(() => import("./pages/dashboard/settings"));
const ProfilePage = lazy(() => import("./pages/dashboard/profile"));
const AdminDashboardPage = lazy(() => import("./pages/admin"));
const AdminUsersPage = lazy(() => import("./pages/admin/users"));
const AdminHealthPage = lazy(() => import("./pages/admin/health"));

// Configure React Query client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

// Root component that handles authentication state
const AppRouter = () => {
  const { isLoggedIn, isInitialized } = useAuthStore();

  // Show loading spinner while initializing
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Index />} 
      />
      <Route 
        path="/auth" 
        element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <AuthenticationPage />} 
      />
      <Route 
        path="/auth/verify-email" 
        element={<AuthenticationPage />} 
      />
      <Route 
        path="/teams/accept-invitation" 
        element={<AuthenticationPage />} 
      />

      {/* Protected user routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/ai" element={<AIServicesPage />} />
        <Route path="/dashboard/devops" element={<DevOpsPage />} />
        <Route path="/dashboard/security" element={<SecurityPage />} />
        <Route path="/dashboard/teams" element={<TeamsPage />} />
        <Route path="/dashboard/billing" element={<BillingPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/health" element={<AdminHealthPage />} />
        <Route path="/admin/security" element={<AdminHealthPage />} />
        <Route path="/admin/subscriptions" element={<AdminHealthPage />} />
        <Route path="/admin/audit-logs" element={<AdminHealthPage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <div className="dark">
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppInitializer>
              <Suspense fallback={<LoadingSpinner />}>
                <AppRouter />
              </Suspense>
            </AppInitializer>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </div>
);

createRoot(document.getElementById("root")!).render(<App />);
