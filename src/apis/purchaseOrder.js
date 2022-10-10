import ajax from '@/utils/ajax'

export default {
    //获取提交的采购订单列表（待审核 已审核）
    getSubmitOrderList(queryForm) {
        return ajax.post('/api/Background/purchaseOrder/GetSubmitOrderList', {
            ...queryForm
        });
    },
    //获取未提交的采购订单列表（待确认 驳回 ）
    getUnsubmitOrderList(queryForm) {
        return ajax.post('/api/Background/purchaseOrder/GetUnsubmitOrderList', {
            ...queryForm
        });
    },
    //获取登入人需要的审批的采购订单
    getNeedRreviewOrderByUserId(queryForm) {
        return ajax.post('/api/Background/purchaseOrder/GetNeedRreviewOrderByUserId', {
            ...queryForm
        });
    },
    //通过采购单编号获取单个采购单数据
    getNoExecuteOrderList(queryForm) {
        return ajax.post('/api/Background/purchaseOrder/GetNoExecuteOrderList', {
            ...queryForm
        });
    },
    //获取未被应付款模块引用的采购订单
    getPurcahseOrderByOrderId(purchaseOrderId) {
        return ajax.get('/api/Background/purchaseOrder/GetPurcahseOrderByOrderId?purchaseOrderId=' + purchaseOrderId + '');
    },
    //引入采购单
    importPurhaseOrder(purchaseIds) {
        return ajax.post('/api/Background/purchaseOrder/ImportPurhaseOrder', purchaseIds);
    },
    //提交采购单
    submitPurchaseOrder(purchaseOrderIds) {
        return ajax.post('/api/Background/purchaseOrder/SubmitPurchaseOrder', purchaseOrderIds);
    },
    //撤销采购单申请
    cancelOrderRequest(purchaseOrderIds) {
        return ajax.post('/api/Background/purchaseOrder/CancelOrderRequest', purchaseOrderIds);
    },
    //修改采购单数据
    updatePurchaseOrder(purchasOrder) {
        return ajax.post('/api/Background/purchaseOrder/UpdatePurchaseOrder', {
            ...purchasOrder
        });
    },
    /**
     * @description:审核通过采购申请单
     * @param {purchasIds}  采购单ids
     * @return {bool} 
     */
    adoptOrderRequest(purchaseOrderIds) {
        return ajax.post('/api/Background/purchaseOrder/AdoptOrderRequest', purchaseOrderIds);
    },
    /**
     * @description:驳回采购单
     * @param {purchasIds}  采购单ids
     * @param {reason}  驳回原因
     * @return {bool} 
     */
    rejectOrderRequest(purchaseOrderIds, reason) {
        return ajax.post('/api/Background/purchaseOrder/RejectOrderRequest', {
            ProjectIds: purchaseOrderIds,
            Reason: reason
        });
    },
}