// import Vue from 'vue'
// import VueI18n from 'vue-i18n'

// import {LOCALE_KEY} from "@/utils/config.js"
// import {storage} from "@/utils/global.js"

// import {locale} from 'view-design';

// import viewen from 'view-design/dist/locale/en-US';
// import viewzh from 'view-design/dist/locale/zh-CN';



// import zh from "./zh/index.js"

// Vue.use(VueI18n)

// const DEFAULT_LANG = 'zh'

// const locales = {
//   zh
// }

// const i18n = new VueI18n({
//   locale: DEFAULT_LANG,
//   // messages: locales,
// })

// export const setup = async lang => {
//     if (lang === undefined) {
//       lang = storage.getItem(LOCALE_KEY)
//       if (locales[lang] === undefined) {
//         lang = DEFAULT_LANG
//       }
//     }
//     storage.setItem(LOCALE_KEY, lang)
  
//     // Object.keys(locales).forEach(lang => {
//     //   document.body.classList.remove(`lang-${lang}`)
//     // })
//     // document.body.classList.add(`lang-${lang}`)
//     // document.body.setAttribute('lang', lang)
//     document.querySelector('html').setAttribute('lang', lang)
    
//     i18n.locale = lang

//     //view 多语言
//     if(lang === undefined || lang === "zh") {
//         locale(viewzh)
//     } else {
//         locale(viewen)
//     }

//     const res = await import(/* webpackChunkName: "lang-[request]" */`./${lang}/index.js`)
//     i18n.setLocaleMessage(lang, res.default)
   
//   }
// let lang = storage.getItem(LOCALE_KEY)
// setup()











// export default i18n



import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en/index.js'
import axios from 'axios'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en', // 设置语言环境
  fallbackLocale: 'en',
  messages: {
    en
  } // 设置语言环境信息
})

const loadedLanguages = ['en'] // 我们的预装默认语言

function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}`).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default)
        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      })
    }
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}