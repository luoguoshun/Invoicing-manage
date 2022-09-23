import ajax from '@/utils/ajax'

export default {
    // //获取采购计划列表
    // getPurchasePlanList(page, row, warehouseId, approvalName, state, publicationDates) {
    //     return ajax.post('/api/Background/Purchase/GetPurchasePlanList', {
    //         Page: page,
    //         Row: row,
    //         warehouseId: warehouseId,
    //         approvalName: approvalName,
    //         state: state,
    //         PublicationDates: publicationDates,
    //     });
    // },
    //获取采购计划列表
    getPurchasePlanList(queryForm) {
        return ajax.post('/api/Background/Purchase/GetPurchasePlanList', {
            ...queryForm
        });
    },
    /**
     * @description:获取采购计划项目列表
     * @param {purchasId}  采购计划Id
     * @return {Array} 购计划项目列表
     */
    getDetailPlanListByPurchasId(purchaseId) {
        return ajax.get('/api/Background/Purchase/GetDetailPlanListByPurchasId?purchasId=' + purchaseId + '');
    },
    //新建采购计划
    addPurchasePlan(purchaseForm) {
        return ajax.post('/api/Background/Purchase/AddPurchasePlan', {
            ...purchaseForm
        });
    },
    /**
     * @description:修改采购计划项目列表
     * @param {purchaseId}  采购计划Id
     * @param {detailPlanItems}  采购计划项目
     * @return {Array} 购计划项目列表
     */
    updatePurchaseDetails(purchaseId, purchaseDetails) {
        return ajax.post('/api/Background/Purchase/UpdatePurchaseDetails', {
            purchaseId,
            purchaseDetails
        });
    },
    /**
     * @description:撤销采购申请
     * @param {purchasIds}  采购计划Id
     * @return {Array} 购计划项目列表
     */
    cancelPurchaseRequest(purchaseIds) {
        return ajax.post('/api/Background/Purchase/CancelPurchaseRequest', purchaseIds);
    },
    /**
     * @description:移除采购计划单的子项目
     * @param {purchasIds}  采购计划Id
     * @return {Array} 购计划项目列表
     */
    deletePurchaseDetail(purchaseId, purchaseDetailId) {
        return ajax.post('/api/Background/Purchase/DeletePurchaseDetail', {
            purchaseId,
            purchaseDetailId
        });
    },
}