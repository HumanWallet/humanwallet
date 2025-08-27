"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Wallet } from "lucide-react"
import type { Connector, CreateConnectorFn } from "wagmi"

interface WalletConnectModalProps {
  onConnect: (connector: Connector) => void
  connectors: readonly Connector<CreateConnectorFn>[]
  isPending: boolean
  connectingConnector: string | null
}

export function WalletConnectModal({ onConnect, connectors, isPending, connectingConnector }: WalletConnectModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" title="Connect Wallet">
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Select your wallet</DialogTitle>
          <DialogDescription>Select your wallet to continue.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => onConnect(connector)}
              disabled={isPending || connectingConnector === connector.id}
              className="w-full justify-start"
              variant="outline"
              size="lg"
            >
              {connectingConnector === connector.id ? <Loader2 className="animate-spin" /> : <Wallet />}
              {connector.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
