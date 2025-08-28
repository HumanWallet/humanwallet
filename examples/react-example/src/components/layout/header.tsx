import { useAccount, useDisconnect, useSwitchAccount } from "wagmi"
import {
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  User,
  Wallet,
  Home,
  TrendingUp,
  Zap,
  Menu,
  Network,
} from "lucide-react"
import { useTruncateAddress } from "@/hooks/use-truncate-address"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Link } from "react-router"
import { ModeToggle } from "../mode-toggle"
import {
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  Button,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@humanwallet/ui"

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
        {/* Mobile Navigation Menu - Top Left */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="size-4" />
                Home
              </Link>

              <div className="space-y-2">
                <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Demo</div>
                <Link
                  to="/staking-demo"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <TrendingUp className="size-4" />
                  <div>
                    <div className="font-medium">Staking Demo</div>
                    <div className="text-xs text-muted-foreground">
                      Experience both bundle and step-by-step staking workflows
                    </div>
                  </div>
                </Link>
                <Link
                  to="/connect"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Wallet className="size-4" />
                  <div>
                    <div className="font-medium">Connect Wallet</div>
                    <div className="text-xs text-muted-foreground">Try passwordless authentication with passkeys</div>
                  </div>
                </Link>
                <Link
                  to="/multi-chain"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Network className="size-4" />
                  <div>
                    <div className="font-medium">Multi-Chain</div>
                    <div className="text-xs text-muted-foreground">
                      Switch between networks and manage cross-chain assets
                    </div>
                  </div>
                </Link>

                {/* Sepolia Faucet Link - Mobile */}
                {chain?.name === "Sepolia" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <Zap className="size-4" />
                          <div>
                            <div className="font-medium">Get Sepolia ETH</div>
                            <div className="text-xs text-muted-foreground">Get test ETH from Google Cloud faucet</div>
                          </div>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get free test ETH from Google Cloud&apos;s Sepolia faucet for development and testing</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {/* Theme Toggle - Mobile */}
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Theme</div>
                  <div className="px-3 py-2">
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo/Brand */}
        <div className="flex items-center gap-6">
          <Link to="" className="flex items-center gap-2">
            <img src="/HumanWallet.svg" alt="HumanWallet" className="size-6" />
            <h1 className="text-xl font-bold">HumanWallet</h1>
          </Link>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                  <Home className="size-4 mr-2" />
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  <Zap className="size-4 mr-2" />
                  Demo
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/staking-demo"
                        className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="size-4" />
                          <div className="text-sm font-medium leading-none">Staking Demo</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Experience both bundle and step-by-step staking workflows
                        </p>
                      </Link>
                    </NavigationMenuLink>

                    <NavigationMenuLink asChild>
                      <Link
                        to="/connect"
                        className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Wallet className="size-4" />
                          <div className="text-sm font-medium leading-none">Connect Wallet</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Try passwordless authentication with passkeys
                        </p>
                      </Link>
                    </NavigationMenuLink>

                    <NavigationMenuLink asChild>
                      <Link
                        to="/multi-chain"
                        className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Network className="size-4" />
                          <div className="text-sm font-medium leading-none">Multi-Chain</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Switch between networks and manage cross-chain assets
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ModeToggle />

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
                    <div className="size-2 bg-success rounded-full" />
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
                    {isCopied ? <Check className="size-4 mr-2 text-success" /> : <Copy className="size-4 mr-2" />}
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

                  {/* Sepolia Faucet Link */}
                  {chain?.name === "Sepolia" && (
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
