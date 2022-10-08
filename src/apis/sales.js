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
    //通过销售单Id获取销售单详情
    getSalesDatailBySalesId(salesId) {
        return ajax.get('/api/Background/Sales/GetSalesDatailBySalesId?salesId=' + salesId + '');
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
    rejectSalesOrderRequest(salesIds) {
        return ajax.post('/api/Background/Sales/RejectSalesOrderRequest', salesIds);
    },
}