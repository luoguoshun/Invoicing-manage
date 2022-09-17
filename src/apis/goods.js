import ajax from "../utils/ajax"

export default {
    getSPUList(page, row, spuId, publicattionDates, goodsName, goodsTypeId, warehouseId) {
        console.log(goodsTypeId)
        return ajax.post('/api/Background/Googs/GetSPUList', {
            Page: page,
            Row: row,
            SpuId: spuId,
            PublicationDates: publicattionDates,
            GoodsName: goodsName,
            goodsType: goodsTypeId,
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
        return ajax.post('/api/Background/Googs/GetSKUListByWhId', {
            page,
            row,
            warehouseId,
            goodName,
            GoodsType,
        })
    },

    getBrandType() {
        return ajax.post('/api/Background/Googs/GetBrandType');
    },

    addSpu(spu) {
        console.log(spu)
        return ajax.post('/api/Background/Googs/AddGoodsInfo', {
            ...spu,
        })
    },

    deleteSpuById(spuIds) {
        return ajax.post("/api/Background/Googs/DeleteGoodsByid",
            spuIds
        );
    }
};