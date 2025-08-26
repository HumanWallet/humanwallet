import type { TFunction } from "i18next"
import { Button, Heading, buttonTypes, buttonColors } from "@tutellus/tutellus-components"
import { HUMAN_WALLET_LOGO_URL } from "../../../js/const/logos"
import styles from "./index.module.css"

interface InitialSectionRightProps {
  readonly onConnectAbstracted: () => void
  readonly onLearnMore: () => void
  readonly t: TFunction
}

export const InitialSectionRight = ({ onConnectAbstracted, onLearnMore, t }: InitialSectionRightProps) => {
  return (
    <div className={styles.connectInitialRight}>
      <Heading as="h2">{t("try_humanwallet")}</Heading>
      <p className={`${styles.intro} ${styles.noMb}`}>{t("try_humanwallet_intro")}</p>

      <div className={styles.buttonsGrid}>
        <Button
          type={buttonTypes.OUTLINE}
          color={buttonColors.SURFACE_INVERSE}
          isFull
          iconLeft={<img src={HUMAN_WALLET_LOGO_URL} alt="Human Wallet" />}
          onClick={onConnectAbstracted}
        >
          {t("connect_abstracted")}
        </Button>

        <div className={styles.introHW}>
          <span>{t("account_HW")} </span>
          <Button onClick={onLearnMore} color={buttonColors.INFO} type={buttonTypes.TEXT}>
            {t("click_here")}
          </Button>
        </div>

        <div className={styles.createUser}>
          <p className={styles.mobileText}>
            <img
              className={styles.iconMobile}
              src="https://cdn.prod.website-files.com/64ff0afa9829dccb61ed96ab/679b7dfef0cb7ef9ce5b7f0a_iPhone%2015.png"
              alt="Mobile"
            />
            <span>{t("create_HW")}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
