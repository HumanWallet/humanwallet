import type { Connector } from "wagmi"
import { useAccount, useDisconnect, useSwitchAccount } from "wagmi"
import { MobileNavigation } from "./mobile-navigation"
import { BrandLogo } from "./brand-logo"
import { MainNavigation } from "./navigation-menu"
import { ConnectionStatus } from "./connection-status"

export function Header() {
  const { address, chain, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connectors, switchAccount } = useSwitchAccount()

  // Filter out current connector to show only alternative options
  const availableConnectors = connectors.filter(
    (connector) => connector.name !== "HumanWallet" || connectors.length > 1,
  )

  const handleSwitchAccount = (connector: Connector) => {
    switchAccount({ connector })
  }

  return (
    <header className="sticky sm:top-4 z-50 sm:mx-4 sm:mt-4 max-w-5xl justify-self-center w-full ">
      <div className="sm:rounded-lg sm:border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
        <div className="container mx-auto sm:px-6 px-4 h-16 flex items-center justify-between max-w-5xl">
          {/* Mobile Navigation Menu - Top Left */}
          <MobileNavigation userChainName={chain?.name} />

          {/* Logo/Brand and Navigation Menu */}
          <div className="flex items-center gap-6">
            <BrandLogo />
            <MainNavigation />
          </div>

          {/* Connection Status */}
          <ConnectionStatus
            isAuthenticated={isConnected}
            userAddress={address}
            userChainName={chain?.name}
            availableConnectors={availableConnectors}
            onSwitchAccount={handleSwitchAccount}
            onLogout={disconnect}
          />
        </div>
      </div>
    </header>
  )
}
