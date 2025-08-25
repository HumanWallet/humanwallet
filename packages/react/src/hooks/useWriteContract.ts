import { useState, useCallback } from "react"
import { writeContract } from "@humanwallet/core"
import type { WriteContractParameters } from "@humanwallet/types"
import { useHumanWalletContext } from "../context/HumanWalletContext"
import type { UseWriteContractReturn, ContractState } from "../types"

/**
 * Hook for writing to smart contracts
 *
 * @param parameters - Contract write parameters
 * @returns Object containing write state and write function
 *
 * @example
 * ```tsx
 * const { write, isLoading, error, data } = useWriteContract({
 *   address: '0x123...',
 *   abi: contractAbi,
 *   functionName: 'transfer',
 *   args: [recipient, amount]
 * })
 *
 * const handleTransfer = async () => {
 *   try {
 *     await write()
 *   } catch (error) {
 *     console.error('Transaction failed:', error)
 *   }
 * }
 * ```
 */
export const useWriteContract = (parameters: WriteContractParameters | undefined): UseWriteContractReturn => {
  const { config } = useHumanWalletContext()

  const [state, setState] = useState<ContractState<string>>({ status: "idle" })

  const write = useCallback(async (): Promise<void> => {
    if (!parameters) {
      setState({ status: "error", error: new Error("Contract parameters are required") })
      return
    }

    try {
      setState({ status: "loading" })
      const result = await writeContract(config, parameters)
      setState({ status: "success", data: result })
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Contract write failed")
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
