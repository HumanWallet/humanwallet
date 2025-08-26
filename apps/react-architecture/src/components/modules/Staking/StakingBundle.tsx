import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { Button, Card } from "@tutellus/tutellus-components"
import { parseUnits } from "viem"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { StakingSuccess } from "./StakingSuccess"
import { MINT_AMOUNT } from "./config"
import { TokenAmount } from "../tokenAmount"
import { TOKEN_ABI } from "../../../contracts/abis/tokenABI"
import { STAKING_ABI } from "../../../contracts/abis/stakingABI"
import { CONTRACT_ADDRESSES } from "../../../contracts/addresses"
import styles from "./index.module.css"

export const StakingBundle = () => {
  const { t } = useTranslation("demo")
  const { address } = useAccount()
  const [successTx, setSuccessTx] = useState<string | null>(null)

  // State to track the current operation
  const [currentStep, setCurrentStep] = useState<"idle" | "minting" | "approving" | "staking" | "completed">("idle")

  // Mint tokens
  const { writeContract: mintTokens, isPending: isMintPending, data: mintTxHash, reset: resetMint } = useWriteContract()

  // Approve tokens
  const {
    writeContract: approveTokens,
    isPending: isApprovePending,
    data: approveTxHash,
    reset: resetApprove,
  } = useWriteContract()

  // Stake tokens
  const {
    writeContract: stakeTokens,
    isPending: isStakePending,
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

  // Combined loading state
  const isPendingMintAndStake =
    isMintPending || isApprovePending || isStakePending || (currentStep !== "idle" && currentStep !== "completed")

  // Handle mint completion
  useEffect(() => {
    if (mintReceipt && currentStep === "minting") {
      setCurrentStep("approving")
      approveTokens({
        address: CONTRACT_ADDRESSES.TOKEN,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.STAKING, parseUnits(MINT_AMOUNT.toString(), 18)],
      })
    }
  }, [mintReceipt, currentStep, approveTokens])

  // Handle approve completion
  useEffect(() => {
    if (approveReceipt && currentStep === "approving") {
      setCurrentStep("staking")
      stakeTokens({
        address: CONTRACT_ADDRESSES.STAKING,
        abi: STAKING_ABI,
        functionName: "deposit",
        args: [parseUnits(MINT_AMOUNT.toString(), 18)],
      })
    }
  }, [approveReceipt, currentStep, stakeTokens])

  // Handle stake completion
  useEffect(() => {
    if (stakeReceipt && currentStep === "staking") {
      setCurrentStep("completed")
      setSuccessTx(stakeTxHash!)
    }
  }, [stakeReceipt, currentStep, stakeTxHash])

  const handleMintAndStake = () => {
    if (address && currentStep === "idle") {
      setCurrentStep("minting")
      mintTokens({
        address: CONTRACT_ADDRESSES.TOKEN,
        abi: TOKEN_ABI,
        functionName: "mint",
        args: [address, parseUnits(MINT_AMOUNT.toString(), 18)],
      })
    }
  }

  // Reset function
  const handleReset = () => {
    setCurrentStep("idle")
    setSuccessTx(null)
    resetMint()
    resetApprove()
    resetStake()
  }

  return (
    <Card>
      {successTx ? (
        <StakingSuccess successTx={successTx} onReset={handleReset} />
      ) : (
        <div className={styles.stepContent}>
          <p>{t("steps.bundle.header")}</p>
          <TokenAmount amount={MINT_AMOUNT} />
          <Button onClick={handleMintAndStake} isLoading={isPendingMintAndStake} isFull color="accent">
            {t("steps.bundle.button")}
          </Button>
        </div>
      )}
    </Card>
  )
}
