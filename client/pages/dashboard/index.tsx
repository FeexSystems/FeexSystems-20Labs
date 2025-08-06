import { useAuthStore } from "@/store/auth"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/auth")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="p-8 bg-card rounded-lg shadow-md text-card-foreground">
        <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
        {user ? (
          <div className="space-y-2">
            <p>
              Hello,{" "}
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              !
            </p>
            <p>
              Your email is: <strong>{user.email}</strong>
            </p>
            <p>
              Your role is: <strong>{user.role}</strong>
            </p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
        <Button onClick={handleLogout} className="w-full mt-6">
          Log Out
        </Button>
      </div>
    </div>
  )
}
