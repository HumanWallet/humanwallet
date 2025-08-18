import { useTranslation } from "react-i18next"
import { useCallback, useEffect, useMemo, useState } from "react"
import { GiftIcon, UnlockedIcon, AddFilledIcon, Button, Card } from "@tutellus/tutellus-components"
import { TransactionType } from "../../../domain/ethereum/Models/Transaction"
import { DomainEventDetail, DomainEvents } from "../../../domain/_kernel/Events"
import { Stepper, type StepItem } from "../Stepper"
import { useTransactions } from "../../../context"
import { StakingSuccess } from "./StakingSuccess"
import { MINT_AMOUNT } from "./config"
import { TokenAmount } from "../../modules/tokenAmount"
import styles from "./index.module.css"

enum StakingStep {
  MINT = "MINT",
  APPROVE = "APPROVE",
  STAKE = "STAKE",
}

export const StakingSteps = () => {
  const { t } = useTranslation("demo")
  const {
    transactions: { isPendingMint, isPendingApprove, isPendingStake },
  } = useTransactions()
  const [balance, setBalance] = useState<number>(0)
  const [allowance, setAllowance] = useState<number>(0)
  const [successTx, setSuccessTx] = useState<string | null>(null)

  const updateBalance = () => window.domain.GetTokenBalanceUseCase.execute().then(setBalance)
  const updateAllowance = () => window.domain.GetTokenAllowanceUseCase.execute().then(setAllowance)
  const handleMint = () => window.domain.MintTokenUseCase.execute()
  const handleApprove = () => window.domain.ApproveTokenAmountUseCase.execute({ amount: MINT_AMOUNT })
  const handleStake = () => window.domain.StakeTokenUseCase.execute({ amount: MINT_AMOUNT })

  useEffect(() => {
    updateBalance()
    updateAllowance()
  }, [])

  // Handle Success Transaction
  const handleSuccessTransaction = useCallback(
    (e: CustomEvent<DomainEventDetail[DomainEvents.SUCCESS_TRANSACTION]>) => {
      const { type, explorerUrl } = e.detail.transaction
      if (type === TransactionType.MINT) updateBalance()
      if (type === TransactionType.APPROVE) updateAllowance()
      if (type === TransactionType.STAKE) {
        setSuccessTx(explorerUrl!)
        updateBalance()
        updateAllowance()
      }
    },
    [],
  )

  // Events
  useEffect(() => {
    window.addEventListener(DomainEvents.SUCCESS_TRANSACTION, handleSuccessTransaction as EventListener)
    return () => window.removeEventListener(DomainEvents.SUCCESS_TRANSACTION, handleSuccessTransaction as EventListener)
  }, [handleSuccessTransaction])

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
