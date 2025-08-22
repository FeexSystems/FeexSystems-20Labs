import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { RouteErrorBoundary } from "@/components/ErrorBoundaries/RouteErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { useAuthStore } from "@/store/auth";
import { initializeSentry } from "@/lib/logging/sentry";
import { configurePerformanceMonitoring } from "@/lib/monitoring/featureMonitoring";
import { AppInitializer } from "@/components/AppInitializer";
import { RealtimeNotificationToast } from "@/components/realtime/RealtimeNotificationToast";
import { NotificationToastContainer } from "@/components/notifications/NotificationToast";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/IndexTest"));
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
const AdminSecurityPage = lazy(() => import("./pages/admin/security"));
const AdminSubscriptionsPage = lazy(() => import("./pages/admin/subscriptions"));
const AdminAuditLogsPage = lazy(() => import("./pages/admin/audit-logs"));

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

// Simplified router for testing
const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="*" element={<Index />} />
  </Routes>
);

const App = () => (
  <div className="dark">
    <RouteErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <NotificationToastContainer />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <AppRouter />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </RouteErrorBoundary>
  </div>
);

export default App;
