export default {
  namespaced: true,
  state: {
    dynamicTag: {
      tabs: [],
      activeRoute: '',
    },
  },
  getters: {
    getDynamicTags(state) {
      return state.dynamicTag;
    },
  },
  mutations: {
    createTab(state, tab) {
      state.dynamicTag.activeRoute = tab.routeName; //保存当前激活的路由
      if (JSON.stringify(state.dynamicTag.tabs).indexOf(JSON.stringify(tab)) == -1) {
        state.dynamicTag.tabs.push(tab);
      }
    },
    removeTab(state, routeName) {
      var tabs = state.dynamicTag.tabs;
      tabs.forEach((element, index) => {
        if (element.routeName == routeName) {
          tabs.splice(index, 1); 
          //如果为数组最后一个元素 则直接激活首页路由
          if (tabs.length === 0) {
            state.dynamicTag.activeRoute = 'homeIndex';
          } else {
            //判断删掉的标签是否为当前打开的路由 如果是 则激活上一个tab路由
            if (element.routeName === state.dynamicTag.activeRoute) {
              state.dynamicTag.activeRoute = tabs[index - 1].routeName;
            }
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
