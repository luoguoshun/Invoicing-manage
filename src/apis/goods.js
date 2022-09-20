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
    //获取物品类别信息
    getGoodInfoType() {
        return ajax.post('/api/Background/Googs/GetGoodsTypeInfo')
    },
    //通过仓库编号获取物品
    getSKUListByWhId(page, row, warehouseId, goodName, GoodsType) {
        console.log(warehouseId);
        return ajax.post('/api/Background/Googs/GetSKUListByWarehouseId', {
            page,
            row,
            warehouseId,
            goodName,
            GoodsType,
        })
    },
};