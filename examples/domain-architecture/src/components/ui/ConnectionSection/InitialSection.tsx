import type { TFunction } from "i18next"
import { Heading, CheckFilledIcon } from "@tutellus/tutellus-components"
import { HUMAN_WALLET_BRAND_LOGO_URL } from "../../../js/const/logos"
import styles from "./index.module.css"

interface InitialSectionProps {
  readonly onConnectAbstracted: () => void
  readonly onLearnMore: () => void
  readonly t: TFunction
}

export const InitialSection = ({ t }: Omit<InitialSectionProps, "onConnectAbstracted" | "onLearnMore">) => {
  return (
    <div className={styles.connectInitial}>
      <img className={styles.logo} src={HUMAN_WALLET_BRAND_LOGO_URL} alt="logo" />
      <Heading as="h1">{t("dex_subtitle")}</Heading>

      <div className={styles.rewards}>
        <div className={styles.checkIcon}>
          <CheckFilledIcon />
        </div>
        <span>{t("dex_points.point_1")}</span>
      </div>

      <div className={styles.rewards}>
        <div className={styles.checkIcon}>
          <CheckFilledIcon />
        </div>
        <span>{t("dex_points.point_2")}</span>
      </div>

      <div className={styles.rewards}>
        <div className={styles.checkIcon}>
          <CheckFilledIcon />
        </div>
        <span>{t("dex_points.point_3")}</span>
      </div>
    </div>
  )
}
