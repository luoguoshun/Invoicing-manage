import ajax from '../utils/ajax';

export default {
    // 获取应付款订单列表
    getPaymentOrderList(queryForm) {
        return ajax.post('/api/Background/PaymentOrder/GetPaymentOrderList', {
            ...queryForm
        });
    },
    //通过采购单新增应付款订单
    addPaymentOrderByPurchaseOrder(purchaseOrderIds) {
        return ajax.post('/api/Background/PaymentOrder/AddPaymentOrderByPurchaseOrder', purchaseOrderIds);
    },
    //支付订单
    paymentOrder(payForm) {
        return ajax.post('/api/Background/PaymentOrder/PaymentOrder', {
            ...payForm
        });
    },
};