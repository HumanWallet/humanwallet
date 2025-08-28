import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@humanwallet/ui"
import { LogOut, User } from "lucide-react"
import { useTruncateAddress } from "@/hooks/use-truncate-address"
import { Link } from "react-router"

export function Header() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const truncatedAddress = useTruncateAddress(address ?? "", { startLength: 6, endLength: 4 })

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand and Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/HumanWallet.svg" alt="HumanWallet" className="size-6" />
            <h1 className="text-xl font-bold">HumanWallet</h1>
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">Demo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/staking-demo">Staking Demo</Link>
            </Button>
          </nav>
        </div>

        {/* Connect/Wallet Section */}
        <div className="flex items-center gap-4">
          {isConnected && address ? (
            <>
              <span className="hidden sm:inline-flex border rounded px-2 py-1 text-xs">{chain?.name || "Unknown"}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-2 bg-green-500 rounded-full" />
                  <span className="hidden sm:inline">{truncatedAddress}</span>
                  <span className="sm:hidden">
                    <User className="size-4" />
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnect()}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline ml-1">Disconnect</span>
                </Button>
              </div>
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
