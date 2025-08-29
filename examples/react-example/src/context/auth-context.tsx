import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { useNavigate } from "react-router"

interface AuthContextType {
  isAuthenticated: boolean
  isConnecting: boolean
  user: {
    address: string | undefined
    chainId: number | undefined
    chainName: string | undefined
  } | null
  login: () => void
  logout: () => void
  requireAuth: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { address, isConnected, isConnecting, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Update authentication state when wallet connection changes
  useEffect(() => {
    setIsAuthenticated(isConnected && !!address)
  }, [isConnected, address])

  const login = () => {
    navigate("/connect")
  }

  const logout = () => {
    disconnect()
    navigate("/")
  }

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      navigate("/connect", { replace: true })
      return false
    }
    return true
  }

  const value: AuthContextType = {
    isAuthenticated,
    isConnecting,
    user: isAuthenticated
      ? {
          address,
          chainId: chain?.id,
          chainName: chain?.name,
        }
      : null,
    login,
    logout,
    requireAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
