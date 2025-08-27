import { Link } from "react-router"
import { useTranslation } from "react-i18next"
import { Container, XIcon } from "@tutellus/tutellus-components"
import { LEGAL_DISCLAIMER_URL, X_URL } from "../../../js/const/urls"
import styles from "./index.module.css"

export const Footer = () => {
  const { t } = useTranslation("footer")

  return (
    <Container>
      <div className={styles.footer}>
        <div className={styles.socialMediaIcons}>
          <Link className={styles.link} title="Twitter" to={X_URL} target="_blank" rel="noreferrer">
            <XIcon />
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link className={styles.linkText} to={LEGAL_DISCLAIMER_URL} target="_blank" rel="noreferrer">
            {t("legalDisclaimer")}
          </Link>
        </nav>
        <p className={styles.powered}>Human Wallet 2025</p>
      </div>
    </Container>
  )
}
