import { useTranslation } from "react-i18next"
import { useCallback, useEffect, useMemo, useState } from "react"
import { GiftIcon, UnlockedIcon, AddFilledIcon, Button, Card } from "@tutellus/tutellus-components"
import { formatUnits, parseUnits } from "viem"
import { sepolia } from "viem/chains"
import { useAccount, useReadContract, useWriteContract, useWaitForTransaction } from "@humanwallet/react"
import { Stepper, type StepItem } from "../Stepper"
import { StakingSuccess } from "./StakingSuccess"
import { MINT_AMOUNT } from "./config"
import { TokenAmount } from "../tokenAmount"
import { TOKEN_ABI } from "../../../contracts/abis/tokenABI"
import { STAKING_ABI } from "../../../contracts/abis/stakingABI"
import { CONTRACT_ADDRESSES } from "../../../contracts/addresses"
import styles from "./index.module.css"

enum StakingStep {
  MINT = "MINT",
  APPROVE = "APPROVE",
  STAKE = "STAKE",
}

export const StakingSteps = () => {
  const { t } = useTranslation("demo")
  const { address } = useAccount()
  const [successTx, setSuccessTx] = useState<string | null>(null)

  // Read contract hooks for balance and allowance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  })

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN,
    abi: TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, CONTRACT_ADDRESSES.STAKING] : undefined,
  })

  // Write contract hooks for transactions
  const {
    write: mintToken,
    isLoading: isPendingMint,
    data: mintTxHash,
    reset: resetMint,
  } = useWriteContract({
    address: CONTRACT_ADDRESSES.TOKEN,
    abi: TOKEN_ABI,
    functionName: "mint",
    args: address ? [address, parseUnits(MINT_AMOUNT.toString(), 18)] : undefined,
    chain: sepolia,
    account: (address as `0x${string}`) || null,
  })

  const {
    write: approveToken,
    isLoading: isPendingApprove,
    data: approveTxHash,
    reset: resetApprove,
  } = useWriteContract({
    address: CONTRACT_ADDRESSES.TOKEN,
    abi: TOKEN_ABI,
    functionName: "approve",
    args: [CONTRACT_ADDRESSES.STAKING, parseUnits(MINT_AMOUNT.toString(), 18)],
    chain: sepolia,
    account: (address as `0x${string}`) || null,
  })

  const {
    write: stakeToken,
    isLoading: isPendingStake,
    data: stakeTxHash,
    reset: resetStake,
  } = useWriteContract({
    address: CONTRACT_ADDRESSES.STAKING,
    abi: STAKING_ABI,
    functionName: "deposit",
    args: [parseUnits(MINT_AMOUNT.toString(), 18)],
    chain: sepolia,
    account: (address as `0x${string}`) || null,
  })

  // Wait for transaction hooks
  const { waitForTransaction: waitForMint } = useWaitForTransaction()
  const { waitForTransaction: waitForApprove } = useWaitForTransaction()
  const { waitForTransaction: waitForStake } = useWaitForTransaction()

  // Convert bigint balances to numbers
  const balance = balanceData ? Number(formatUnits(balanceData as bigint, 18)) : 0
  const allowance = allowanceData ? Number(formatUnits(allowanceData as bigint, 18)) : 0

  // Handle successful transactions
  const handleMintSuccess = useCallback(async () => {
    if (mintTxHash) {
      try {
        await waitForMint(mintTxHash as `0x${string}`)
        await refetchBalance()
        resetMint()
      } catch (error) {
        console.error("Mint transaction failed:", error)
      }
    }
  }, [mintTxHash, waitForMint, refetchBalance, resetMint])

  const handleApproveSuccess = useCallback(async () => {
    if (approveTxHash) {
      try {
        await waitForApprove(approveTxHash as `0x${string}`)
        await refetchAllowance()
        resetApprove()
      } catch (error) {
        console.error("Approve transaction failed:", error)
      }
    }
  }, [approveTxHash, waitForApprove, refetchAllowance, resetApprove])

  const handleStakeSuccess = useCallback(async () => {
    if (stakeTxHash) {
      try {
        await waitForStake(stakeTxHash as `0x${string}`)
        setSuccessTx(stakeTxHash)
        await refetchBalance()
        await refetchAllowance()
        resetStake()
      } catch (error) {
        console.error("Stake transaction failed:", error)
      }
    }
  }, [stakeTxHash, waitForStake, refetchBalance, refetchAllowance, resetStake])

  // Effect to handle transaction confirmations
  useEffect(() => {
    if (mintTxHash) handleMintSuccess()
  }, [mintTxHash, handleMintSuccess])

  useEffect(() => {
    if (approveTxHash) handleApproveSuccess()
  }, [approveTxHash, handleApproveSuccess])

  useEffect(() => {
    if (stakeTxHash) handleStakeSuccess()
  }, [stakeTxHash, handleStakeSuccess])

  const mintSection = () => (
    <div className={styles.stepContent}>
      <TokenAmount amount={MINT_AMOUNT} />
      <Button onClick={mintToken} isLoading={isPendingMint} isFull color="accent">
        {t("steps.mint.button")}
      </Button>
    </div>
  )

  const approveSection = () => (
    <div className={styles.stepContent}>
      <TokenAmount amount={MINT_AMOUNT} />
      <Button onClick={approveToken} isLoading={isPendingApprove} isFull color="accent">
        {t("steps.approve.button")}
      </Button>
    </div>
  )

  const stakeSection = () => (
    <div className={styles.stepContent}>
      <TokenAmount amount={MINT_AMOUNT} />
      <Button onClick={stakeToken} isLoading={isPendingStake} isFull color="accent">
        {t("steps.stake.button")}
      </Button>
    </div>
  )

  const steps: StepItem[] = [
    {
      key: StakingStep.MINT,
      icon: <GiftIcon />,
      header: t("steps.mint.header"),
      content: mintSection(),
    },
    {
      key: StakingStep.APPROVE,
      icon: <UnlockedIcon />,
      header: t("steps.approve.header"),
      content: approveSection(),
    },
    {
      key: StakingStep.STAKE,
      icon: <AddFilledIcon />,
      header: t("steps.stake.header"),
      content: stakeSection(),
    },
  ]

  const currentStep = useMemo(() => {
    if (balance >= 100 && allowance >= 100) return StakingStep.STAKE
    if (balance >= 100 && allowance < 100) return StakingStep.APPROVE
    return StakingStep.MINT
  }, [balance, allowance])

  return (
    <Card>
      {successTx ? (
        <StakingSuccess successTx={successTx} onReset={() => setSuccessTx(null)} />
      ) : (
        <Stepper currentStep={currentStep} steps={steps} />
      )}
    </Card>
  )
}
