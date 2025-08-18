/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Domain } from "./domain"
import { type PublicClient } from "viem"
import { type Config as WagmiConfig } from "@wagmi/core"

declare global {
  interface Window {
    domain: Domain
    publicClient: PublicClient
    wagmiConfig: WagmiConfig
    blockNumber: number
    kernelClient: any // Account abstraction
    kernelAccount: any // Account abstraction
  }
}
