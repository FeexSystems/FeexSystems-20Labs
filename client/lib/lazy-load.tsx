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
  // Public & Showcase routes
  Index: lazyLoad(() => import('@/pages/Index')),
  Projects: lazyLoad(() => import('@/pages/Projects')),
  Navigator: lazyLoad(() => import('@/pages/Navigator')),
  SpatialWorld: lazyLoad(() => import('@/pages/SpatialWorld')),
  OmniCommand: lazyLoad(() => import('@/pages/OmniCommand')),

  // Auth routes
  Login: lazyLoad(() => import('@/pages/Login')),
  Register: lazyLoad(() => import('@/pages/Register')),
  ForgotPassword: lazyLoad(() => import('@/pages/ForgotPassword')),
  
  // Dashboard routes
  Dashboard: lazyLoad(() => import('@/pages/dashboard/index')),
  Profile: lazyLoad(() => import('@/pages/dashboard/profile')),
  AIServices: lazyLoad(() => import('@/pages/dashboard/ai-services')),
  DevOps: lazyLoad(() => import('@/pages/dashboard/devops')),
  Security: lazyLoad(() => import('@/pages/dashboard/security')),
  Teams: lazyLoad(() => import('@/pages/dashboard/teams')),
  
  // Admin routes
  AdminDashboard: lazyLoad(() => import('@/pages/admin/index')),
  AdminUsers: lazyLoad(() => import('@/pages/admin/users')),
};

// Preload critical routes
export function preloadCriticalRoutes() {
  preloadComponent(() => import('@/pages/Index'));
  preloadComponent(() => import('@/pages/Login'));
}
