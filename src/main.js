import Vue from 'vue'
import App from './App.vue'
import router from './router'
import  './assets/css/global.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import TreeTable from 'vue-table-with-tree-grid'

Vue.use(VueAxios, axios)
axios.defaults.baseURL='http://www.ysqorz.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
}
  )
  Vue.component('tree-table',TreeTable)
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
