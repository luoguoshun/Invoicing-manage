import ajax from '@/utils/ajax';
export default {
    //获取所有销售单
    getSalesList(queryForm) {
        return ajax.post('/api/Background/Sales/GetSalesList', queryForm);
    },
     //获取所有销售单
     getUnsubmittedSalesList(queryForm) {
        return ajax.post('/api/Background/Sales/GetUnsubmittedSalesList', queryForm);
    },
    //获取登入人需要的审批的销售单
    getNeedRreviewSalesByUserId(queryForm) {
        return ajax.post('/api/Background/Sales/GetNeedRreviewSalesByUserId', queryForm);
    },
    //通过销售单Id获取销售单详情
    getSalesDatailBySalesId(salesId) {
        return ajax.get('/api/Background/Sales/GetSalesDatailBySalesId?salesId=' + salesId + '');
    },
    //通获取未被付款模块引用销售单数据
    getSalesListBySalesState(queryForm) {
        return ajax.post('/api/Background/Sales/GetSalesListBySalesState', {
            ...queryForm
        });
    },
    //新增销售单
    addSalesOrder(salesOrders) {
        return ajax.post('/api/Background/Sales/AddSalesOrder', salesOrders);
    },
    //提交销售单
    submitApplications(salesOrders) {
        return ajax.post('/api/Background/Sales/SubmitApplications', salesOrders);
    },
    //提交销售单
    cancelSalesOrderRequest(salesIds) {
        return ajax.post('/api/Background/Sales/CancelSalesOrderRequest', salesIds);
    },
    //审核销售单
    adoptSalesOrderRequest(salesIds) {
        return ajax.post('/api/Background/Sales/AdoptSalesOrderRequest', salesIds);
    },
    //驳回销售单
    rejectSalesOrderRequest(salesIds, value) {
        return ajax.post('/api/Background/Sales/RejectSalesOrderRequest', {
            ProjectIds: salesIds,
            Reason: value,
        });
    },
    //驳回销售单
    createSalesNoteBysalesId(salesId) {
        return ajax.get('/api/Background/Sales/CreateSalesNoteBysalesId?salesId=' + salesId + '');
    },
    //根据销售Id生成销售出库单PDF
    getSalesNoteFileBysalesId(salesId) {
        return ajax.get('/api/Background/Sales/GetSalesNoteFileBysalesId?salesId=' + salesId + '');
    },
    //销售单完成
    finishSalesById(salesId) {
        return ajax.get('/api/Background/Sales/FinishSalesById?salesId=' + salesId + '');
    },
    //销售单退货
    salesOrderReturnRequest(salesIds){
        return ajax.post('/api/Background/Sales/SalesOrderReturnRequest', salesIds);
    },
    //按照时间统计销售额
    salesStatistics(salesDateType) {
        return ajax.get('/api/Background/Sales/SalesStatistics?salesDateType=' + salesDateType + '');
    },
}