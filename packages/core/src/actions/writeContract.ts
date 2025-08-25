import type { Config, WriteContractParameters } from "@humanwallet/types"
import { encodeFunctionData } from "viem"

export const writeContract = async (config: Config, args: WriteContractParameters) => {
  if (!config.kernelClient || !config.kernelClient.account) {
    throw new Error("Kernel client not initialized")
  }

  return await config.kernelClient.sendUserOperation({
    callData: await config.kernelClient.account.encodeCalls([
      {
        to: args.address,
        value: args.value,
        data: encodeFunctionData({
          abi: args.abi,
          functionName: args.functionName,
          args: args.args,
        }),
      },
    ]),
  })
}
