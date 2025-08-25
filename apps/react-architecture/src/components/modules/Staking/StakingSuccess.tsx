import { useTranslation } from "react-i18next"
import styles from "./index.module.css"
import { Button, CheckFilledIcon } from "@tutellus/tutellus-components"

interface StakingSuccessProps {
  successTx: string
  onReset: () => void
}

export const StakingSuccess = ({ successTx, onReset }: StakingSuccessProps) => {
  const { t } = useTranslation("demo")

  return (
    <div className={styles.successContainer}>
      <div className={styles.successText}>
        <div className={styles.successIcon}>
          <CheckFilledIcon />
        </div>
        <p className={styles.successText}>{t("success.message")}</p>
      </div>
      <a href={successTx} target="_blank" rel="noreferrer" className={styles.explorerLink}>
        <Button isFull type="outline">
          {t("success.viewExplorer")}
        </Button>
      </a>
      <Button isFull onClick={onReset}>
        {t("success.startOver")}
      </Button>
    </div>
  )
}
