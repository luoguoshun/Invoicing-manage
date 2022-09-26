export default {
  namespaced: true,
  state: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  },
  getters: {
    getUserInfo(state) {
      if (state.userInfo == null) {
        return null;
      }
      return state.userInfo;
    },
  },
  //mutations是唯一一种方式来修改state中的状态的；
  mutations: {
    setUserInfo(state, userInfo) {
      localStorage.setItem("userInfo",JSON.stringify(userInfo))
    },
    clearUserInfo(state) {
      localStorage.removeItem('userInfo');
    },
  },
  actions: {},
};
