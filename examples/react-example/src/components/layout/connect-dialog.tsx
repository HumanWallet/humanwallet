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
  Separator,
  Alert,
  AlertDescription,
  Typography,
} from "@humanwallet/ui"
import { Wallet, AlertCircle, UserPlus, Key } from "lucide-react"
import { useEffect } from "react"
import { useAuth } from "../../context/auth-context"

export function ConnectDialog() {
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
      <DialogTrigger asChild>
        <Button>Connect</Button>
      </DialogTrigger>
      <DialogContent className="px-2 sm:px-4">
        <DialogHeader className="space-y-3 px-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg sm:text-xl font-semibold">
            Connect or create your wallet
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground max-w-xs sm:max-w-sm mx-auto">
            Connect using your passkey for secure, passwordless authentication. No browser extensions required.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 px-1">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <Typography variant="small" className="font-medium mb-1">
                  Connection Error
                </Typography>
                <Typography variant="muted" className="text-sm">
                  {error.message}
                </Typography>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-4">
            {connectors.map((connector) => {
              if (connector.name === "HumanWallet") {
                return (
                  <div key={connector.uid} className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleConnectHumanWallet(connector)}
                      disabled={isPending}
                      className="w-full h-auto p-3 sm:p-4 justify-start"
                    >
                      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
                        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                          <img src={connector.icon} alt={connector.name} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="sm:flex-1 text-left min-w-0">
                          <Typography variant="small" className="font-medium text-sm sm:text-base">
                            Connect with HumanWallet
                          </Typography>
                          <Typography variant="muted" className="text-xs sm:text-sm leading-relaxed">
                            Use your existing passkey
                          </Typography>
                        </div>
                        {isPending && (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-primary border-t-transparent flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </Button>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <Separator className="flex-1" />
                      <Typography variant="muted" className="text-xs">
                        or
                      </Typography>
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
                  <Typography variant="small" className="font-medium text-sm sm:text-base">
                    HumanWallet connector not available
                  </Typography>
                  <Typography variant="muted" className="text-xs sm:text-sm">
                    Please check your configuration.
                  </Typography>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Key className="w-3 h-3 text-muted-foreground" />
              <Typography variant="muted" className="text-xs">
                Powered by WebAuthn passkeys
              </Typography>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
