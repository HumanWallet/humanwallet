import { useState, useEffect } from "react"
import { parseUnits, encodeFunctionData, type Hash } from "viem"
import { useAccount, useReadContract, useWaitForTransactionReceipt, useSendCalls } from "wagmi"
import { Package, Loader2 } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@humanwallet/ui"
import { StakingSuccess } from "../ui/staking-success"
import { TokenAmount } from "../ui/token-amount"
import { TOKEN_ABI } from "../../contracts/abis/token-abi"
import { STAKING_ABI } from "../../contracts/abis/staking-abi"
import { CONTRACT_ADDRESSES, MINT_AMOUNT } from "../../contracts/addresses"

export const StakingBundle = () => {
  const { address } = useAccount()
  const [successTx, setSuccessTx] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch token decimals
  const { data: decimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Get decimals or default to 18 if not loaded yet
  const decimals = decimalsData ? Number(decimalsData) : 18

  // Use wagmi's useSendCalls for batch transactions
  const { sendCalls, data: batchData, isPending: isBatchPending } = useSendCalls()

  // Wait for batch transaction receipt
  const { data: batchReceipt, error: receiptError } = useWaitForTransactionReceipt({
    hash: batchData?.id as Hash,
  })

  // Handle batch transaction completion
  useEffect(() => {
    if (batchReceipt && batchData) {
      setSuccessTx(batchReceipt.transactionHash)
      setError(null)
    }
  }, [batchReceipt, batchData])

  // Handle errors
  useEffect(() => {
    if (receiptError) {
      setError(receiptError.message)
    }
  }, [receiptError])

  const handleMintAndStake = () => {
    if (!address) return

    setError(null)

    // Create batch of calls using useSendCalls
    sendCalls(
      {
        calls: [
          // 1. Mint tokens
          {
            to: CONTRACT_ADDRESSES.TOKEN,
            data: encodeFunctionData({
              abi: TOKEN_ABI,
              functionName: "mint",
              args: [address, parseUnits(MINT_AMOUNT.toString(), decimals)],
            }),
          },
          // 2. Approve tokens for staking
          {
            to: CONTRACT_ADDRESSES.TOKEN,
            data: encodeFunctionData({
              abi: TOKEN_ABI,
              functionName: "approve",
              args: [CONTRACT_ADDRESSES.STAKING, parseUnits(MINT_AMOUNT.toString(), decimals)],
            }),
          },
          // 3. Stake tokens
          {
            to: CONTRACT_ADDRESSES.STAKING,
            data: encodeFunctionData({
              abi: STAKING_ABI,
              functionName: "deposit",
              args: [parseUnits(MINT_AMOUNT.toString(), decimals)],
            }),
          },
        ],
      },
      {
        onSuccess: (data) => {
          console.log("Batch transaction initiated:", data)
        },
        onError: (error) => {
          console.error("Batch transaction failed:", error)
          setError(error.message)
        },
      },
    )
  }

  // Reset function
  const handleReset = () => {
    setSuccessTx(null)
    setError(null)
  }

  if (successTx) {
    return <StakingSuccess successTx={successTx} onReset={handleReset} />
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Package className="size-8 text-primary" />
        </div>
        <CardTitle>Bundle Staking</CardTitle>
        <CardDescription>
          Mint, approve, and stake tokens in a single batch transaction for optimal efficiency
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Transaction Failed</AlertTitle>
            <AlertDescription className="break-words">
              {error.length > 200 ? (
                <>
                  {error.substring(0, 200)}...
                  <details className="mt-2 cursor-pointer">
                    <summary className="text-xs text-destructive/70 hover:text-destructive/90">
                      Click to see full error details
                    </summary>
                    <div className="mt-2 p-2 bg-destructive/10 rounded text-xs font-mono break-all">{error}</div>
                  </details>
                </>
              ) : (
                error
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-3">Transaction Bundle:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                Mint {MINT_AMOUNT.toLocaleString()} TKN tokens
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                Approve staking contract
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                Stake all tokens
              </div>
            </div>
          </div>

          <TokenAmount amount={MINT_AMOUNT} className="mx-auto" />

          <Button
            onClick={handleMintAndStake}
            disabled={isBatchPending || !decimalsData || !address}
            className="w-full"
            size="lg"
          >
            {isBatchPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing Bundle...
              </>
            ) : (
              <>
                <Package className="size-4" />
                Execute Bundle Transaction
              </>
            )}
          </Button>

          {!address && (
            <p className="text-center text-sm text-muted-foreground">Please connect your wallet to continue</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
