import type { Connector } from "wagmi"
import { ModeToggle } from "../mode-toggle"
import { WalletDropdown } from "./wallet-dropdown"

interface ConnectionStatusProps {
  readonly isAuthenticated: boolean
  readonly userAddress?: string
  readonly userChainName?: string
  readonly availableConnectors: readonly Connector[]
  readonly onSwitchAccount: (connector: Connector) => void
  readonly onLogout: () => void
}

export function ConnectionStatus({
  isAuthenticated,
  userAddress,
  userChainName,
  availableConnectors,
  onSwitchAccount,
  onLogout,
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:block">
        <ModeToggle />
      </div>

      {isAuthenticated && userAddress && (
        <WalletDropdown
          userAddress={userAddress}
          userChainName={userChainName}
          availableConnectors={availableConnectors}
          onSwitchAccount={onSwitchAccount}
          onLogout={onLogout}
        />
      )}
    </div>
  )
}
