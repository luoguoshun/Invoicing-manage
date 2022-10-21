import ajax from '@/utils/ajax';
export default {
    //获取所有销售单
    getSalesRerturnList(queryForm) {
        return ajax.post('/api/Background/SalesReturn/GetSalesRerturnList', queryForm);
    },
     //获取所有销售单
     getUnsubmittedSalesReturnList(queryForm) {
        return ajax.post('/api/Background/SalesReturn/GetUnsubmittedSalesReturnList', queryForm);
    },
    //获取登入人需要的审批的销售单
    getNeedRreviewSalesByUserId(queryForm) {
        return ajax.post('/api/Background/SalesReturn/GetNeedRreviewSalesByUserId', queryForm);
    },
    //通过销售单Id获取销售单详情
    getSalesReturnDatailByReturnId(salesReturnId) {
        return ajax.get('/api/Background/SalesReturn/GetSalesReturnDatailByReturnId?salesReturnId=' + salesReturnId + '');
    },
    //通获取未被付款模块引用销售单数据
    getNoExecuteSalesList(queryForm) {
        return ajax.post('/api/Background/SalesReturn/getNoExecuteSalesList', {
            ...queryForm
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
    adoptSalesOrderRequest(salesIds) {
        return ajax.post('/api/Background/SalesReturn/AdoptSalesOrderRequest', salesIds);
    },
    //驳回销售单
    rejectSalesOrderRequest(salesIds, value) {
        return ajax.post('/api/Background/SalesReturn/RejectSalesOrderRequest', {
            ProjectIds: salesIds,
            Reason: value,
        });
    },
    //驳回销售单
    createSalesNoteBysalesId(salesId) {
        return ajax.get('/api/Background/SalesReturn/CreateSalesNoteBysalesId?salesId=' + salesId + '');
    },
    //根据销售Id生成销售出库单PDF
    getSalesNoteFileBysalesId(salesId) {
        return ajax.get('/api/Background/SalesReturn/GetSalesNoteFileBysalesId?salesId=' + salesId + '');
    },
    //销售单完成
    finishSalesById(salesId) {
        return ajax.get('/api/Background/SalesReturn/FinishSalesById?salesId=' + salesId + '');
    },
    //销售单退货
    salesOrderReturnRequest(salesIds){
        return ajax.post('/api/Background/SalesReturn/SalesOrderReturnRequest', salesIds);
    }
}