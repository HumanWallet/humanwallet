import { createPublicClient, http } from "viem"
import { sepolia } from "viem/chains"

const RPC_HTTP = import.meta.env.VITE_RPC_HTTP

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_HTTP),
})
