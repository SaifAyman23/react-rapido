import { create } from 'zustand'

import { persistGet, persistSet } from '../persist'

import i18n, { applyDirection, DEFAULT_LANGUAGE, isLanguage, type Language } from '@/i18n'

export type LanguageChoice = Language

const LANGUAGE_KEY = 'language'

interface PreferencesState {
  language: LanguageChoice
  setLanguage: (language: LanguageChoice) => void
  hydrate: () => void
}

export const usePreferencesStore = create<PreferencesState>()((set) => ({
  language: i18n.language === 'ar' ? 'ar' : DEFAULT_LANGUAGE,
  setLanguage: (language) => {
    set({ language })
    void i18n.changeLanguage(language)
    applyDirection(language)
    persistSet(LANGUAGE_KEY, language)
  },
  hydrate: () => {
    const value = persistGet(LANGUAGE_KEY)
    if (!isLanguage(value)) return
    set({ language: value })
    void i18n.changeLanguage(value)
    applyDirection(value)
  },
}))
