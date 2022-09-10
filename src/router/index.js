import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 再次点击当前路由时判断
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};
const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(`@/views/login/index`),
  },
  {
    path: '/index',
    name: 'index',
    component: () => import(`@/page/layout/index`),
    children: [
      {
        path: '/homeIndex',
        name: 'homeIndex',
        component: () => import(`@/views/background/index`),
      },
      {
        path: '/clientList',
        name: 'clientList',
        component: () => import(`@/views/background/userManage/clientList`),
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
  routes,
});
export default router;
