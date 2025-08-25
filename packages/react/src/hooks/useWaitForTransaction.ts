import { useState, useCallback } from "react"
import { waitForTransaction } from "@humanwallet/core"
import type { Hash } from "@humanwallet/types"
import { useHumanWalletContext } from "../context/HumanWalletContext"
import type { ContractState } from "../types"

/**
 * Hook return type for waiting for transaction operations
 */
export interface UseWaitForTransactionReturn {
  readonly state: ContractState<boolean>
  readonly data: boolean | undefined
  readonly error: Error | undefined
  readonly isLoading: boolean
  readonly isSuccess: boolean
  readonly isError: boolean
  readonly waitForTransaction: (hash: Hash) => Promise<void>
  readonly reset: () => void
}

/**
 * Hook for waiting for transaction confirmation
 *
 * @returns Object containing wait state and wait function
 *
 * @example
 * ```tsx
 * const { waitForTransaction, isLoading, error, data } = useWaitForTransaction()
 *
 * const handleWaitForTx = async (txHash: string) => {
 *   try {
 *     await waitForTransaction(txHash)
 *     console.log('Transaction confirmed!')
 *   } catch (error) {
 *     console.error('Transaction failed:', error)
 *   }
 * }
 * ```
 */
export const useWaitForTransaction = (): UseWaitForTransactionReturn => {
  const { config } = useHumanWalletContext()

  const [state, setState] = useState<ContractState<boolean>>({ status: "idle" })

  const handleWaitForTransaction = useCallback(
    async (hash: Hash): Promise<void> => {
      if (!hash) {
        setState({ status: "error", error: new Error("Transaction hash is required") })
        return
      }

      try {
        setState({ status: "loading" })
        await waitForTransaction(config, hash)
        setState({ status: "success", data: true })
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Transaction wait failed")
        setState({ status: "error", error })
      }
    },
    [config],
  )

  const reset = useCallback(() => {
    setState({ status: "idle" })
  }, [])

  return {
    state,
    data: state.status === "success" ? state.data : undefined,
    error: state.status === "error" ? state.error : undefined,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    waitForTransaction: handleWaitForTransaction,
    reset,
  }
}
