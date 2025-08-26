import { useState, useEffect } from "react"
import type { TFunction } from "i18next"
import cx from "classnames"
import { Button, Heading, ArrowLeftIcon } from "@tutellus/tutellus-components"
import styles from "./index.module.css"

interface ConnectionFormProps {
  readonly onReturnToHome: () => void
  readonly onRegister: (username: string) => void
  readonly isDisabled: boolean
  readonly t: TFunction
}

export const ConnectionForm = ({ onReturnToHome, onRegister, isDisabled, t }: ConnectionFormProps) => {
  const [username, setUsername] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (username.length > 0 && username.length < 3) {
      const timer = setTimeout(() => {
        setShowMessage(true)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setShowMessage(false)
    }
  }, [username])

  const handleSubmit = () => {
    if (username.length >= 3 && acceptedTerms) {
      onRegister(username)
    }
  }

  const isFormDisabled = username.length < 3 || !acceptedTerms || isDisabled

  return (
    <div className={styles.connectAbstracted}>
      <div className={styles.connectHeader}>
        <span className={styles.return} onClick={onReturnToHome}>
          <ArrowLeftIcon />
          {t("return_home")}
        </span>
      </div>

      <div className={styles.buttonsFlex}>
        <Heading as="h2">{t("register")}</Heading>
        <p className={styles.intro}>{t("registerText")}</p>

        <input
          type="text"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t("userName")}
        />

        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="terms"
            className={styles.checkbox}
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <label className={styles.labelTerms} htmlFor="terms">
            {t("disclaimer")}
          </label>
        </div>

        <p className={cx(styles.message, { [styles.show]: showMessage })}>{t("usernameWarning")}</p>

        <Button onClick={handleSubmit} isDisabled={isFormDisabled}>
          {t("register")}
        </Button>
      </div>
    </div>
  )
}
