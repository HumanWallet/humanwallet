import type { TFunction } from "i18next"
import { useState } from "react"
import {
  Button,
  DefiIcon,
  FingerprintIcon,
  LightningIcon,
  EmojiIcon,
  MultiDeviceIcon,
  CamIcon,
  UmbrellaIcon,
} from "@tutellus/tutellus-components"
import { HUMAN_WALLET_BRAND_LOGO_URL } from "../../../js/const/logos"
import { WalletAdvantages } from "../WalletAdvantages"
import { LearnMoreModal } from "../LearnMoreModal"
import styles from "./index.module.css"

interface AbstractedWalletSectionProps {
  readonly t: TFunction
}

const ABSTRACTED_ADVANTAGES = [
  { icon: <DefiIcon />, textKey: "advantage_mobile" },
  { icon: <FingerprintIcon />, textKey: "advantage_biometry" },
  { icon: <LightningIcon />, textKey: "advantage_gas" },
  { icon: <EmojiIcon />, textKey: "advantage_intuitive" },
  { icon: <MultiDeviceIcon />, textKey: "advantage_multidevice" },
] as const

const ABSTRACTED_DISADVANTAGES = [
  { icon: <CamIcon />, textKey: "disadvantage_privacy" },
  { icon: <UmbrellaIcon />, textKey: "disadvantage_light_autocustody" },
] as const

export const AbstractedWalletSection = ({ t }: AbstractedWalletSectionProps) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className={styles.connectAbstracted}>
      <img className={styles.hwLogo} src={HUMAN_WALLET_BRAND_LOGO_URL} alt="Human Wallet" />

      <WalletAdvantages advantages={ABSTRACTED_ADVANTAGES} disadvantages={ABSTRACTED_DISADVANTAGES} t={t} />

      <div className={styles.seeMore}>
        <Button type="outline" onClick={() => setShowModal(true)}>
          {t("learn_more_private_keys")}
        </Button>

        <LearnMoreModal isOpen={showModal} onClose={() => setShowModal(false)} t={t} />
      </div>
    </div>
  )
}
