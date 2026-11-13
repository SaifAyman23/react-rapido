import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ar from './locales/ar'
import en from './locales/en'

import { persistGet } from '@/store/persist'

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = import.meta.env.VITE_LANGUAGE === 'ar' ? 'ar' : 'en'

export const RTL_LANGUAGES: readonly Language[] = ['ar']

const LANGUAGE_KEY = 'language'

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'ar'
}

function initialLanguage(): Language {
  const stored = persistGet(LANGUAGE_KEY)
  return isLanguage(stored) ? stored : DEFAULT_LANGUAGE
}

const resources = {
  en: { translation: { ...en.common, ...en.errors, ...en.account } },
  ar: { translation: { ...ar.common, ...ar.errors, ...ar.account } },
}

/** Mirror the language onto `<html lang dir>` so logical CSS properties flip. */
export function applyDirection(language: string): void {
  if (typeof document === 'undefined') return
  const resolved: Language = isLanguage(language) ? language : DEFAULT_LANGUAGE
  document.documentElement.lang = resolved
  document.documentElement.dir = RTL_LANGUAGES.includes(resolved) ? 'rtl' : 'ltr'
}

// i18next exposes `use` only on the default instance; the rule mistakes it for
// the named export from `react`.
// eslint-disable-next-line import-x/no-named-as-default-member
void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
  react: {
    useSuspense: false,
  },
})

applyDirection(i18n.language)

export default i18n
