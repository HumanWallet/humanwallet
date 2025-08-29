import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAccount } from "wagmi"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isConnected, isConnecting } = useAccount()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isConnecting && !isConnected) {
      navigate("/connect", { replace: true })
    }
  }, [isConnected, isConnecting, navigate])

  // Show loading state while checking connection
  if (isConnecting) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="size-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Checking wallet connection...</p>
          </div>
        </div>
      )
    )
  }

  // If not connected, don't render children (will redirect)
  if (!isConnected) {
    return null
  }

  // If connected, render the protected content
  return <>{children}</>
}

