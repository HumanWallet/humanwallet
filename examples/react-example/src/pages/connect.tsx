import { useAccount, useConnect, useDisconnect } from "wagmi"
import type { Connector } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, CheckCircle, AlertCircle, LogOut, Copy, ExternalLink, UserPlus } from "lucide-react"

export default function Connect() {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  const truncateAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleConnectHumanWallet = (connector: Connector): void => {
    // Simple connect - the connector will handle login vs registration automatically
    connect({ connector })
  }

  const handleCreateNewWallet = (connector: Connector): void => {
    // Force create new wallet with native prompt
    ;(connect as (args: { connector: Connector; forceCreate?: boolean }) => void)({
      connector,
      forceCreate: true,
    })
  }

  if (isConnected && address) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Wallet Connected</h1>
            <p className="text-muted-foreground">Your wallet is successfully connected to the application</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-500" />
                Connection Status
              </CardTitle>
              <CardDescription>Your wallet connection details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    variant="default"
                    className="bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-800"
                  >
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network</span>
                  <Badge variant="outline">{chain?.name || "Unknown"}</Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Wallet Address</span>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="text-sm font-mono flex-1">{truncateAddress(address)}</code>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(address)} className="size-8">
                      <Copy className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" asChild className="size-8">
                      <a
                        href={`${chain?.blockExplorers?.default?.url}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <Button variant="outline" onClick={() => disconnect()} className="w-full">
                <LogOut className="size-4" />
                Disconnect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Choose a wallet to connect to this application. Make sure you have it installed and set up.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-5" />
              Available Wallets
            </CardTitle>
            <CardDescription>Select a wallet provider to establish connection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {connectors.map((connector) => {
                if (connector.name === "HumanWallet") {
                  console.log("connector", connector)
                  return (
                    <div key={connector.uid} className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => handleConnectHumanWallet(connector)}
                        disabled={isPending}
                        className="justify-start h-auto p-4 text-left w-full"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <img src={connector.icon} alt={connector.name} className="size-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Connect with {connector.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Login with existing passkey or create new wallet
                            </div>
                          </div>
                          {isPending && (
                            <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          )}
                        </div>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCreateNewWallet(connector)}
                        disabled={isPending}
                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                      >
                        <UserPlus className="size-3 mr-1" />
                        Or create a new wallet
                      </Button>
                    </div>
                  )
                }

                return (
                  <Button
                    key={connector.uid}
                    variant="outline"
                    onClick={() => connect({ connector })}
                    disabled={isPending}
                    className="justify-start h-auto p-4 text-left"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {connector.icon ? (
                          <img src={connector.icon} alt={connector.name} className="size-5" />
                        ) : (
                          <Wallet className="size-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{connector.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {connector.type === "injected" ? "Browser extension wallet" : "External wallet connection"}
                        </div>
                      </div>
                      {isPending && (
                        <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>

            {connectors.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="size-12 mx-auto mb-4 opacity-50" />
                <p>No wallet connectors available.</p>
                <p className="text-sm">Please install a compatible wallet extension.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need a Wallet?</CardTitle>
            <CardDescription>
              Don&apos;t have a wallet yet? Here are some popular options to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="ghost" asChild className="justify-start h-auto p-4">
                <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex items-center gap-3 w-full">
                    <div className="size-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <ExternalLink className="size-4 text-orange-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">MetaMask</div>
                      <div className="text-sm text-muted-foreground">Most popular Ethereum wallet</div>
                    </div>
                  </div>
                </a>
              </Button>

              <Button variant="ghost" asChild className="justify-start h-auto p-4">
                <a href="https://walletconnect.com/" target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex items-center gap-3 w-full">
                    <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <ExternalLink className="size-4 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">WalletConnect</div>
                      <div className="text-sm text-muted-foreground">Connect mobile wallets</div>
                    </div>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
