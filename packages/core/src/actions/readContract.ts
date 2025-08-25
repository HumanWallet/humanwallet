import type { Config, ReadContractParameters } from "@humanwallet/types"

export const readContract = async (config: Config, args: ReadContractParameters) => {
  return await config.publicClient.readContract(args)
}
