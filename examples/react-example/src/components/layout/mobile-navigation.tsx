import { Home, TrendingUp, Wallet, Network, Zap, Menu } from "lucide-react"
import { Link } from "react-router"
import {
  Button,
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
import { ModeToggle } from "../mode-toggle"

interface MobileNavigationProps {
  readonly userChainName?: string
}

export function MobileNavigation({ userChainName }: MobileNavigationProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="size-7" />
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
            {userChainName === "Sepolia" && (
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
  )
}
