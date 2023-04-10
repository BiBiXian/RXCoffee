import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import cookie from 'vue-cookie'
import { Toast } from 'vant';

Vue.use(VueRouter)


const router = new VueRouter({
  routes
})

export default router

router.beforeEach((to, from, next) => {
  // 1.如果访问的是登录页面（无需权限），直接放行
  if (to.path === '/login' || to.path === '/main/home' || to.path === '/main/menu' || to.path === '/main/shopbag' || to.path === '/main/my' || to.path === '/detail') return next()
  // 2.如果访问的是有登录权限的页面，先要获取token
  const tokenStr  = cookie.get("MY");
  // 2.1如果token为空，强制跳转到登录页面；否则，直接放行
  if (!tokenStr) {
    Toast({
      message: "请先登录",
      duration: 1000
    })
    
    return next('/login')
    
    
  }
  next()
})