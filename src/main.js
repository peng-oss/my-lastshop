import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueAxios, axios)
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.component('tree-table', TreeTable)
Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal)
  let year = dt.getFullYear()
  let mon = dt.getMonth() + 1 + ''
  let day = dt.getDate() + ''
  let hour = dt.getHours() + ''
  let min = dt.getMinutes() + ''
  let sec = dt.getSeconds() + ''
  return `${year}-${mon.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`
})
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
Vue.use(ElementUI)
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
