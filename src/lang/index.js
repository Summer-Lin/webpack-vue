import Vue from 'vue'
import VueI18n from 'vue-i18n'

import {LOCALE_KEY} from "@/utils/config.js"
import {storage} from "@/utils/global.js"

import {locale} from 'view-design';

import viewen from 'view-design/dist/locale/en-US';
import viewzh from 'view-design/dist/locale/zh-CN';



import zh from "./zh/index.js"
import en from "./en/index.js"

Vue.use(VueI18n)

const DEFAULT_LANG = 'zh'

const locales = {
  zh,
  en,
}

const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales,
})

export const setup = lang => {
    if (lang === undefined) {
      lang = storage.getItem(LOCALE_KEY)
      if (locales[lang] === undefined) {
        lang = DEFAULT_LANG
      }
    }
    storage.setItem(LOCALE_KEY, lang)
  
    Object.keys(locales).forEach(lang => {
      document.body.classList.remove(`lang-${lang}`)
    })
    document.body.classList.add(`lang-${lang}`)
    document.body.setAttribute('lang', lang)
  
    Vue.config.lang = lang
    i18n.locale = lang

    //view 多语言
    if(lang === undefined || lang === "zh") {
        locale(viewzh)
    } else {
        locale(viewen)
    }
   
  }
  
setup()
export default i18n