export default {
  namespaced: true,
  // 存放状态
  state: {
    tokenInfo: JSON.parse(localStorage.getItem('tokenInfo')) || null,
  },
  //加工state成员给外界
  getters: {
    accessToken(state) {
      if (state.tokenInfo == null) {
        return null;
      }
      return state.tokenInfo.accessToken;
    },
    expiresTime(state) {
      if (state.tokenInfo == null) {
        return true;
      }
      return new Date().getTime() > state.tokenInfo.expiresTime;
    },
  },
  // 操作state成员
  mutations: {
    setTokenInfo(state, tokenInfo) {
      //将token信息存入本地浏览器中
      localStorage.setItem('tokenInfo', JSON.stringify({
        accessToken: tokenInfo.accessToken,
        expiresTime: new Date().getTime() + tokenInfo.expiresIn * 1000
      }));
    },
    clearToken(state) {
      localStorage.removeItem('tokenInfo');
    },
  },
};