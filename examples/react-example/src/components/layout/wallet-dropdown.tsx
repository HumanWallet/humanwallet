import { Copy, Check, ExternalLink, LogOut, User, Wallet, Zap } from "lucide-react"
import type { Connector } from "wagmi"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useTruncateAddress } from "@/hooks/use-truncate-address"
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@humanwallet/ui"

interface WalletDropdownProps {
  readonly userAddress: string
  readonly userChainName?: string
  readonly availableConnectors: readonly Connector[]
  readonly onSwitchAccount: (connector: Connector) => void
  readonly onLogout: () => void
}

export function WalletDropdown({
  userAddress,
  userChainName,
  availableConnectors,
  onSwitchAccount,
  onLogout,
}: WalletDropdownProps) {
  const truncatedAddress = useTruncateAddress(userAddress, { startLength: 6, endLength: 4 })
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    timeout: 2000,
  })

  return (
    <>
      {/* Network Badge */}
      <Badge variant="outline" className="hidden sm:inline-flex">
        {userChainName || "Unknown"}
      </Badge>

      {/* Wallet Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <div className="size-2 bg-success rounded-full" />
            <span className="hidden sm:inline">{truncatedAddress}</span>
            <span className="sm:hidden">
              <User className="size-4" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground">Network: {userChainName || "Unknown"}</p>
          </div>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => copyToClipboard(userAddress)} className="cursor-pointer">
            {isCopied ? <Check className="size-4 mr-2 text-success" /> : <Copy className="size-4 mr-2" />}
            <div className="flex-1">
              <div className="text-sm">{isCopied ? "Address copied!" : "Copy address"}</div>
              <div className="text-xs text-muted-foreground font-mono">{truncatedAddress}</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a
              href={`https://sepolia.etherscan.io/address/${userAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <ExternalLink className="size-4 mr-2" />
              View on explorer
            </a>
          </DropdownMenuItem>

          {availableConnectors.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {availableConnectors.map((connector) => (
                <DropdownMenuItem
                  key={connector.id}
                  onClick={() => onSwitchAccount(connector)}
                  className="cursor-pointer"
                >
                  <Wallet className="size-4 mr-2" />
                  Switch to {connector.name}
                </DropdownMenuItem>
              ))}
            </>
          )}

          {/* Sepolia Faucet Link */}
          {userChainName === "Sepolia" && (
            <>
              <DropdownMenuSeparator />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem asChild>
                      <a
                        href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer"
                      >
                        <Zap className="size-4 mr-2" />
                        Get Sepolia ETH
                      </a>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get free test ETH from Google Cloud&apos;s Sepolia faucet for development and testing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="size-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
