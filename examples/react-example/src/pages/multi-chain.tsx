import { useAccount, useSwitchChain, useBalance, useChains, useChainId } from "wagmi"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@humanwallet/ui"
import {
  Network,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Wallet,
  Coins,
  Globe,
} from "lucide-react"
import { formatUnits } from "viem"
import type { config } from "@/wagmi/config"

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}

export default function MultiChain() {
  const { address, chain } = useAccount()
  const chainId = useChainId()
  const chains = useChains()

  const { switchChain, isPending: isSwitching, error: switchError } = useSwitchChain()

  // Get balance for current chain with better caching
  const {
    data: balanceData,
    refetch: refetchBalance,
    error: balanceError,
  } = useBalance({
    address,
    chainId: chain?.id,
    query: {
      enabled: !!address && !!chain?.id,
      staleTime: 30000, // 30 seconds
      refetchInterval: 60000, // 1 minute
      refetchOnWindowFocus: true,
    },
  })

  const getChainIcon = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "🔵" // Ethereum
      case 137:
        return "🟣" // Polygon
      case 56:
        return "🟡" // BNB
      case 11155111:
        return "🟢" // Base Sepolia
      default:
        return "⚫"
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Multi-Chain Support</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seamlessly switch between networks, view balances across chains, and experience true multi-chain
            interoperability
          </p>
        </div>

        {/* Current Network Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              Current Network
            </CardTitle>
            <CardDescription>Your wallet is currently connected to this network</CardDescription>
          </CardHeader>
          <CardContent>
            {chain ? (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getChainIcon(chain.id)}</div>
                  <div>
                    <div className="font-semibold">{chain.name}</div>
                    <div className="text-sm text-muted-foreground">Chain ID: {chain.id}</div>
                  </div>
                </div>
                <Badge variant="default" className="bg-success/10 text-success">
                  <CheckCircle2 className="size-3 mr-1" />
                  Connected
                </Badge>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <AlertCircle className="size-8 mx-auto mb-2 opacity-50" />
                <p>No network detected</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {(balanceError || switchError) && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{balanceError?.message || switchError?.message}</AlertDescription>
          </Alert>
        )}

        {/* Chain Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chains.map((chainInfo) => {
            const isCurrentChain = chainId === chainInfo.id

            return (
              <Card key={chainInfo.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getChainIcon(chainInfo.id)}</span>
                      <CardTitle className="text-lg">{chainInfo.name}</CardTitle>
                    </div>
                    <Badge
                      variant={isCurrentChain ? "default" : "secondary"}
                      className={isCurrentChain ? "bg-success/10 text-success" : ""}
                    >
                      {isCurrentChain ? "Current" : "Available"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Chain ID: {chainInfo.id} • {chainInfo.nativeCurrency.symbol}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Balance Display */}
                  {isCurrentChain && address && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Balance:</span>
                        <span className="font-mono font-medium">
                          {balanceData
                            ? `${formatUnits(balanceData.value, balanceData.decimals)} ${balanceData.symbol}`
                            : "Loading..."}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {isCurrentChain ? (
                      <Button variant="outline" className="w-full" disabled>
                        <CheckCircle2 className="size-4 mr-2" />
                        Connected
                      </Button>
                    ) : (
                      <Button
                        onClick={() => switchChain({ chainId: chainInfo.id as (typeof config.chains)[0]["id"] })}
                        disabled={isSwitching}
                        className="w-full"
                      >
                        {isSwitching ? (
                          <>
                            <RefreshCw className="size-4 mr-2 animate-spin" />
                            Switching...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="size-4 mr-2" />
                            Switch to {chainInfo.name}
                          </>
                        )}
                      </Button>
                    )}

                    {/* Get Balance Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchBalance()}
                      disabled={!address}
                      className="w-full"
                    >
                      <Coins className="size-4 mr-2" />
                      Refresh Balance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Cross-Chain Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="size-5" />
                Cross-Chain Bridge
              </CardTitle>
              <CardDescription>Bridge assets between different networks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-2 bg-primary rounded-full"></div>
                  <span>Ethereum → Polygon</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-2 bg-success rounded-full"></div>
                  <span>Polygon → BSC</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-2 bg-accent rounded-full"></div>
                  <span>Arbitrum → Optimism</span>
                </div>
                <Button variant="outline" className="w-full mt-4" disabled>
                  <ExternalLink className="size-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="size-5" />
                Multi-Chain Wallet
              </CardTitle>
              <CardDescription>Manage assets across all connected networks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Value Locked:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Connected Networks:</span>
                  <span className="font-semibold">{chain ? 1 : 0}/6</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Active Transactions:</span>
                  <span className="font-semibold">0</span>
                </div>
                <Button variant="outline" className="w-full mt-4" disabled>
                  <RefreshCw className="size-4 mr-2" />
                  Refresh Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              Network Information
            </CardTitle>
            <CardDescription>Learn more about supported networks and their features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chains.map((chainInfo) => (
                <div key={chainInfo.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getChainIcon(chainInfo.id)}</span>
                    <span className="font-medium">{chainInfo.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Chain ID: {chainInfo.id}</div>
                    <div>Native Token: {chainInfo.nativeCurrency.symbol}</div>
                    <div>Decimals: {chainInfo.nativeCurrency.decimals}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
