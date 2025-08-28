import { useAccount, useConnect } from "wagmi"
import type { Connector } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wallet, AlertCircle, UserPlus } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router"

export default function Connect() {
  const { isConnected } = useAccount()
  const { connectors, connect, isPending, error } = useConnect()
  const navigate = useNavigate()

  // Redirect to home after successful connection
  useEffect(() => {
    if (isConnected) {
      navigate("/")
    }
  }, [isConnected, navigate])

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
