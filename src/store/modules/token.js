export default {
  namespaced: true,
  // 存放状态
  state: {
    token: {
      tokenInfo: JSON.parse(localStorage.getItem('tokenInfo')) || null, 
      expires_time: 0,
    },
  },
  //加工state成员给外界
  getters: {
    access_token(state) {
      if (state.token.tokenInfo == null) {
        return null;
      }
      return state.token.tokenInfo;
    },
    //到期时间方法
    expires(state) {
      if (state.tokenInfo == null) {
        return true;
      }
      return new Date().getTime() > state.tokenInfo.expires_time;
    },
  },
  // 操作state成员
  mutations: {
    setTokenInfo(state, tokenInfo) {
      state.token.expires_time = new Date().getTime() + tokenInfo.expires_in * 1000;
      localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo));
    },
    clearToken(state) {
      localStorage.removeItem('tokenInfo');
    },
  },
};
