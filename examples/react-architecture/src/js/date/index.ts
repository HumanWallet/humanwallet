import { LANGUAGES } from "../const"

const locales = {
  [LANGUAGES.ES]: "es-ES",
  [LANGUAGES.EN]: "en-US",
}

export const fromDateToLocaleDate = (date: Date, language: keyof typeof LANGUAGES) =>
  date.toLocaleDateString(locales[language as keyof typeof locales])

export const formatRemainingTime = (targetDate: Date | string): string => {
  const now = new Date() // Use the current date and time
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate
  const difference = target.getTime() - now.getTime()

  if (difference <= 0) {
    return "0d 0h 0m"
  }

  const millisecondsInMinute = 1000 * 60
  const millisecondsInHour = millisecondsInMinute * 60
  const millisecondsInDay = millisecondsInHour * 24

  const days = Math.floor(difference / millisecondsInDay)
  const hours = Math.floor((difference % millisecondsInDay) / millisecondsInHour)
  const minutes = Math.floor((difference % millisecondsInHour) / millisecondsInMinute)

  return `${days}d ${hours}h ${minutes}m`
}
