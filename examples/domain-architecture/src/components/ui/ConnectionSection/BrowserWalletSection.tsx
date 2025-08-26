import type { TFunction } from "i18next"
import { Trans } from "react-i18next"
import {
  Heading,
  SelfCustodyIcon,
  WebIcon,
  PrivacityIcon,
  KeyAlertIcon,
  ThiefIcon,
} from "@tutellus/tutellus-components"
import { WalletAdvantages } from "../WalletAdvantages"
import styles from "./index.module.css"

interface BrowserWalletSectionProps {
  readonly t: TFunction
}

const BROWSER_ADVANTAGES = [
  { icon: <SelfCustodyIcon />, textKey: "advantage_autocustody" },
  { icon: <WebIcon />, textKey: "advantage_versatility" },
  { icon: <PrivacityIcon />, textKey: "advantage_privacy" },
] as const

const BROWSER_DISADVANTAGES = [
  { icon: <KeyAlertIcon />, textKey: "disadvantage_key_loss" },
  { icon: <ThiefIcon />, textKey: "disadvantage_cyber_attacks" },
] as const

export const BrowserWalletSection = ({ t }: BrowserWalletSectionProps) => {
  return (
    <div className={styles.connectBrowser}>
      <Heading as="h2">{t("browser_wallet")}</Heading>
      <p>
        <Trans t={t}>{t("browser_wallet_description")}</Trans>
      </p>

      <WalletAdvantages advantages={BROWSER_ADVANTAGES} disadvantages={BROWSER_DISADVANTAGES} t={t} />
    </div>
  )
}
