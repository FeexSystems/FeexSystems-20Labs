import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { RouteErrorBoundary } from "@/components/ErrorBoundaries/RouteErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Simple test component
const Index = lazy(() => import("./pages/IndexTest"));

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
