import ajax from '@/utils/ajax';
export default {
    //获取所有销售单
    getSalesReturnList(queryForm) {
        return ajax.post('/api/Background/SalesReturn/GetSalesReturnList', queryForm);
    },
    //获取所有销售单
    getUnsubmittedSalesReturnList(queryForm) {
        return ajax.post('/api/Background/SalesReturn/GetUnsubmittedSalesReturnList', queryForm);
    },
    //获取登入人需要的审批的销售单
    getNeedRreviewSalesReturnByUserId(queryForm) {
        return ajax.post('/api/Background/SalesReturn/GetNeedRreviewSalesReturnByUserId', queryForm);
    },
    //通过销售退货单状态获取退货单
    getSalesReturnListByState(queryForm) {
        return ajax.post('/api/Background/SalesReturn/GetSalesReturnListByState', queryForm);
    },
    //通过销售单Id获取销售单详情
    getSalesReturnDatailByReturnId(salesReturnId) {
        return ajax.get('/api/Background/SalesReturn/GetSalesReturnDatailByReturnId?salesReturnId=' + salesReturnId + '');
    },
    //引入销售单
    importSalesOrder(salesOrderIds, userId, name) {
        return ajax.post('/api/Background/SalesReturn/importSalesOrder', {
            SalesOrderIds: salesOrderIds,
            OperationId: userId,
            OperationName: name,
        });
    },
    //新增销售单
    addSalesOrder(salesOrders) {
        return ajax.post('/api/Background/SalesReturn/AddSalesOrder', salesOrders);
    },
    //提交销售单
    submitApplications(salesOrders) {
        return ajax.post('/api/Background/SalesReturn/SubmitApplications', salesOrders);
    },
    //撤销销售单
    cancelSalesReturnRequest(salesRerurnIds) {
        return ajax.post('/api/Background/SalesReturn/CancelSalesReturnRequest', salesRerurnIds);
    },
    //审核销售单
    adoptSalesReturnRequest(salesIds) {
        return ajax.post('/api/Background/SalesReturn/AdoptSalesReturnRequest', salesIds);
    },
    //驳回销售单
    rejectSalesReturnRequest(salesIds, value) {
        return ajax.post('/api/Background/SalesReturn/RejectSalesReturnRequest', {
            ProjectIds: salesIds,
            Reason: value,
        });
    },
    //驳回销售单
    createSalesNoteBysalesId(salesId) {
        return ajax.get('/api/Background/SalesReturn/CreateSalesNoteBysalesId?salesId=' + salesId + '');
    },
    //销售单完成
    finishSalesById(salesId) {
        return ajax.get('/api/Background/SalesReturn/FinishSalesById?salesId=' + salesId + '');
    },
    //销售单退货
    salesOrderReturnRequest(salesIds) {
        return ajax.post('/api/Background/SalesReturn/SalesOrderReturnRequest', salesIds);
    }
}