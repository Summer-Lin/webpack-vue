// 多语言设置
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import axios from 'axios'
import {locale} from 'view-design';

//iview语言
import viewen from 'view-design/dist/locale/en-US';
import viewzh from 'view-design/dist/locale/zh-CN';

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'zh', // 设置语言环境
  fallbackLocale: 'zh',
  messages: {} // 设置语言环境信息, 如果这里设置,则会打包到main.js
})

const loadedLanguages = [] // 预装默认语言

function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  //设置iview 组件多语言
  if(lang === undefined || lang === "zh") {
    locale(viewzh)
  } else {
    locale(viewen)
  }

  if (!loadedLanguages.includes(lang)) {
    return import(/* webpackChunkName: "lang-[request]" */ `./${lang}/index.js`).then(msgs => {
      i18n.setLocaleMessage(lang, msgs.default)
      loadedLanguages.push(lang)
      return setI18nLanguage(lang)
    })
  }
  return Promise.resolve(setI18nLanguage(lang))
}