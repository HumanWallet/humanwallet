import { useState, useCallback } from "react"
import { signTypedData } from "@humanwallet/core"
import type { SignTypedDataParameters, Signature } from "@humanwallet/types"
import { useHumanWalletContext } from "../context/HumanWalletContext"
import type { ContractState } from "../types"

/**
 * Hook return type for signing typed data operations
 */
export interface UseSignTypedDataReturn {
  readonly state: ContractState<Signature>
  readonly data: Signature | undefined
  readonly error: Error | undefined
  readonly isLoading: boolean
  readonly isSuccess: boolean
  readonly isError: boolean
  readonly signTypedData: () => Promise<void>
  readonly reset: () => void
}

/**
 * Hook for signing typed data (EIP-712)
 *
 * @param parameters - Typed data parameters
 * @returns Object containing sign state and sign function
 *
 * @example
 * ```tsx
 * const { signTypedData, isLoading, error, data } = useSignTypedData({
 *   domain: {
 *     name: 'MyApp',
 *     version: '1',
 *     chainId: 1,
 *     verifyingContract: '0x123...'
 *   },
 *   types: {
 *     Message: [
 *       { name: 'from', type: 'address' },
 *       { name: 'to', type: 'address' },
 *       { name: 'amount', type: 'uint256' }
 *     ]
 *   },
 *   primaryType: 'Message',
 *   message: {
 *     from: '0x123...',
 *     to: '0x456...',
 *     amount: '1000000000000000000'
 *   }
 * })
 *
 * const handleSign = async () => {
 *   try {
 *     await signTypedData()
 *   } catch (error) {
 *     console.error('Signing failed:', error)
 *   }
 * }
 * ```
 */
export const useSignTypedData = (parameters: SignTypedDataParameters | undefined): UseSignTypedDataReturn => {
  const { config } = useHumanWalletContext()

  const [state, setState] = useState<ContractState<Signature>>({ status: "idle" })

  const handleSignTypedData = useCallback(async (): Promise<void> => {
    if (!parameters) {
      setState({ status: "error", error: new Error("Typed data parameters are required") })
      return
    }

    try {
      setState({ status: "loading" })
      const result = await signTypedData(config, parameters)
      setState({ status: "success", data: result })
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Typed data signing failed")
      setState({ status: "error", error })
    }
  }, [config, parameters])

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
    signTypedData: handleSignTypedData,
    reset,
  }
}
