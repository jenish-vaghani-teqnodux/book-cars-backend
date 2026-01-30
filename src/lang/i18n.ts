import { I18n } from 'i18n-js'

const i18n = new I18n()
i18n.enableFallback = true

export async function setLanguage(lang: string) {
  try {
    const module = await import(`./${lang}`)
    i18n.translations = { [lang]: module[lang] }
    i18n.locale = lang
  } catch (err) {
    console.error('Language load error:', err)
  }
}

export default i18n
