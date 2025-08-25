import type { Config, UserOperationHash } from "@humanwallet/types"

export const waitForUserOperation = async (config: Config, userOperationHash: UserOperationHash) => {
  if (!config.kernelClient) {
    throw new Error("Kernel client not initialized")
  }

  return await config.kernelClient.waitForUserOperationReceipt({ hash: userOperationHash })
}
