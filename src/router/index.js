import {createRouter, createWebHistory} from 'vue-router'
import routes from "@/router/routes";
import store from "@/base/store";
import emitter from "@/utils/mitt";


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes, base: '/'
})


router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title
  if (store.getters.isLogged) {
    // 已登录
    //判断顶部消息通知
    emitter.emit("searchMessage");
    if (['Login'].indexOf(to.name) < 0 && store.getters.tokenInfo.access_expire <= Math.ceil(new Date().getTime() / 1000)) {
      router.push({name: 'Login', query: {goto: to.path}})
    }
  } else {
    //  未登录判断
    if (!to.meta.public && 'Login' !== to.name) {
      router.push({name: 'Login', query: {goto: from.path}})
    }
  }
  next()
})

export default router
