import type { TFunction } from "i18next"
import { Modal, Heading } from "@tutellus/tutellus-components"
import styles from "./index.module.css"

interface LearnMoreModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly t: TFunction
}

export const LearnMoreModal = ({ isOpen, onClose, t }: LearnMoreModalProps) => {
  if (!isOpen) return null

  return (
    <Modal title={t("passkeys_modal_title")} onClose={onClose}>
      <div className={styles.modalContent}>
        <Heading as="h3">{t("passkeys_seed_heading")}</Heading>
        <p>{t("passkeys_seed_text")}</p>

        <Heading as="h3">{t("passkeys_key_heading")}</Heading>
        <p>{t("passkeys_key_text")}</p>

        <Heading as="h3">{t("passkeys_providers_heading")}</Heading>
        <p>{t("passkeys_providers_text")}</p>

        <p>
          <a href="https://bitwarden.com/" target="_blank" rel="noreferrer">
            Bitwarden
          </a>
          : {t("passkeys_providers_bitwarden")}
        </p>

        <p>
          <a href="https://proton.me/pass" target="_blank" rel="noreferrer">
            ProtonPass
          </a>
          : {t("passkeys_providers_protonpass")}
        </p>
      </div>
    </Modal>
  )
}
