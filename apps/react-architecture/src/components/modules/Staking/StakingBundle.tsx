import { useTranslation } from "react-i18next"
import { useCallback, useState, useEffect } from "react"
import { Button, Card } from "@tutellus/tutellus-components"
import type { DomainEventDetail } from "../../../domain/_kernel/Events"
import { DomainEvents } from "../../../domain/_kernel/Events"
import { useTransactions } from "../../../context"
import { StakingSuccess } from "./StakingSuccess"
import { MINT_AMOUNT } from "./config"
import { TokenAmount } from "../tokenAmount"
import styles from "./index.module.css"

export const StakingBundle = () => {
  const { t } = useTranslation("demo")
  const {
    transactions: { isPendingMintAndStake },
  } = useTransactions()
  const [successTx, setSuccessTx] = useState<string | null>(null)

  const handleMintAndStake = () => window.domain.MintAndStakeTokenUseCase.execute()

  // Handle Success Transaction
  const handleSuccessTransaction = useCallback(
    (e: CustomEvent<DomainEventDetail[DomainEvents.SUCCESS_TRANSACTION]>) => {
      const { explorerUrl } = e.detail.transaction
      setSuccessTx(explorerUrl!)
    },
    [],
  )

  // Events
  useEffect(() => {
    window.addEventListener(DomainEvents.SUCCESS_TRANSACTION, handleSuccessTransaction as EventListener)
    return () => window.removeEventListener(DomainEvents.SUCCESS_TRANSACTION, handleSuccessTransaction as EventListener)
  }, [handleSuccessTransaction])

  return (
    <Card>
      {successTx ? (
        <StakingSuccess successTx={successTx} onReset={() => setSuccessTx(null)} />
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
