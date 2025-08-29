import { useConnect } from "wagmi"
import type { Connector } from "wagmi"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@humanwallet/ui"
import { Wallet, AlertCircle, UserPlus } from "lucide-react"
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-center text-lg sm:text-xl">Connect with HumanWallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm sm:text-base text-muted-foreground">
              Connect using your passkey for secure, passwordless authentication. No browser extensions required.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 text-destructive" />
                <h4 className="font-medium text-destructive text-sm sm:text-base">Connection Error</h4>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-destructive/80">{error.message}</p>
            </div>
          )}

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4 sm:p-6 pb-2">
              <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold leading-none tracking-tight">
                <Wallet className="size-4 sm:size-5" />
                HumanWallet Connection
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Login with existing passkey or create a new HumanWallet
              </p>
            </div>
            <div className="p-4 sm:p-6 pt-0">
              <div className="grid gap-3">
                {connectors.map((connector) => {
                  if (connector.name === "HumanWallet") {
                    return (
                      <div key={connector.uid} className="space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => handleConnectHumanWallet(connector)}
                          disabled={isPending}
                          className="justify-start h-auto p-3 sm:p-4 text-left w-full"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 w-full">
                            <div className="size-6 sm:size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <img src={connector.icon} alt={connector.name} className="size-4 sm:size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm sm:text-base">Login with Passkey</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">
                                Use your existing passkey or authenticate to continue
                              </div>
                            </div>
                            {isPending && (
                              <div className="size-3 sm:size-4 animate-spin rounded-full border-2 border-primary border-t-transparent flex-shrink-0" />
                            )}
                          </div>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateNewWallet(connector)}
                          disabled={isPending}
                          className="w-full text-xs text-muted-foreground hover:text-foreground py-2"
                        >
                          <UserPlus className="size-3 mr-1" />
                          Or create a new HumanWallet
                        </Button>
                      </div>
                    )
                  }
                })}

                {connectors.length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Wallet className="size-8 sm:size-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">HumanWallet connector not available.</p>
                    <p className="text-xs sm:text-sm">Please check your configuration.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
