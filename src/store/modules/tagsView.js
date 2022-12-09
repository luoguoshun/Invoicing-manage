export default {
  namespaced: true,
  state: {
    dynamicTag: {
      tabs:[],
      activeRoute: 'home',
    },
  },
  getters: {
    getDynamicTags(state) {
      return state.dynamicTag;
    },
  },
  mutations: {
    createTab(state, tab) {
      switch (tab.routeName) {
        case 'others':
          tab.routeName = 'goodsTypeList';
          break;
        case 'goods':
          tab.routeName = 'spuList';
          break;
        case 'supplier':
          tab.routeName = 'supplierList';
          break;
        case 'warehouseInfo':
          tab.routeName = 'warehouseList';
          break;
        case 'purchasePlan':
          tab.routeName = 'purchasePlanList';
          break;
        case 'purchaseOrder':
          tab.routeName = 'purchaseOrderList';
          break;
        case 'putInWarehouse':
          tab.routeName = 'purchaseReceipt';
          break;
        case 'putOutWarehouse':
          tab.routeName = 'ExwarehouseReceipt';
          break;
        case 'salesOrder':
          tab.routeName = 'salesOrderList';
          break;
        case 'salesReturn':
          tab.routeName = 'salesReturnList';
          break;
        default:
          break;
      }
      state.dynamicTag.activeRoute = tab.routeName; //保存当前激活的路由
      //标签组不存在当前点击的菜单则添加到标签组
      if (JSON.stringify(state.dynamicTag.tabs).indexOf(JSON.stringify(tab)) == -1) {
        if (state.dynamicTag.tabs.length >= 10) {
          state.dynamicTag.tabs.shift();
        }
        state.dynamicTag.tabs.push(tab);
      }
    },
    removeTab(state, routeName) {
      var tabs = state.dynamicTag.tabs;
      tabs.forEach((element, index) => {
        if (element.routeName == routeName) {
          tabs.splice(index, 1);
          //如果为数组第一个元素 则直接激活首页路由
          if (index == 0&&tabs.length==0) {
            state.dynamicTag.activeRoute = 'home';
          } else if (element.routeName == state.dynamicTag.activeRoute) {
            //判断删掉的标签是否为当前打开的路由 如果是 则激活上一个tab路由
            state.dynamicTag.activeRoute = tabs[index - 1].routeName;
          }
          return true;
        }
      });
    },
    closeAllTags(state) {
      state.dynamicTag.tabs = [];
    },
  },
  actions: {},
};