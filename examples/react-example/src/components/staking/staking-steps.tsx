import { useEffect, useMemo, useState } from "react"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Gift, Unlock, TrendingUp, Loader2 } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  Badge,
} from "@humanwallet/ui"
import { Stepper, type StepItem } from "../ui/stepper"
import { StakingSuccess } from "../ui/staking-success"
import { TokenAmount } from "../ui/token-amount"
import { TOKEN_ABI } from "../../contracts/abis/token-abi"
import { STAKING_ABI } from "../../contracts/abis/staking-abi"
import { CONTRACT_ADDRESSES, MINT_AMOUNT } from "../../contracts/addresses"

const StakingStep = {
  MINT: "MINT",
  APPROVE: "APPROVE",
  STAKE: "STAKE",
} as const

type StakingStep = (typeof StakingStep)[keyof typeof StakingStep]

export const StakingSteps = () => {
  const { address } = useAccount()
  const [successTx, setSuccessTx] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Read contract hooks for decimals, balance and allowance
  const { data: decimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN,
    abi: TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, CONTRACT_ADDRESSES.STAKING] : undefined,
    query: { enabled: !!address },
  })

  // Write contract hooks for transactions
  const { writeContract: mintToken, isPending: isPendingMint, data: mintTxHash, reset: resetMint } = useWriteContract()

  const {
    writeContract: approveToken,
    isPending: isPendingApprove,
    data: approveTxHash,
    reset: resetApprove,
  } = useWriteContract()

  const {
    writeContract: stakeToken,
    isPending: isPendingStake,
    data: stakeTxHash,
    reset: resetStake,
  } = useWriteContract()

  // Wait for transaction receipts
  const { data: mintReceipt } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  })

  const { data: approveReceipt } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  })

  const { data: stakeReceipt } = useWaitForTransactionReceipt({
    hash: stakeTxHash,
  })

  // Get decimals or default to 18 if not loaded yet
  const decimals = decimalsData ? Number(decimalsData) : 18

  // Convert bigint balances to numbers
  const balance = balanceData ? Number(formatUnits(balanceData as bigint, decimals)) : 0
  const allowance = allowanceData ? Number(formatUnits(allowanceData as bigint, decimals)) : 0

  // Handle successful transactions
  useEffect(() => {
    if (mintReceipt) {
      refetchBalance()
      resetMint()
      setError(null)
    }
  }, [mintReceipt, refetchBalance, resetMint])

  useEffect(() => {
    if (approveReceipt) {
      refetchAllowance()
      resetApprove()
      setError(null)
    }
  }, [approveReceipt, refetchAllowance, resetApprove])

  useEffect(() => {
    if (stakeReceipt) {
      setSuccessTx(stakeTxHash!)
      refetchBalance()
      refetchAllowance()
      resetStake()
      setError(null)
    }
  }, [stakeReceipt, stakeTxHash, refetchBalance, refetchAllowance, resetStake])

  const handleMint = () => {
    if (address) {
      setError(null)
      mintToken(
        {
          address: CONTRACT_ADDRESSES.TOKEN,
          abi: TOKEN_ABI,
          functionName: "mint",
          args: [address, parseUnits(MINT_AMOUNT.toString(), decimals)],
        },
        {
          onError: (error) => {
            setError(`Mint failed: ${error.message}`)
          },
        },
      )
    }
  }

  const handleApprove = () => {
    setError(null)
    approveToken(
      {
        address: CONTRACT_ADDRESSES.TOKEN,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.STAKING, parseUnits(MINT_AMOUNT.toString(), decimals)],
      },
      {
        onError: (error) => {
          setError(`Approval failed: ${error.message}`)
        },
      },
    )
  }

  const handleStake = () => {
    setError(null)
    stakeToken(
      {
        address: CONTRACT_ADDRESSES.STAKING,
        abi: STAKING_ABI,
        functionName: "deposit",
        args: [parseUnits(MINT_AMOUNT.toString(), decimals)],
      },
      {
        onError: (error) => {
          setError(`Staking failed: ${error.message}`)
        },
      },
    )
  }

  const mintContent = () => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">First, mint some tokens to your wallet</p>
        <TokenAmount amount={MINT_AMOUNT} />
        {balance > 0 && (
          <Badge variant="outline" className="mt-2">
            Current balance: {balance.toLocaleString()} TKN
          </Badge>
        )}
      </div>
      <Button onClick={handleMint} disabled={isPendingMint || !address} className="w-full" size="lg">
        {isPendingMint ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Minting...
          </>
        ) : (
          <>
            <Gift className="size-4" />
            Mint Tokens
          </>
        )}
      </Button>
    </div>
  )

  const approveContent = () => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Approve the staking contract to spend your tokens</p>
        <TokenAmount amount={MINT_AMOUNT} />
        {allowance > 0 && (
          <Badge variant="outline" className="mt-2">
            Current allowance: {allowance.toLocaleString()} TKN
          </Badge>
        )}
      </div>
      <Button onClick={handleApprove} disabled={isPendingApprove || balance < MINT_AMOUNT} className="w-full" size="lg">
        {isPendingApprove ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Approving...
          </>
        ) : (
          <>
            <Unlock className="size-4" />
            Approve Tokens
          </>
        )}
      </Button>
    </div>
  )

  const stakeContent = () => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Stake your tokens to start earning rewards</p>
        <TokenAmount amount={MINT_AMOUNT} />
      </div>
      <Button onClick={handleStake} disabled={isPendingStake || allowance < MINT_AMOUNT} className="w-full" size="lg">
        {isPendingStake ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Staking...
          </>
        ) : (
          <>
            <TrendingUp className="size-4" />
            Stake Tokens
          </>
        )}
      </Button>
    </div>
  )

  const steps: StepItem[] = [
    {
      key: StakingStep.MINT,
      icon: <Gift className="size-4" />,
      title: "Mint Tokens",
      description: `Mint ${MINT_AMOUNT.toLocaleString()} TKN tokens`,
      content: mintContent(),
    },
    {
      key: StakingStep.APPROVE,
      icon: <Unlock className="size-4" />,
      title: "Approve Tokens",
      description: "Allow staking contract to spend tokens",
      content: approveContent(),
    },
    {
      key: StakingStep.STAKE,
      icon: <TrendingUp className="size-4" />,
      title: "Stake Tokens",
      description: "Deposit tokens to earn rewards",
      content: stakeContent(),
    },
  ]

  const currentStep = useMemo(() => {
    if (balance >= MINT_AMOUNT && allowance >= MINT_AMOUNT) return StakingStep.STAKE
    if (balance >= MINT_AMOUNT && allowance < MINT_AMOUNT) return StakingStep.APPROVE
    return StakingStep.MINT
  }, [balance, allowance])

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
        <CardTitle>Step-by-Step Staking</CardTitle>
        <CardDescription>Complete each step individually to mint, approve, and stake your tokens</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!address && (
          <Alert>
            <AlertDescription>Please connect your wallet to continue with the staking process</AlertDescription>
          </Alert>
        )}

        <Stepper steps={steps} currentStep={currentStep} orientation="vertical" />
      </CardContent>
    </Card>
  )
}
