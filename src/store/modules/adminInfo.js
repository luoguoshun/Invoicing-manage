export default {
  namespaced: true,
  state: {
    adminInfo: JSON.parse(localStorage.getItem('adminInfo')) || null,
  },
  getters: {
    getAdminInfo(state) {
      if (state.adminInfo == null) {
        return null;
      }
      return state.adminInfo;
    },
  },
  mutations: {
    setAdminInfo(state, adminInfo) {
      state.adminInfo = JSON.parse(JSON.stringify(adminInfo));
    },
    clearAdminInfo(state) {
      localStorage.removeItem('adminInfo');
    },
  },
  actions: {},
};
