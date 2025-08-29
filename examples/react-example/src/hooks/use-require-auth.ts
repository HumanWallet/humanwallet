import { useEffect } from "react"
import { useAuth } from "../context/auth-context"

/**
 * Hook that requires authentication and redirects to connect page if not authenticated
 * @param _redirectTo - Optional custom redirect path (defaults to /connect)
 */
export const useRequireAuth = (_redirectTo?: string) => {
  const { requireAuth } = useAuth()

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  return { requireAuth }
}
