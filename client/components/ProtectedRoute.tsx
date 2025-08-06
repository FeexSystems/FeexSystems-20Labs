import { useAuthStore } from "@/store/auth"
import { Navigate, Outlet } from "react-router-dom"

export function ProtectedRoute() {
  const { isLoggedIn } = useAuthStore()

  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}
