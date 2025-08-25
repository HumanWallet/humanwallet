import type { Chain, Config } from "@humanwallet/types"
import { createPublicClient, http } from "viem"

type CreateConfigParams = {
  passkeyUrl: string
  bundlerRpc: string
  paymasterRpc: string
  chain: Chain
}

export const createConfig = (config: CreateConfigParams): Omit<Config, "kernelClient" | "sessionKeyAccount"> => {
  const bundlerTransport = http(config.bundlerRpc)
  const paymasterTransport = http(config.paymasterRpc)

  const publicClient = createPublicClient({
    chain: config.chain,
    transport: bundlerTransport,
    name: "HumanWallet",
  })

  return {
    bundlerTransport,
    paymasterTransport,
    publicClient,
    chain: config.chain,
    passkeyUrl: config.passkeyUrl,
  }
}
