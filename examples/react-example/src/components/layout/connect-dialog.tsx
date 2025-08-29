import { useConnect } from "wagmi"
import type { Connector } from "wagmi"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Alert,
  AlertDescription,
} from "@humanwallet/ui"
import { Wallet, AlertCircle, UserPlus, Shield, Key } from "lucide-react"
import { useEffect } from "react"
import { useAuth } from "../../context/auth-context"

interface ConnectDialogProps {
  readonly children: React.ReactNode
}

export function ConnectDialog({ children }: ConnectDialogProps) {
  const { isAuthenticated } = useAuth()
  const { connectors, connect, isPending, error } = useConnect()

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

  // Close dialog after successful connection
  useEffect(() => {
    if (isAuthenticated) {
      // The dialog will automatically close when isAuthenticated changes
      // due to the conditional rendering in the parent component
    }
  }, [isAuthenticated])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader className="space-y-3 px-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg sm:text-xl font-semibold">Connect with HumanWallet</DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground max-w-xs sm:max-w-sm mx-auto">
            Connect using your passkey for secure, passwordless authentication. No browser extensions required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 px-1">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-1">Connection Error</div>
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex-shrink-0">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base sm:text-lg">Secure Authentication</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Login with existing passkey or create a new HumanWallet</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectors.map((connector) => {
                if (connector.name === "HumanWallet") {
                  return (
                    <div key={connector.uid} className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => handleConnectHumanWallet(connector)}
                        disabled={isPending}
                        className="w-full h-auto p-3 sm:p-4 justify-start"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex-shrink-0">
                            <img src={connector.icon} alt={connector.name} className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="font-medium text-sm sm:text-base truncate">Login with Passkey</div>
                            <div className="text-xs sm:text-sm text-muted-foreground truncate">
                              Use your existing passkey or authenticate to continue
                            </div>
                          </div>
                          {isPending && (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-primary border-t-transparent flex-shrink-0" />
                          )}
                        </div>
                      </Button>

                      <div className="flex items-center gap-2 sm:gap-3">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">or</span>
                        <Separator className="flex-1" />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCreateNewWallet(connector)}
                        disabled={isPending}
                        className="w-full text-xs sm:text-sm"
                      >
                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Create a new HumanWallet
                      </Button>
                    </div>
                  )
                }
                return null
              })}

              {connectors.length === 0 && (
                <div className="text-center py-6 sm:py-8">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted mx-auto mb-3 sm:mb-4">
                    <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-sm sm:text-base">HumanWallet connector not available</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Please check your configuration.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Key className="w-3 h-3" />
              <span>Powered by WebAuthn passkeys</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
