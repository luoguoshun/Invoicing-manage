import ajax from '../utils/ajax';

export default {
    // 获取应付款订单列表
    getAccountList(queryForm) {
        return ajax.post('/api/Background/Finance/GetAccountList', {
            ...queryForm
        });
    },
    //自主开应付应收单
    addAccount(accountForm) {
        return ajax.post('/api/Background/Finance/AddAccount', {
            ...accountForm
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
    //通过销售退货单新增应付款订单
    addAccountBySalesReturn(salesReturnIds, operationPersonId, operationPersonName) {
        return ajax.post('/api/Background/Finance/AddAccountBySalesReturn', {
            salesReturnIds,
            operationPersonId,
            operationPersonName,
        });
    },
    //通过销售单新增应收款订单
    addAccountBySalesOrder(salesOrderIds, operationPersonId, operationPersonName) {
        return ajax.post('/api/Background/Finance/AddAccountBySalesOrder', {
            salesOrderIds,
            operationPersonId,
            operationPersonName,
        });
    },
    //获取所有银行卡信息列表
    getBankCardInfoList() {
        return ajax.post('/api/Background/Finance/GetBankCardInfoList');
    },
    //支付订单
    paymentOrder(paymentForm) {
        return ajax.post('/api/Background/Finance/PaymentOrder', {
            ...paymentForm
        });
    },
    //支付订单
    accountReceivable(paymentForm) {
        return ajax.post('/api/Background/Finance/AccountReceivable', {
            ...paymentForm
        });
    },
};