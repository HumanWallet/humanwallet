export const LANGUAGES = {
  ES: "es",
  EN: "en",
} as const

export type LanguageType = (typeof LANGUAGES)[keyof typeof LANGUAGES]
