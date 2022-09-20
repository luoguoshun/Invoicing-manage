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
const auth = true;
const routes = [{
    path: '/login',
    name: 'login',
    component: () => import(`@/views/login/index`),
  },
  {
    path: "*",
    name: "notfound",
    component: () => import("@/views/errors/404"),
  },
  {
    path: '/',
    name: 'index',
    component: () => import(`@/page/layout/index`),
    meta: {
      title: '',
      isAuth: true
    },
    children: [
      //首页
      {
        path: '/home',
        name: 'home',
        component: () => import(`@/views/home`),
        meta: {
          title: '首页',
          isAuth: true
        },
      },
      //系统设置
      {
        path: '/system',
        name: 'system',
        component: () => import(`@/views/system`),
        meta: {
          title: '系统设置',
          isAuth: true
        },
        children: [{
            path: 'users',
            name: 'users',
            component: () => import(`@/views/system/views/user`),
            meta: {
              title: '用户管理',
            },
          },
          {
            path: 'role',
            name: 'role',
            component: () => import(`@/views/system/views/role`),
            meta: {
              title: '角色管理',
            },
          },
          {
            path: 'dataInitialization',
            name: 'dataInitialization',
            component: () => import(`@/views/system/views/dataInitialization`),
          },
          {
            path: 'setting',
            name: 'setting',
            component: () => import(`@/views/system/views/setting`),
          },
        ]
      },
      //基础资料管理
      {
        path: '/baseInfo',
        name: 'baseInfo',
        component: () => import(`@/views/baseInfo`),
        meta: {
          title: '基础资料设置',
          isAuth: true
        },
        children: [{
            path: 'supplier',
            name: 'supplier',
            component: () => import('@/views/baseInfo/views/supplier'),
            meta: {
              title: '供应商信息',
              isAuth: true
            },
            children: [{
              path: 'supplierList',
              name: 'supplierList',
              component: () => import('@/views/baseInfo/views/supplier/views/supplierList'),
            },{
              path: 'supplierSku',
              name: 'supplierSku',
              component: () => import('@/views/baseInfo/views/supplier/views/supplierSku'),
            },
          ]
          },
          {
            path: 'goods',
            name: 'goods',
            component: () => import('@/views/baseInfo/views/goods'),
            meta:{
              title:'货品档案',
              isAuth:true
            },
            children:[{
              path:'spuList',
              name:'spuList',
              component:()=>import('@/views/baseInfo/views/goods/views/spuList'),
            },{
              path:'skuList',
              name:'skuList',
              component:()=>import('@/views/baseInfo/views/goods/views/skuList'),
            }]
          },
          {
            path: 'warehouse',
            name: 'warehouse',
            component: () => import('@/views/baseInfo/views/warehouse'),
            meta: {
              title: '仓库管理',
              isAuth: true
            },
            children: [{
              path: 'warehouseList',
              name: 'warehouseList',
              component: () => import('@/views/baseInfo/views/warehouse/views/warehouseList'),
            },{
              path: 'skuList',
              name: 'skuList',
              component: () => import('@/views/baseInfo/views/warehouse/views/skuList'),
            },
          ]
          }
        ]
      },
      {
        path: '/logs',
        name: 'logs',
        component: () => import(`@/views/logs`),
        meta: {
          title: '日志管理',
          isAuth: true
        },
      },
    ],
  },
];
const router = new VueRouter({
  mode: "history",
  routes,
});
//全局前置守卫
// 当一个导航触发时，全局前置守卫按照创建的顺序调用。守卫可以是异步解析执行，此时导航在所有守卫解析完之前一直处于挂起状态
router.beforeEach(async (to, from, next) => {
  // 路由对象的matched属性是一个数组，包含了当前路由的所有嵌套路径片段的路由记录。
  //只需要给较高一级的路由添加isAuth即可，其下的所有子路由不必添加。
  // 函数执行次数 !== 数组长度
  // return true: 循环结束, 找到了满足条件的元素
  // return false: 循环继续, 没找到循环继续, 如果所有元素全部遍历还是没找到, 最终结果为false
  const isAuth = to.matched.some(i => i.meta.isAuth == true);
  //判断目标路由是否需要验证
  if (isAuth) {
    // 否则判Token时间是否失效
    let tokenInfo = JSON.parse(localStorage.getItem('tokenInfo')) || null
    let isExpires = true;
    if (tokenInfo !== null) isExpires = new Date().getTime() > tokenInfo.expiresTime;
    if (isExpires) {
      Message.warning("凭证过期，请重新登录!");
      next({
        name: "login",
        query: {
          redirectUrl: to.fullPath
        },
      });
    } else {
      next();
    }
  }
  next();
});
export default router;