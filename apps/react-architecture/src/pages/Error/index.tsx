import { useTranslation } from "react-i18next"
import { useRouteError } from "react-router"
import { Button, Heading } from "@tutellus/tutellus-components"
import { HUMAN_WALLET_BRAND_LOGO_URL } from "../../js/const/logos"
import styles from "./index.module.css"

export function Component() {
  const { t } = useTranslation("error")
  const error = useRouteError() as { status: number }

  const UNKONW_ERROR = {
    title: t("title"),
    subtitle: t("description"),
  }

  const ErrorMessagesByHTTPCode: { [key: number]: { title: string; subtitle: string } } = {
    404: { title: t("notFound.title"), subtitle: t("notFound.description") },
  }
  const { title, subtitle } = ErrorMessagesByHTTPCode[error.status] ?? UNKONW_ERROR

  return (
    <div className={styles.main}>
      <img className={styles.image} src={HUMAN_WALLET_BRAND_LOGO_URL} />
      <Heading as="h1">{title}</Heading>
      <p>{subtitle}</p>
      <p className={styles.error}>Error: {error.status ?? t("unknownError.code")}</p>
      <Button onClick={() => (window.location.href = "/")}>{t("backHome")}</Button>
    </div>
  )
}
