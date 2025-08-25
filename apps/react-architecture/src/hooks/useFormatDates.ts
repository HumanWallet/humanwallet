import { useTranslation } from "react-i18next"
import { useCallback } from "react"

const TIME_UNITS = [
  { value: 31536000, singular: "year", plural: "years" },
  { value: 2592000, singular: "month", plural: "months" },
  { value: 604800, singular: "week", plural: "weeks" },
  { value: 86400, singular: "day", plural: "days" },
  { value: 3600, singular: "hour", plural: "hours" },
  { value: 60, singular: "minute", plural: "minutes" },
  { value: 1, singular: "second", plural: "seconds" },
]

type FormatOptions = {
  includeTime?: boolean
  separator?: string
  includeTimezone?: boolean
}

export const useFormatDates = () => {
  const { i18n, t } = useTranslation()

  const formatDate = useCallback(
    (date: Date, options: FormatOptions = {}): string => {
      const { includeTime = false, includeTimezone = false, separator = " - " } = options

      const locale = i18n.language
      const dateTimeOptions: Intl.DateTimeFormatOptions = {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        ...(includeTime && {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timeZone: "CET",
        timeZoneName: includeTimezone ? "short" : undefined,
      }

      if (includeTime) {
        return date.toLocaleTimeString(locale, dateTimeOptions).replace(",", separator)
      }

      return date.toLocaleDateString(locale, dateTimeOptions).replace(",", "")
    },
    [i18n.language],
  )

  const formatRemainingTime = useCallback(
    (seconds: number): string => {
      const parts: string[] = []
      let remainingSeconds = seconds

      if (remainingSeconds === 0) return `${remainingSeconds} ${t(`common:timeUnits.days`)}`

      for (const { value, singular, plural } of TIME_UNITS) {
        if (remainingSeconds >= value) {
          const count = Math.floor(remainingSeconds / value)

          parts.push(`${count} ${t(`common:timeUnits.${count <= 1 ? singular : plural}`)}`)
          remainingSeconds %= value

          // Limit to two most significant units
          if (parts.length === 2) break
        }
      }

      return parts.join(" ")
    },
    [t],
  )

  const formatRemainingDays = useCallback(
    (seconds: number): string => {
      const SECONDS_IN_A_DAY = 86400 // 24 * 60 * 60
      const days = Math.floor(seconds / SECONDS_IN_A_DAY)
      return `${days} ${t(`common:timeUnits.${days === 1 ? "day" : "days"}`, { count: days })}`
    },
    [t],
  )

  const formatShortDate = useCallback(
    (date: Date): string => {
      const day = date.getDate()
      const month = new Intl.DateTimeFormat(i18n.language, { month: "short" }).format(date)

      return `${day} ${month}`
    },
    [i18n.language],
  )

  return {
    formatDate,
    formatRemainingTime,
    formatRemainingDays,
    formatDateFromNow: useCallback(
      (targetDate: Date): string => formatRemainingTime(Math.max(0, (targetDate.getTime() - Date.now()) / 1000)),
      [formatRemainingTime],
    ),
    formatShortDate,
  }
}
