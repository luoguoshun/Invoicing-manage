export default {
    namespaced: true,
    state: {
        dynamicRouters:[],
    },
    getters: {
        routers(state) {
            return state.dynamicRouters
        },
    },
    //mutations是唯一一种方式来修改state中的状态的；
    mutations: {
        setRouters(state, newsdata) {
            state.dynamicRouters = newsdata
        },
    },
};