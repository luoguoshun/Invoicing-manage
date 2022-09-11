import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 再次点击当前路由时判断
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};
const routes = [{
    path: '/',
    name: 'login',
    component: () => import(`@/views/login/index`),
  },
  {
    path: '/index',
    name: 'index',
    component: () => import(`@/page/layout/index`),
    children: [
      //首页
      {
        path: '/home',
        name: 'home',
        component: () => import(`@/views/home`),
        children: []
      },
      //系统设置
      {
        path: '/system',
        name: 'system',
        component: () => import(`@/views/system`),
        children: [{
            path: '/users',
            name: 'users',
            component: () => import(`@/views/system/views/user`),
          },
          {
            path: '/role',
            name: 'role',
            component: () => import(`@/views/system/views/role`),
          },
          {
            path: '/dataInitialization',
            name: 'dataInitialization',
            component: () => import(`@/views/system/views/dataInitialization`),
          },
          {
            path: '/setting',
            name: 'setting',
            component: () => import(`@/views/system/views/setting`),
          },
        ]
      },
      {
        path: '/bookList',
        name: 'bookList',
        component: () => import(`@/views/background/bookManage/bookList`),
      },
      {
        path: '/nLogList',
        name: 'nLogList',
        component: () => import(`@/views/background/systemManage/nLogList`),
      },
    ],
  },
];
const router = new VueRouter({
  mode: "history",
  routes,
});
export default router;