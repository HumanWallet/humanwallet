import type { Config, Hash } from "types"

export const waitForTransaction = async (config: Config, transactionHash: Hash) => {
  return await config.publicClient.waitForTransactionReceipt({ hash: transactionHash })
}
