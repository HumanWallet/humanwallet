import { useCallback, useMemo } from "react"
import { login, register, disconnect, reconnect } from "@humanwallet/core"
import { useHumanWalletContext } from "../context/HumanWalletContext"
import type { UseAuthReturn } from "../types"

/**
 * Hook for authentication operations (login, register, disconnect, reconnect)
 *
 * @returns Object containing auth state and authentication functions
 *
 * @example
 * ```tsx
 * const { isConnected, login, register, disconnect, account } = useAuth()
 *
 * const handleLogin = async () => {
 *   try {
 *     await login('username')
 *   } catch (error) {
 *     console.error('Login failed:', error)
 *   }
 * }
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  const { config, authState, setAuthState } = useHumanWalletContext()

  const isIdle = useMemo(() => authState.status === "idle", [authState.status])
  const isConnecting = useMemo(() => authState.status === "connecting", [authState.status])
  const isConnected = useMemo(() => authState.status === "connected", [authState.status])
  const isError = useMemo(() => authState.status === "error", [authState.status])

  const account = useMemo(() => (authState.status === "connected" ? authState.account : undefined), [authState])

  const client = useMemo(() => (authState.status === "connected" ? authState.client : undefined), [authState])

  const error = useMemo(() => (authState.status === "error" ? authState.error : undefined), [authState])

  const handleLogin = useCallback(
    async (username: string): Promise<void> => {
      try {
        setAuthState({ status: "connecting" })
        const result = await login(username, config)

        setAuthState({
          status: "connected",
          account: result.sessionKeyAccount,
          client: result.kernelClient,
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Login failed")
        setAuthState({ status: "error", error })
        throw error
      }
    },
    [config, setAuthState],
  )

  const handleRegister = useCallback(
    async (username: string): Promise<void> => {
      try {
        setAuthState({ status: "connecting" })
        const result = await register(username, config)

        setAuthState({
          status: "connected",
          account: result.sessionKeyAccount,
          client: result.kernelClient,
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Registration failed")
        setAuthState({ status: "error", error })
        throw error
      }
    },
    [config, setAuthState],
  )

  const handleDisconnect = useCallback(async (): Promise<void> => {
    try {
      await disconnect()
      setAuthState({ status: "idle" })
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Disconnect failed")
      setAuthState({ status: "error", error })
      throw error
    }
  }, [setAuthState])

  const handleReconnect = useCallback(async (): Promise<void> => {
    try {
      setAuthState({ status: "connecting" })
      const result = await reconnect(config)

      if (result.sessionKeyAccount && result.kernelClient) {
        setAuthState({
          status: "connected",
          account: result.sessionKeyAccount,
          client: result.kernelClient,
        })
      } else {
        setAuthState({ status: "idle" })
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Reconnect failed")
      setAuthState({ status: "error", error })
      throw error
    }
  }, [config, setAuthState])

  return {
    state: authState,
    isIdle,
    isConnecting,
    isConnected,
    isError,
    account,
    client,
    error,
    login: handleLogin,
    register: handleRegister,
    disconnect: handleDisconnect,
    reconnect: handleReconnect,
  }
}
