import { createConfig } from "@humanwallet/core"
import type { Config } from "@humanwallet/types"
import { sepolia } from "viem/chains"

/**
 * Create HumanWallet configuration from environment variables
 */
export const createHumanWalletConfig = (): Omit<Config, "kernelClient" | "sessionKeyAccount"> => {
  const bundlerRpc = import.meta.env.VITE_ZERODEV_BUNDLER_RPC
  const paymasterRpc = import.meta.env.VITE_ZERODEV_PAYMASTER_RPC
  const passkeyUrl = import.meta.env.VITE_ZERODEV_PASSKEY_URL

  if (!bundlerRpc || !paymasterRpc || !passkeyUrl) {
    throw new Error(
      "Missing required environment variables: VITE_ZERODEV_BUNDLER_RPC, VITE_ZERODEV_PAYMASTER_RPC, VITE_ZERODEV_PASSKEY_URL",
    )
  }

  return createConfig({
    passkeyUrl,
    bundlerRpc,
    paymasterRpc,
    chain: sepolia,
  })
}
