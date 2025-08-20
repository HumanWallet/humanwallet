import { useTranslation } from "react-i18next"
import { MoonIcon, SunIcon, Modal, Select } from "@tutellus/tutellus-components"
import { ESFlagIcon, ENFlagIcon } from "../../Icons"
import styles from "./index.module.css"
import { LANGUAGES } from "../../../js/const"
import { useLayout, ThemeMode } from "../../../context"

const FLAG_ICONS = {
  [LANGUAGES.ES]: <ESFlagIcon />,
  [LANGUAGES.EN]: <ENFlagIcon />,
}

interface SettingsModalProps {
  onClose: () => void
}

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const { i18n, t } = useTranslation("settings")
  const { themeMode, setThemeMode } = useLayout()

  const flagIcon = FLAG_ICONS[i18n.language as keyof typeof FLAG_ICONS]

  return (
    <Modal onClose={onClose} title={t("title")}>
      <div className={styles.container}>
        <div className={styles.flexCenter}>
          <label htmlFor="language" className={styles.label}>
            {flagIcon}
          </label>
          <Select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            id="language"
            options={Object.values(LANGUAGES).map((lang) => ({
              value: lang,
              label: t(`languages.${lang}`),
            }))}
            value={i18n.language}
          />
        </div>
        <div className={styles.flexCenter}>
          <label htmlFor="mode" className={styles.label}>
            {themeMode === ThemeMode.LIGHT ? <SunIcon /> : <MoonIcon />}
          </label>
          <Select
            onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
            id="mode"
            options={Object.values(ThemeMode).map((mode) => ({
              value: mode,
              label: t(`mode.${mode}`),
            }))}
            value={themeMode}
          />
        </div>
      </div>
    </Modal>
  )
}
