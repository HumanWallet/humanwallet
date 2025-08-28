import { useAccount, useConnect, useDisconnect } from "wagmi"
import type { Connector } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, CheckCircle, AlertCircle, LogOut, Copy, Check, ExternalLink, UserPlus } from "lucide-react"
import { useTruncateAddress } from "@/hooks/use-truncate-address"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export default function Connect() {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const truncatedAddress = useTruncateAddress(address ?? "", { startLength: 6, endLength: 4 })
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    timeout: 2000,
    onCopy: () => {
      // Optional: Could add toast notification here
    },
  })

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
            <h1 className="text-3xl font-bold tracking-tight">HumanWallet Connected</h1>
            <p className="text-muted-foreground">
              Your HumanWallet is successfully connected via passkey authentication
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-500" />
                Connection Status
              </CardTitle>
              <CardDescription>Your HumanWallet connection details</CardDescription>
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
                  <span className="text-sm font-medium">Account Address</span>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg group">
                    <code
                      className="text-sm font-mono flex-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => copyToClipboard(address)}
                      title="Click to copy full address"
                    >
                      {truncatedAddress}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(address)}
                      className={`size-8 transition-all duration-200 ${
                        isCopied
                          ? "bg-green-100 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                          : "hover:bg-background"
                      }`}
                      title={isCopied ? "Address copied!" : "Copy address"}
                    >
                      {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" asChild className="size-8 hover:bg-background">
                      <a
                        href={`${chain?.blockExplorers?.default?.url}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on block explorer"
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
                Disconnect HumanWallet
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
          <h1 className="text-3xl font-bold tracking-tight">Connect with HumanWallet</h1>
          <p className="text-muted-foreground">
            Connect using your passkey for secure, passwordless authentication. No browser extensions required.
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
              HumanWallet Connection
            </CardTitle>
            <CardDescription>Login with existing passkey or create a new HumanWallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {connectors.map((connector) => {
                if (connector.name === "HumanWallet") {
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
                            <div className="font-medium">Login with Passkey</div>
                            <div className="text-sm text-muted-foreground">
                              Use your existing passkey or authenticate to continue
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
                        Or create a new HumanWallet
                      </Button>
                    </div>
                  )
                }
              })}
            </div>

            {connectors.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="size-12 mx-auto mb-4 opacity-50" />
                <p>HumanWallet connector not available.</p>
                <p className="text-sm">Please check your configuration.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
