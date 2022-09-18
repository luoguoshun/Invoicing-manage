import ajax from "../utils/ajax"

export default {
    getGoodsList(page, row, goodsId, publicattionDates, goodsName, goodsType, warehouseId) {
        return ajax.post('/api/Background/Googs/GetGoodsList', {
            Page: page,
            Row: row,
            GoodsId: goodsId,
            PublicationDates: publicattionDates,
            GoodsName: goodsName,
            goodsType: goodsType,
            WarehouseId: warehouseId
        });
    },

    getGoodInfoType() {
        return ajax.post('/api/Background/Googs/GetGoodsTypeInfo')
    },
    //通过仓库编号获取物品
    getSKUListByWhId(warehouseId) {
        return ajax.get('/api/Background/Googs/GetSKUListByWhId?warehouseId=' + warehouseId + '')
    },

    //通过供应商编号获取供应商货品
    GetSKUListBySupplierId(page, row, GoodsName, GoodsType, WarehouseId,supplierId) {
        return ajax.post('/api/Background/Googs/GetSKUListBySupplierId', {
            Page:page,
            Row:row,
            GoodsName:GoodsName, 
            GoodsType:GoodsType, 
            WarehouseId:WarehouseId,
            SupplierId:supplierId
        })
    },
};