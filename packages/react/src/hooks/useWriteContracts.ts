import { useState, useCallback } from "react"
import { writeContracts } from "@humanwallet/core"
import type { WriteContractParameters } from "@humanwallet/types"
import { useHumanWalletContext } from "../context/HumanWalletContext"
import type { UseWriteContractReturn, ContractState } from "../types"

/**
 * Hook for writing to multiple smart contracts in a single transaction
 *
 * @param parameters - Array of contract write parameters
 * @returns Object containing write state and write function
 *
 * @example
 * ```tsx
 * const { write, isLoading, error, data } = useWriteContracts([
 *   {
 *     address: '0x123...',
 *     abi: contractAbi,
 *     functionName: 'approve',
 *     args: [spender, amount]
 *   },
 *   {
 *     address: '0x456...',
 *     abi: routerAbi,
 *     functionName: 'swap',
 *     args: [tokenIn, tokenOut, amount]
 *   }
 * ])
 *
 * const handleBatchTransaction = async () => {
 *   try {
 *     await write()
 *   } catch (error) {
 *     console.error('Batch transaction failed:', error)
 *   }
 * }
 * ```
 */
export const useWriteContracts = (parameters: WriteContractParameters[] | undefined): UseWriteContractReturn => {
  const { config } = useHumanWalletContext()

  const [state, setState] = useState<ContractState<string>>({ status: "idle" })

  const write = useCallback(async (): Promise<void> => {
    if (!parameters || parameters.length === 0) {
      setState({ status: "error", error: new Error("Contract parameters are required") })
      return
    }

    try {
      setState({ status: "loading" })
      const result = await writeContracts(config, parameters)
      setState({ status: "success", data: result })
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Batch contract write failed")
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
    write,
    reset,
  }
}
