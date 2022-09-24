import ajax from '@/utils/ajax'

export default {
    //获取采购订单列表
    getPurchaseOrderList(queryForm) {
        return ajax.post('/api/Background/Purchase/GetPurchaseOrderList', {
            ...queryForm
        });
    },
}