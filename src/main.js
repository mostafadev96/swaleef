import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import VueMaterial from 'vue-material'
import Default from "./components/Layouts/Default.vue";
import Auth from "./components/Layouts/Auth.vue";
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import "./assets/my_style.scss";
import "./assets/my_style_ar.scss";
import Axios from 'axios'
// import VueAxios from 'vue-axios'
import VueProgressBar from 'vue-progressbar'
import VueSession from 'vue-session'
import VueI18n from 'vue-i18n';
import Chat from 'vue-beautiful-chat';
import { ENGLISH_TRANSLATIONS } from './translations/en';
import { ARABIC_TRANSLATIONS } from './translations/ar';
import { DateFormatter } from './Filters/DateFormatter';
import { TrimString } from './Filters/TrimString';
import FileRender from './Filters/FileRender';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import store from './store'
const options = {
  color: '#0092D1',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}
Vue.use(VueSession,{
  persist: true
})
Vue.use(VueI18n);
const TRANSLATIONS = {
  en: ENGLISH_TRANSLATIONS,
  ar: ARABIC_TRANSLATIONS
}
const lang = localStorage.getItem('lang') || "en"
console.log(lang)
const i18n = new VueI18n({
  locale: lang,
  messages: TRANSLATIONS,
})

Vue.use(VueMaterial)
Vue.use(Loading);
Vue.use(Chat);
// Vue.use(VueAxios, Axios)
Vue.use(VueProgressBar, options)
Vue.filter('dateFormatter', DateFormatter);
Vue.filter('trimString', TrimString);
Vue.filter('render', FileRender);
Vue.prototype.$loader_options = {
  // Optional parameters
  canCancel: false,
  loader:"spinner"
};
Vue.prototype.$loader=Vue.$loading

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
Vue.component("default-layout", Default);
Vue.component("auth-layout", Auth);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
i18n.locale = lang