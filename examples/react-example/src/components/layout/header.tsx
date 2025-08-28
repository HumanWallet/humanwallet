import { useAccount, useDisconnect, useSwitchAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Copy, Check, ExternalLink, LogOut, User, Wallet } from "lucide-react"
import { useTruncateAddress } from "@/hooks/use-truncate-address"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Link } from "react-router"

export function Header() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { connectors, switchAccount } = useSwitchAccount()
  const truncatedAddress = useTruncateAddress(address ?? "", { startLength: 6, endLength: 4 })
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    timeout: 2000,
  })

  // Filter out current connector to show only alternative options
  const availableConnectors = connectors.filter(
    (connector) => connector.name !== "HumanWallet" || connectors.length > 1,
  )

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <img src="/HumanWallet.svg" alt="HumanWallet" className="size-6" />
          <h1 className="text-xl font-bold">HumanWallet</h1>
          <Badge variant="secondary" className="text-xs">
            Demo
          </Badge>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-4">
          {isConnected && address ? (
            <>
              {/* Network Badge */}
              <Badge variant="outline" className="hidden sm:inline-flex">
                {chain?.name || "Unknown"}
              </Badge>

              {/* Wallet Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <div className="size-2 bg-green-500 rounded-full" />
                    <span className="hidden sm:inline">{truncatedAddress}</span>
                    <span className="sm:hidden">
                      <User className="size-4" />
                    </span>
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">Connected Wallet</p>
                    <p className="text-xs text-muted-foreground">Network: {chain?.name || "Unknown"}</p>
                  </div>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => copyToClipboard(address)} className="cursor-pointer">
                    {isCopied ? <Check className="size-4 mr-2 text-green-600" /> : <Copy className="size-4 mr-2" />}
                    <div className="flex-1">
                      <div className="text-sm">{isCopied ? "Address copied!" : "Copy address"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{truncatedAddress}</div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <a
                      href={`${chain?.blockExplorers?.default?.url}/address/${address}`}
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
                          onClick={() => switchAccount({ connector })}
                          className="cursor-pointer"
                        >
                          <Wallet className="size-4 mr-2" />
                          Switch to {connector.name}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}

                  <DropdownMenuItem
                    onClick={() => disconnect()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="size-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link to="/connect">Connect Wallet</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
