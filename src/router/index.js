import Vue from 'vue';
import VueRouter from 'vue-router';
import store from "@/store";

import {
  Message
} from "element-ui";

Vue.use(VueRouter);

// 再次点击当前路由时判断
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};
const VueRouterReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(to) {
  return VueRouterReplace.call(this, to).catch((err) => err);
};
const router = new VueRouter({
  mode: "hash",
  routes: [],
});
// 配置静态路由
const staticRoutes = [{
    path: '/',
    name: 'login',
    component: () => import(`@/views/login/index`),
  },
  {
    path: "*",
    name: "notfound",
    component: () => import("@/views/errors/404"),
  },
]

//遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      route.component = loadView(route.component)
    }
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}
/* 路由懒加载:加载路由组件  */
function loadView(view) {
  if (view.indexOf("layout") != -1) {
    return () => import(`@/page${view}`);
  } else {
    return () => import(`@/views${view}`);
  }
}

/* 加载可以直接访问的路由 */
router.addRoutes(staticRoutes);
/* 加载后端路由 */
router.addRoutes(filterAsyncRouter(store.getters['routers/getDynamicRouters']));

//全局前置守卫
// 当一个导航触发时，全局前置守卫按照创建的顺序调用。守卫可以是异步解析执行，此时导航在所有守卫解析完之前一直处于挂起状态
router.beforeEach(async (to, from, next) => {
  const asyncRouter = store.getters['routers/getDynamicRouters'];
  // 判断路由表是否添加了动态路由
  if (router.getRoutes().length == staticRoutes.length && asyncRouter.length != 0) {
    /* 重新加载后端路由 */
    router.addRoutes(filterAsyncRouter(asyncRouter));
    next({
      path: to.fullPath
    })
  }
  // 路由对象的matched属性是一个数组，包含了当前路由的所有嵌套路径片段的路由记录。
  // 只需要给较高一级的路由添加isAuth即可，其下的所有子路由不必添加。
  // 函数执行次数 !== 数组长度
  // return true: 循环结束, 找到了满足条件的元素
  // return false: 循环继续, 没找到循环继续, 如果所有元素全部遍历还是没找到, 最终结果为false
  const isAuth = to.matched.some(i => i.meta.isAuth == true);
  //判断目标路由是否需要验证
  if (isAuth) {
    const accessToken = store.getters['token/accessToken'];
    const expiresTime = store.getters['token/expiresTime'];
    // 否则判Token时间是否失效
    if (accessToken == null && expiresTime < new Date().getTime()) {
      Message.warning("凭证过期，请重新登录!");
      next({
        name: "login",
        query: {
          redirectUrl: to.fullPath
        },
      });
    }
  }
  next();
});
export default router;