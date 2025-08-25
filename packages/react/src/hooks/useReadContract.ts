import { useState, useCallback, useEffect } from "react"
import { readContract } from "@humanwallet/core"
import type { ReadContractParameters } from "@humanwallet/types"
import { useHumanWalletContext } from "../context/HumanWalletContext"
import type { UseReadContractReturn, ContractState } from "../types"

/**
 * Hook for reading from smart contracts
 *
 * @param parameters - Contract read parameters
 * @param options - Hook options including auto-fetch behavior
 * @returns Object containing read state and refetch function
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useReadContract({
 *   address: '0x123...',
 *   abi: contractAbi,
 *   functionName: 'balanceOf',
 *   args: [userAddress]
 * })
 *
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error: {error.message}</div>
 * return <div>Balance: {data}</div>
 * ```
 */
export const useReadContract = <TData = unknown>(
  parameters: ReadContractParameters | undefined,
  options: { enabled?: boolean } = {},
): UseReadContractReturn<TData> => {
  const { config } = useHumanWalletContext()
  const { enabled = true } = options

  const [state, setState] = useState<ContractState<TData>>({ status: "idle" })

  const refetch = useCallback(async (): Promise<void> => {
    if (!parameters) {
      setState({ status: "error", error: new Error("Contract parameters are required") })
      return
    }

    try {
      setState({ status: "loading" })
      const result = (await readContract(config, parameters)) as TData
      setState({ status: "success", data: result })
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Contract read failed")
      setState({ status: "error", error })
    }
  }, [config, parameters])

  // Auto-fetch on mount and when parameters change if enabled
  useEffect(() => {
    if (enabled && parameters) {
      refetch()
    }
  }, [enabled, parameters, refetch])

  return {
    state,
    data: state.status === "success" ? state.data : undefined,
    error: state.status === "error" ? state.error : undefined,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    refetch,
  }
}
