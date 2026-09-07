import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth-store';
import { AlertCircle, Shield } from 'lucide-react';

// BETA MODE: Set to true to allow free access without login
const BETA_MODE = true;

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // BETA MODE: Skip authentication check entirely
  if (BETA_MODE) {
    return <>{children}</>;
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but shouldn't be (e.g., login page)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role-based access
  if (requiredRole && user) {
    const roleHierarchy = {
      USER: 0,
      ADMIN: 1,
      SUPER_ADMIN: 2,
    };

    const userRoleLevel = roleHierarchy[user.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-4">
              <Shield className="h-16 w-16 text-destructive mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-destructive mb-2">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page. This area requires {requiredRole.toLowerCase()} privileges.
            </p>
            <p className="text-sm text-muted-foreground">
              Your current role: {user.role.toLowerCase()}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Convenience wrapper for admin-only routes
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      {children}
    </ProtectedRoute>
  );
}

// Convenience wrapper for super admin-only routes
export function SuperAdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      {children}
    </ProtectedRoute>
  );
}

// Convenience wrapper for public routes (accessible to everyone: guests and authenticated users)
export function PublicRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Convenience wrapper for guest-only routes (e.g., login, register) - redirects to dashboard if authenticated
export function GuestOnlyRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAuth={false}>
      {children}
    </ProtectedRoute>
  );
}

