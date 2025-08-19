import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type ImportFunc = () => Promise<{ default: React.ComponentType<any> }>;

/**
 * Creates a dynamically imported component with loading state
 */
export function lazyLoad(importFunc: ImportFunc, fallback: React.ReactNode = <LoadingSpinner />) {
  const LazyComponent = lazy(importFunc);

  return (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Pre-loads a component for faster initial render
 */
export function preloadComponent(importFunc: ImportFunc) {
  const component = importFunc();
  return () => component;
}

/**
 * Lazy loaded routes configuration
 */
export const routes = {
  // Auth routes
  Login: lazyLoad(() => import('@/pages/auth/Login')),
  Register: lazyLoad(() => import('@/pages/auth/Register')),
  ForgotPassword: lazyLoad(() => import('@/pages/auth/ForgotPassword')),
  
  // Dashboard routes
  Dashboard: lazyLoad(() => import('@/pages/dashboard/Dashboard')),
  Profile: lazyLoad(() => import('@/pages/dashboard/Profile')),
  
  // AI routes
  AIServices: lazyLoad(() => import('@/pages/ai/Services')),
  AIRequests: lazyLoad(() => import('@/pages/ai/Requests')),
  
  // Security routes
  SecurityScans: lazyLoad(() => import('@/pages/security/Scans')),
  Vulnerabilities: lazyLoad(() => import('@/pages/security/Vulnerabilities')),
  
  // Team routes
  Teams: lazyLoad(() => import('@/pages/teams/Teams')),
  TeamSettings: lazyLoad(() => import('@/pages/teams/Settings')),
  
  // Admin routes
  AdminDashboard: lazyLoad(() => import('@/pages/admin/Dashboard')),
  AdminUsers: lazyLoad(() => import('@/pages/admin/Users')),
  AdminSettings: lazyLoad(() => import('@/pages/admin/Settings')),
};

// Preload critical routes
export function preloadCriticalRoutes() {
  preloadComponent(() => import('@/pages/dashboard/Dashboard'));
  preloadComponent(() => import('@/pages/auth/Login'));
}
