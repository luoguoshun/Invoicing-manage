export default {
  namespaced: true,
  state: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  },
  getters: {
    getuserInfo(state) {
      if (state.userInfo == null) {
        return null;
      }
      return state.userInfo;
    },
  },
  //mutations是唯一一种方式来修改state中的状态的；
  mutations: {
    setuserInfo(state, userInfo) {
      state.userInfo = JSON.parse(JSON.stringify(userInfo));
    },
    clearuserInfo(state) {
      localStorage.removeItem('userInfo');
    },
  },
  actions: {},
};
