import ajax from '@/utils/ajax';

export default {
    getDynamicRouter() {
        return ajax.post('/api/Background/VueRouter/GetDynamicRouter');
    },
    getAllRouterInfo(page, row, conditions) {
        return ajax.post('/api/Background/VueRouter/GetAllRouterInfo', {
            page,
            row,
            conditions
        });
    },
    //构造路由级联数据
    constructRouteCascadeData() {
        return ajax.post('/api/Background/VueRouter/ConstructRouteCascadeData');
    },
    //配置路由
    addRouter(router) {
        return ajax.post('/api/Background/VueRouter/AddRouter', {
            ...router
        });
    },
    //修改路由
    updateRouter(router) {
        return ajax.post('/api/Background/VueRouter/UpdateRouter', {
            ...router
        });
    },
    /**
     * @description:移除路由
     * @param {routerIds} 
     * @return {bool}
     */
    deleteRoutersById(routerIds) {
        return ajax.post('/api/Background/VueRouter/DeleteRoutersById',
            routerIds
        );
    },
}