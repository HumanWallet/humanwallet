import { createConfig, http } from "wagmi"
import { metaMask } from "wagmi/connectors"
import { sepolia } from "wagmi/chains"
import { passkeysWalletConnector } from "./connector"
import { createStorage } from "wagmi"

// Replace with your actual ZeroDev project ID
const ZERODEV_PROJECT_ID = import.meta.env.VITE_ZERODEV_PROJECT_ID

export const config = createConfig({
  chains: [sepolia], // Sepolia as default, Polygon Amoy as alternative
  connectors: [
    passkeysWalletConnector({
      projectId: ZERODEV_PROJECT_ID,
      appName: "Wagmi Passkeys App",
      passkeyName: "My Wallet", // Default name (users can customize this)
    }),
    metaMask(),
  ],
  transports: {
    [sepolia.id]: http(),
  },
  // Enable session persistence with localStorage
  storage: createStorage({
    storage: localStorage,
    key: "zerodev-wagmi",
  }),
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
