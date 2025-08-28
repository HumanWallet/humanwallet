import { CheckCircle, ExternalLink, RotateCcw } from "lucide-react"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@humanwallet/ui"

interface StakingSuccessProps {
  readonly successTx: string
  readonly onReset: () => void
}

export const StakingSuccess = ({ successTx, onReset }: StakingSuccessProps) => {
  const explorerUrl = `https://etherscan.io/tx/${successTx}`
  const truncatedTx = `${successTx.slice(0, 10)}...${successTx.slice(-8)}`

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-green-700 dark:text-green-400">Staking Successful!</CardTitle>
        <CardDescription>
          Your tokens have been successfully staked. You can view the transaction details below.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Transaction Hash</p>
              <p className="font-mono text-sm">{truncatedTx}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.open(explorerUrl, "_blank")} className="shrink-0">
              <ExternalLink className="size-4" />
              View on Explorer
            </Button>
          </div>
        </div>

        <div className="grid gap-3 pt-4">
          <Button onClick={onReset} variant="outline" className="w-full">
            <RotateCcw className="size-4" />
            Stake Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
