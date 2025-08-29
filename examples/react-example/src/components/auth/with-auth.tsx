import type { ComponentType } from "react"
import { useAuth } from "../../context/auth-context"
import { Loader2 } from "lucide-react"

interface WithAuthOptions {
  redirectTo?: string
  fallback?: React.ComponentType
}

export function withAuth<P extends object>(Component: ComponentType<P>, _options: WithAuthOptions = {}) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isConnecting, requireAuth } = useAuth()

    // Show loading state while checking connection
    if (isConnecting) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="size-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Checking wallet connection...</p>
          </div>
        </div>
      )
    }

    // Check authentication
    if (!isAuthenticated) {
      requireAuth()
      return null
    }

    // If authenticated, render the component
    return <Component {...props} />
  }
}
