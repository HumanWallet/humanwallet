import type { TFunction } from "i18next"
import { Button, Heading } from "@tutellus/tutellus-components"
import { HUMAN_WALLET_BRAND_LOGO_URL } from "../../../js/const/logos"
import styles from "./index.module.css"

interface ErrorDisplayProps {
  readonly title: string
  readonly subtitle: string
  readonly errorCode?: string | number
  readonly onBackHome: () => void
  readonly t: TFunction
}

export const ErrorDisplay = ({ title, subtitle, errorCode, onBackHome, t }: ErrorDisplayProps) => {
  return (
    <div className={styles.main}>
      <img className={styles.image} src={HUMAN_WALLET_BRAND_LOGO_URL} alt="logo" />
      <Heading as="h1">{title}</Heading>
      <p>{subtitle}</p>
      {errorCode && <p className={styles.error}>Error: {errorCode}</p>}
      <Button onClick={onBackHome}>{t("backHome")}</Button>
    </div>
  )
}
