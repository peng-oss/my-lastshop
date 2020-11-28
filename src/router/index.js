import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import user from '../components/user/users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/params.vue'
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
      path:'/home',component:home,
      redirect:'/welcome',
      children:[{
        path:'/welcome',component:welcome
      },
      {
        path:'/users',component:user
      },
      {
        path:'/rights',component:Rights
      },
      {
        path:'/roles',component:Roles
      },
      {
        path:'/categories',component:Cate
      },
      {
        path:'/params',component:Params
      },
    ]
    },
    
  ]
})
/* router.beforeEach((to,from,next)=>{
   to表示想要去哪个页面 ，form表示从哪来的，next是一个方法，next（）直接放行，next（‘/login’）强制跳转到哪里 
  if(to.path==="/login") return next()
  if(to.path==="/home") {
    let tokenstr=sessionStorage.getItem('token')
    if(!tokenstr) return next("/login")
    next()
  }
   if(to.path==='/welcome'){
  return  next()
  } 
}) */

export default router
