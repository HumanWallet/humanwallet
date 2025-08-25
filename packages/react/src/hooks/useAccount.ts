import { useMemo } from "react"
import { useHumanWalletContext } from "../context/HumanWalletContext"
import type { UseAccountReturn } from "../types"

/**
 * Hook to access current account information
 *
 * @returns Object containing account data and connection status
 *
 * @example
 * ```tsx
 * const { account, address, isConnected } = useAccount()
 *
 * if (isConnected && account) {
 *   console.log('Connected with address:', address)
 * }
 * ```
 */
export const useAccount = (): UseAccountReturn => {
  const { authState } = useHumanWalletContext()

  const account = useMemo(() => (authState.status === "connected" ? authState.account : undefined), [authState])

  const address = useMemo(() => account?.address, [account])

  const isConnected = useMemo(() => authState.status === "connected", [authState.status])

  return {
    account,
    address,
    isConnected,
  }
}
