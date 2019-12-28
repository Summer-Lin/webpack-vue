import Vue from 'vue';
import App from './App.vue'
import router from "./router/index"
import "./style/reset.css"
import "./font/iconfont.css"
import i18n from './lang/index.js'
import {setup} from "@/lang/index.js"
import {LOCALE_KEY} from "@/utils/config.js"
import {storage} from "@/utils/global.js"

//iview组件样式
import 'view-design/dist/styles/iview.css';
import ViewUI, {locale} from 'view-design';
import vieeEn from 'view-design/dist/locale/en-US';
import viewZh from 'view-design/dist/locale/zh-CN';
Vue.use(ViewUI, {locale: [vieeEn,viewZh ]});


let lang = storage.getItem(LOCALE_KEY)
setup(lang)



// router.beforeEach((to, from, next) => {
  
// })

new Vue({
  el: '#app',
  router,
  i18n,
  render: h => h(App),
});