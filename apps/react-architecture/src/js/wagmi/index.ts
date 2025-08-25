import { createConfig, http } from "@wagmi/core"
import { sepolia } from "viem/chains"

const RPC_HTTP = import.meta.env.VITE_RPC_HTTP

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(RPC_HTTP),
  },
})
