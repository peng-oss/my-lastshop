import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import home from '../components/home.vue'
Vue.use(VueRouter)


const router = new VueRouter({
  routes:[
    {
      path:'/',redirect:'/login'
    }
    ,
    {
      path:'/login',component:Login
    },
    {
      path:'/home',component:home
    },
    
  ]
})
router.beforeEach((to,from,next)=>{
  /* to表示想要去哪个页面 ，form表示从哪来的，next是一个方法，next（）直接放行，next（‘/login’）强制跳转到哪里 */
  if(to.path==="/login") return next()
  if(to.path==="/home") {
    const tokenstr=sessionStorage.getItem('token')
    if(!tokenstr) return next("/login")
    next()
  }
})

export default router
