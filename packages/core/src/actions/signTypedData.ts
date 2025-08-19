import type { Config, Signature, SignTypedDataParameters } from "types"
import { parseSignature } from "viem"

export const signTypedData = async (config: Config, args: SignTypedDataParameters): Promise<Signature> => {
  if (!config.kernelClient || !config.kernelClient.account) {
    throw new Error("Kernel client not initialized")
  }

  const signature = await config.kernelClient.account.signTypedData(args)
  return parseSignature(signature)
}
