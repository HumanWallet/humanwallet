import type { Config, WriteContractParameters } from "@humanwallet/types"
import { encodeFunctionData } from "viem"

export const writeContracts = async (config: Config, args: WriteContractParameters[]) => {
  if (!config.kernelClient || !config.kernelClient.account) {
    throw new Error("Kernel client not initialized")
  }

  const encodedCalls = args.map(({ abi, address, value, functionName, args }) => ({
    to: address,
    value: value,
    data: encodeFunctionData({ abi, functionName, args }),
  }))

  return await config.kernelClient.sendUserOperation({
    callData: await config.kernelClient.account.encodeCalls(encodedCalls),
  })
}
