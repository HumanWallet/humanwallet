import { useTranslation } from "react-i18next"
import { useRouteError } from "react-router"
import { ErrorDisplay } from "../../components/ui"

export function Component() {
  const { t } = useTranslation("error")
  const error = useRouteError() as { status: number }

  const UNKNOWN_ERROR = {
    title: t("title"),
    subtitle: t("description"),
  }

  const ErrorMessagesByHTTPCode: { [key: number]: { title: string; subtitle: string } } = {
    404: { title: t("notFound.title"), subtitle: t("notFound.description") },
  }

  const { title, subtitle } = ErrorMessagesByHTTPCode[error.status] ?? UNKNOWN_ERROR
  const errorCode = error.status ?? t("unknownError.code")

  const handleBackHome = (): void => {
    window.location.href = "/"
  }

  return <ErrorDisplay title={title} subtitle={subtitle} errorCode={errorCode} onBackHome={handleBackHome} t={t} />
}
