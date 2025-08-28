import { createConfig, http } from "wagmi"
import { sepolia } from "wagmi/chains"
import { humanWalletConnector } from "@humanwallet/connector"

// Replace with your actual ZeroDev project ID
const ZERODEV_PROJECT_ID = import.meta.env.VITE_ZERODEV_PROJECT_ID

export const config = createConfig({
  chains: [sepolia], // Sepolia as default, Polygon Amoy as alternative
  connectors: [
    humanWalletConnector({
      projectId: ZERODEV_PROJECT_ID,
      appName: "Wagmi Passkeys App",
      passkeyName: "My Wallet", // Default name (users can customize this)
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
