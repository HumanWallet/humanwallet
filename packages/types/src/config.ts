import type { Chain, PublicClient, Transport } from "./ethereum"
import type { KernelClient, SessionKeyAccount } from "./humanWallet"

export type Config = {
  passkeyUrl: string
  bundlerTransport: Transport
  paymasterTransport: Transport
  chain: Chain
  publicClient: PublicClient
  kernelClient?: KernelClient
  sessionKeyAccount?: SessionKeyAccount
}
