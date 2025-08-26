import type { TFunction } from "i18next"
import type { ReactElement } from "react"
import { Trans } from "react-i18next"
import { LikeOutlineIcon } from "@tutellus/tutellus-components"
import styles from "./index.module.css"

interface Advantage {
  readonly icon: ReactElement
  readonly textKey: string
}

interface WalletAdvantagesProps {
  readonly advantages: readonly Advantage[]
  readonly disadvantages: readonly Advantage[]
  readonly t: TFunction
  readonly title?: string
}

export const WalletAdvantages = ({ advantages, disadvantages, t, title }: WalletAdvantagesProps) => {
  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <h2 className={styles.success}>
        <span className={styles.iconSmall}>
          <LikeOutlineIcon />
        </span>
        {t("advantages")}
      </h2>

      {advantages.map((advantage, index) => (
        <div key={`advantage-${index}`} className={styles.textIcon}>
          <span className={styles.iconSmall}>{advantage.icon}</span>
          <p>
            <Trans t={t}>{t(advantage.textKey)}</Trans>
          </p>
        </div>
      ))}

      <h2 className={styles.fail}>
        <span className={styles.iconSmall}>
          <LikeOutlineIcon />
        </span>
        {t("disadvantages")}
      </h2>

      {disadvantages.map((disadvantage, index) => (
        <div key={`disadvantage-${index}`} className={styles.textIcon}>
          <span className={styles.iconSmall}>{disadvantage.icon}</span>
          <p>
            <Trans t={t}>{t(disadvantage.textKey)}</Trans>
          </p>
        </div>
      ))}
    </div>
  )
}
