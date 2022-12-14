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
    path: '/',
    name: 'login',
    component: () => import(`@/views/login/index`),
  },
  {
    path: "*",
    name: "notfound",
    component: () => import("@/views/errors/404"),
  },
  {
    path: '/index',
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
            path: 'department',
            name: 'department',
            component: () => import(`@/views/system/views/department`),
            meta: {
              title: '部门管理',
            },
          },
          {
            path: 'dataInitialization',
            name: 'dataInitialization',
            component: () => import(`@/views/system/views/dataInitialization`),
            meta: {
              title: '数据初始化',
            },
          },
          {
            path: 'setting',
            name: 'setting',
            component: () => import(`@/views/system/views/setting`),
            meta: {
              title: '系统设置',
            },
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
              meta: {
                title: '供应商列表',
              },
            }, {
              path: 'supplierSku',
              name: 'supplierSku',
              component: () => import('@/views/baseInfo/views/supplier/views/supplierSku'),
              meta: {
                title: '供应商物品',
              },
            }, ]
          },
          {
            path: 'goods',
            name: 'goods',
            component: () => import('@/views/baseInfo/views/goods'),
            meta: {
              title: '货品档案',
              isAuth: true
            },
            children: [{
              path: 'spuList',
              name: 'spuList',
              component: () => import('@/views/baseInfo/views/goods/views/spuList'),
              meta: {
                title: '标准化产品单元',
                isAuth: true
              },
            }, {
              path: 'skuList',
              name: 'skuList',
              component: () => import('@/views/baseInfo/views/goods/views/skuList'),
              meta: {
                title: '库存进出计量单位',
                isAuth: true
              },
            }]
          },
          {
            path: 'warehouseInfo',
            name: 'warehouseInfo',
            component: () => import('@/views/baseInfo/views/warehouseInfo'),
            meta: {
              title: '仓库管理',
              isAuth: true
            },
            children: [{
              path: 'warehouseList',
              name: 'warehouseList',
              component: () => import('@/views/baseInfo/views/warehouseInfo/views/warehouseList'),
              meta: {
                title: '仓库列表',
                isAuth: true
              },
            }, {
              path: 'warehouseSkuList',
              name: 'warehouseSkuList',
              component: () => import('@/views/baseInfo/views/warehouseInfo/views/warehouseSkuList'),
              meta: {
                title: '仓库物资',
                isAuth: true
              },
            }, ]
          },
          {
            path: 'others',
            name: 'others',
            component: () => import('@/views/baseInfo/views/others'),
            meta: {
              title: '其他信息',
              isAuth: true
            },
            children: [{
              path: 'goodsTypeList',
              name: 'goodsTypeList',
              component: () => import('@/views/baseInfo/views/others/views/goodsTypeList'),
              meta: {
                title: '物品类型设置',
                isAuth: true
              },
            }]
          }
        ]
      },
      //采购管理
      {
        path: '/purchase',
        name: 'purchase',
        component: () => import(`@/views/purchase`),
        meta: {
          title: '采购管理',
          isAuth: true
        },
        children: [{
          path: 'purchaseOrder',
          name: 'purchaseOrder',
          component: () => import('@/views/purchase/views/purchaseOrder'),
          meta: {
            title: '采购订单管理',
            isAuth: true
          },
          children: [{
              path: 'purchaseOrderList',
              name: 'purchaseOrderList',
              component: () => import('@/views/purchase/views/purchaseOrder/views/purchaseOrderList'),
              meta: {
                title: '采购订单列表',
                isAuth: true
              },
            },
            {
              path: 'applyForBilling',
              name: 'applyForBilling',
              component: () => import('@/views/purchase/views/purchaseOrder/views/applyForBilling'),
              meta: {
                title: '申请采购开单',
                isAuth: true
              },
            }
          ]
        }, {
          path: 'purchasePlan',
          name: 'purchasePlan',
          component: () => import('@/views/purchase/views/purchasePlan'),
          meta: {
            title: '采购计划管理',
            isAuth: true
          },
          children: [{
              path: 'applicationPlan',
              name: 'applicationPlan',
              component: () => import('@/views/purchase/views/purchasePlan/views/applicationPlan'),
              meta: {
                title: '采购计划申请',
                isAuth: true
              },
            },
            {
              path: 'purchasePlanList',
              name: 'purchasePlanList',
              component: () => import('@/views/purchase/views/purchasePlan/views/purchasePlanList'),
              meta: {
                title: '采购计划列表',
                isAuth: true
              },
            }
          ]
        }]
      },
      //仓库管理
      {
        path: '/warehouse',
        name: 'warehouse',
        component: () => import(`@/views/warehouse`),
        meta: {
          title: '仓库管理',
          isAuth: true
        },
        children: [{
            path: 'putInWarehouse',
            name: 'putInWarehouse',
            component: () => import(`@/views/warehouse/views/putInWarehouse`),
            meta: {
              title: '入库管理',
              isAuth: true
            },
            children: [{
              path: 'purchaseReceipt',
              name: 'purchaseReceipt',
              component: () => import('@/views/warehouse/views/putInWarehouse/views/purchaseReceipt'),
              meta: {
                title: '采购入库开单',
                isAuth: true
              },
            }, {
              path: 'returnReceipt',
              name: 'returnReceipt',
              component: () => import('@/views/warehouse/views/putInWarehouse/views/returnReceipt'),
              meta: {
                title: '退货入库开单',
                isAuth: true
              },
            }, {
              path: 'receiptDoc',
              name: 'receiptDoc',
              component: () => import('@/views/warehouse/views/putInWarehouse/views/receiptDoc'),
              meta: {
                title: '入库单管理',
                isAuth: true
              },
            }],
          },
          {
            path: 'putOutWarehouse',
            name: 'putOutWarehouse',
            component: () => import(`@/views/warehouse/views/putOutWarehouse`),
            meta: {
              title: '出库管理',
              isAuth: true
            },
            children: [{
                path: 'ExwarehouseDoc',
                name: 'ExwarehouseDoc',
                component: () => import('@/views/warehouse/views/putOutWarehouse/views/ExwarehouseDoc'),
                meta: {
                  title: '出库单管理',
                  isAuth: true
                },
              },
              {
                path: 'ExwarehouseReceipt',
                name: 'ExwarehouseReceipt',
                component: () => import('@/views/warehouse/views/putOutWarehouse/views/ExwarehouseReceipt'),
                meta: {
                  title: '出库开单',
                  isAuth: true
                },
              },
              //{
              //   path: 'ReceiptDoc',
              //   name: 'ReceiptDoc',
              //   component: () => import('@/views/warehouse/views/putInWarehouse/views/ReceiptDoc'),
              // }
            ],
          }, {
            path: 'ItemManage',
            name: 'ItemManage',
            component: () => import(`@/views/warehouse/views/ItemManage`),
            meta: {
              title: '物资管理',
              isAuth: true
            },
          }

        ]
      },
      //销售管理
      {
        path: '/sales',
        name: 'sales',
        component: () => import(`@/views/sales`),
        meta: {
          title: '销售管理',
          isAuth: true
        },
        children: [{
            path: 'salesOrder',
            name: 'salesOrder',
            component: () => import('@/views/sales/views/salesOrder'),
            meta: {
              title: '销售订单管理',
              isAuth: true
            },
            children: [{
                path: 'salesOrderList',
                name: 'salesOrderList',
                component: () => import('@/views/sales/views/salesOrder/views/salesOrderList'),
                meta: {
                  title: '销售订单列表',
                  isAuth: true
                },
              },
              {
                path: 'salesInvoicing',
                name: 'salesInvoicing',
                component: () => import('@/views/sales/views/salesOrder/views/salesInvoicing'),
                meta: {
                  title: '申请销售开单',
                  isAuth: true
                },
              }
            ]
          },
          {
            path: 'salesReturn',
            name: 'salesReturn',
            component: () => import('@/views/sales/views/salesReturn'),
            meta: {
              title: '销售退货管理',
              isAuth: true
            },
            children: [{
                path: 'salesReturnList',
                name: 'salesReturnList',
                component: () => import('@/views/sales/views/salesReturn/views/salesReturnList'),
                meta: {
                  title: '销售退货单管理',
                  isAuth: true
                },
              },
              {
                path: 'returnDocApplication',
                name: 'returnDocApplication',
                component: () => import('@/views/sales/views/salesReturn/views/returnDocApplication'),
                meta: {
                  title: '销售退货开单',
                  isAuth: true
                },
              }
            ]
          }
        ]
      },
      //财务管理
      {
        path: '/financial',
        name: 'financial',
        component: () => import(`@/views/financial`),
        meta: {
          title: '财务管理',
          isAuth: true
        },
        children: [{
          path: 'accountsPayable',
          name: 'accountsPayable',
          component: () => import('@/views/financial/views/accountsPayable'),
          meta: {
            title: '应付账',
            isAuth: true
          },
        }, {
          path: 'accountReceivable',
          name: 'accountReceivable',
          component: () => import('@/views/financial/views/accountReceivable'),
          meta: {
            title: '应收账',
            isAuth: true
          },
        }, ],
      },
      //日志管理
      {
        path: '/logs',
        name: 'logs',
        component: () => import(`@/views/logs`),
        meta: {
          title: '日志管理',
          isAuth: true
        },
        children: [{
          path: 'operateLog',
          name: 'operateLog',
          component: () => import('@/views/logs/views/operateLog'),
          meta: {
            title: '操作日志',
            isAuth: true
          },
        }, {
          path: 'systemLog',
          name: 'systemLog',
          component: () => import('@/views/logs/views/systemLog'),
          meta: {
            title: '系统日志',
            isAuth: true
          },
        }, ],
      },
      //消息管理
      {
        path: '/message',
        name: 'message',
        component: () => import(`@/views/message`),
        meta: {
          title: '消息管理',
          isAuth: true
        },
        children: [{
          path: 'notice',
          name: 'notice',
          component: () => import('@/views/message/views/notice'),
          meta: {
            title: '通知管理',
            isAuth: true
          },
        }],
      },
    ],
  },
];
const router = new VueRouter({
  mode: "hash",
  routes,
});
//全局前置守卫
// 当一个导航触发时，全局前置守卫按照创建的顺序调用。守卫可以是异步解析执行，此时导航在所有守卫解析完之前一直处于挂起状态
router.beforeEach(async (to, from, next) => {

  // 路由对象的matched属性是一个数组，包含了当前路由的所有嵌套路径片段的路由记录。
  // 只需要给较高一级的路由添加isAuth即可，其下的所有子路由不必添加。
  // 函数执行次数 !== 数组长度
  // return true: 循环结束, 找到了满足条件的元素
  // return false: 循环继续, 没找到循环继续, 如果所有元素全部遍历还是没找到, 最终结果为false
  const isAuth = to.matched.some(i => i.meta.isAuth == true);
  //判断目标路由是否需要验证
  if (isAuth) {
    // 否则判Token时间是否失效
    const accessToken = store.getters['token/accessToken'];
    const expiresTime = store.getters['token/expiresTime'];
    let isExpires = new Date().getTime() > expiresTime;
    // if (accessToken !== null) isExpires = new Date().getTime() > expiresTime;
    if (accessToken !== null && isExpires) {
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