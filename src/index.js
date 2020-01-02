import Vue from 'vue';
import App from './App.vue'
import router from "./router/index"
import "./style/reset.css"
import "./font/iconfont.css"


import {i18n, loadLanguageAsync } from "./lang/index";
import {LOCALE_KEY} from "@/utils/config.js"
import {storage} from "@/utils/global.js"

//iview组件样式, 已经在 index.html引入,这里可以不引入
// import 'view-design/dist/styles/iview.css';
import ViewUI from 'view-design';

Vue.use(ViewUI);


router.beforeEach((to, from, next) => {
  let tempLang = storage.getItem(LOCALE_KEY)
  let lang = tempLang === null ? "zh" : tempLang
  loadLanguageAsync(lang).then(() => next())
})

new Vue({
  el: '#app',
  router,
  i18n,
  render: h => h(App),
});