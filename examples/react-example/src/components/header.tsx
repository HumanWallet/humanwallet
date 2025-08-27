"use client"

import type { Connector } from "wagmi"
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from "wagmi"
import { CopyWalletbutton } from "./copy-wallet-button"
import { useState } from "react"
import { WalletConnectModal } from "./wallet-connect-modal"
import { normalize } from "viem/ens"
import { LogOut, WalletIcon } from "lucide-react"
import { Button } from "./ui/button"
import { SwitchChain } from "./switch-chain"
import { Typography } from "./ui/typography"
import { Link } from "react-router"

export function Header() {
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { data: ensName } = useEnsName({
    address,
  })
  const { data: ensAvatar } = useEnsAvatar({
    name: normalize(ensName!),
    query: { enabled: !!ensName },
  })

  const [connectingConnector, setConnectingConnector] = useState<string | null>(null)
  const handleConnect = (connector: Connector) => {
    setConnectingConnector(connector.id)
    connect(
      { connector },
      {
        onSettled: () => setConnectingConnector(null),
      },
    )
  }

  return (
    <div className="my-5 flex items-center justify-between gap-2 rounded-md border bg-white p-2 shadow-2xs">
      <Link to="/">
        <Typography variant="h1" className="mx-4 flex items-center gap-2 text-xl">
          Wallet View
          <WalletIcon className="size-6" />
        </Typography>
      </Link>
      <div className="flex items-center gap-2">
        <SwitchChain />
        {isConnected && address ? (
          <>
            <CopyWalletbutton ensAvatar={ensAvatar ?? undefined} ensName={ensName ?? undefined} address={address} />
            <Button size="icon" variant="default" onClick={() => disconnect()} title="Disconnect">
              <LogOut />
            </Button>
          </>
        ) : (
          <WalletConnectModal
            connectingConnector={connectingConnector}
            onConnect={handleConnect}
            connectors={connectors}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  )
}
