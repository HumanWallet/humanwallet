import type { TFunction } from "i18next"
import { Select } from "@tutellus/tutellus-components"
import { LANGUAGES } from "../../../js/const"
import { ESFlagIcon, ENFlagIcon } from "../../Icons"
import styles from "./index.module.css"

const FLAG_ICONS = {
  [LANGUAGES.ES]: <ESFlagIcon />,
  [LANGUAGES.EN]: <ENFlagIcon />,
}

interface LanguageSelectorProps {
  readonly currentLanguage: string
  readonly onLanguageChange: (language: string) => void
  readonly t: TFunction
}

export const LanguageSelector = ({ currentLanguage, onLanguageChange, t }: LanguageSelectorProps) => {
  const flagIcon = FLAG_ICONS[currentLanguage as keyof typeof FLAG_ICONS]

  return (
    <div className={styles.selectLang}>
      <label htmlFor="language" className={styles.labelLang}>
        {flagIcon}
      </label>
      <div className={styles.contentSelect}>
        <Select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onLanguageChange(e.target.value)}
          id="language"
          options={Object.values(LANGUAGES).map((lang) => ({
            value: lang,
            label: t(`languages.${lang}`),
          }))}
          value={currentLanguage}
        />
      </div>
    </div>
  )
}
