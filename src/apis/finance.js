import ajax from '../utils/ajax';

export default {
    // 获取应付款订单列表
    getAccountList(queryForm) {
        return ajax.post('/api/Background/Finance/GetAccountList', {
            ...queryForm
        });
    },
    //通过采购单新增应付款订单
    addAccountByPurchaseOrder(purchaseOrderIds, operationPersonId, operationPersonName) {
        return ajax.post('/api/Background/Finance/AddAccountByPurchaseOrder', {
            purchaseOrderIds,
            operationPersonId,
            operationPersonName,
        });
    },
    //获取所有银行卡信息列表
    getBankCardInfoList() {
        return ajax.post('/api/Background/Finance/GetBankCardInfoList');
    },
    //支付订单
    paymentOrder(payForm) {
        return ajax.post('/api/Background/Finance/PaymentOrder', {
            ...payForm
        });
    },
};