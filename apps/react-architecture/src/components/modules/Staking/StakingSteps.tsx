import { useTranslation } from "react-i18next"
import { useEffect, useMemo, useState } from "react"
import { GiftIcon, UnlockedIcon, AddFilledIcon, Button, Card } from "@tutellus/tutellus-components"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
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

  // Convert bigint balances to numbers
  const balance = balanceData ? Number(formatUnits(balanceData as bigint, 18)) : 0
  const allowance = allowanceData ? Number(formatUnits(allowanceData as bigint, 18)) : 0

  // Handle successful transactions
  useEffect(() => {
    if (mintReceipt) {
      refetchBalance()
      resetMint()
    }
  }, [mintReceipt, refetchBalance, resetMint])

  useEffect(() => {
    if (approveReceipt) {
      refetchAllowance()
      resetApprove()
    }
  }, [approveReceipt, refetchAllowance, resetApprove])

  useEffect(() => {
    if (stakeReceipt) {
      setSuccessTx(stakeTxHash!)
      refetchBalance()
      refetchAllowance()
      resetStake()
    }
  }, [stakeReceipt, stakeTxHash, refetchBalance, refetchAllowance, resetStake])

  const handleMint = () => {
    if (address) {
      mintToken({
        address: CONTRACT_ADDRESSES.TOKEN,
        abi: TOKEN_ABI,
        functionName: "mint",
        args: [address, parseUnits(MINT_AMOUNT.toString(), 18)],
      })
    }
  }

  const handleApprove = () => {
    approveToken({
      address: CONTRACT_ADDRESSES.TOKEN,
      abi: TOKEN_ABI,
      functionName: "approve",
      args: [CONTRACT_ADDRESSES.STAKING, parseUnits(MINT_AMOUNT.toString(), 18)],
    })
  }

  const handleStake = () => {
    stakeToken({
      address: CONTRACT_ADDRESSES.STAKING,
      abi: STAKING_ABI,
      functionName: "deposit",
      args: [parseUnits(MINT_AMOUNT.toString(), 18)],
    })
  }

  const mintSection = () => (
    <div className={styles.stepContent}>
      <TokenAmount amount={MINT_AMOUNT} />
      <Button onClick={handleMint} isLoading={isPendingMint} isFull color="accent">
        {t("steps.mint.button")}
      </Button>
    </div>
  )

  const approveSection = () => (
    <div className={styles.stepContent}>
      <TokenAmount amount={MINT_AMOUNT} />
      <Button onClick={handleApprove} isLoading={isPendingApprove} isFull color="accent">
        {t("steps.approve.button")}
      </Button>
    </div>
  )

  const stakeSection = () => (
    <div className={styles.stepContent}>
      <TokenAmount amount={MINT_AMOUNT} />
      <Button onClick={handleStake} isLoading={isPendingStake} isFull color="accent">
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
