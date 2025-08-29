import { ConnectDialog } from "../components/layout"
import { Button } from "@humanwallet/ui"

export default function Connect() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Connect with HumanWallet</h1>
          <p className="text-muted-foreground">
            Connect using your passkey for secure, passwordless authentication. No browser extensions required.
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <ConnectDialog>
              <Button className="w-full">Open Connect Dialog</Button>
            </ConnectDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
