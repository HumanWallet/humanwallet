import { CheckCircle, ExternalLink, RotateCcw } from "lucide-react"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@humanwallet/ui"

interface StakingSuccessProps {
  readonly successTx: string
  readonly onReset: () => void
}

export const StakingSuccess = ({ successTx, onReset }: StakingSuccessProps) => {
  const explorerUrl = `https://sepolia.etherscan.io/tx/${successTx}`
  const truncatedTx = `${successTx.slice(0, 8)}...${successTx.slice(-6)}`

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="size-6 text-success" />
        </div>
        <CardTitle className="text-success text-lg">Staking Successful!</CardTitle>
        <CardDescription className="text-sm">Your tokens have been successfully staked.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="rounded-lg bg-muted p-3">
          <div className="text-center space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Transaction Hash</p>
            <p className="font-mono text-xs break-all">{truncatedTx}</p>
            <Button variant="outline" size="sm" onClick={() => window.open(explorerUrl, "_blank")} className="w-full">
              <ExternalLink className="size-3 mr-1" />
              View on Explorer
            </Button>
          </div>
        </div>

        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="size-4 mr-2" />
          Stake Again
        </Button>
      </CardContent>
    </Card>
  )
}
