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
    getSKUListByWhId(page, row, warehouseId, goodName, goodsType) {
        return ajax.post('/api/Background/Googs/GetSKUListByWarehouseId', {
            page,
            row,
            warehouseId,
            goodName,
            goodsType,
            warehouseId,
        });
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

    //通过供应商编号获取供应商货品
    GetSKUListBySupplierId(page, row, GoodsName, GoodsType, WarehouseId, supplierId) {
        return ajax.post('/api/Background/Googs/GetSKUListBySupplierId', {
            Page: page,
            Row: row,
            GoodsName: GoodsName,
            GoodsType: GoodsType,
            WarehouseId: WarehouseId,
            SupplierId: supplierId
        })
    },
    deleteSpuById(spuIds) {
        return ajax.post("/api/Background/Googs/DeleteGoodsByid",
            spuIds
        );
    },

    //获取sku信息
    GetSKUList(page, row, spuId, skuId, goodsName, goodsType) {
        return ajax.post('/api/Background/Googs/GetSKUList', {
            Page: page,
            Row: row,
            spuId: spuId,
            skuId: skuId,
            goodsName: goodsName,
            goodsType: goodsType,
        })
    },

    //物品绑定供应商
    GoodsAddtoSupplier(supplier) {
        console.log(supplier)
        return ajax.post('/api/Background/Googs/GoodsAddtoSupplier', {
            ...supplier
        })
    },

};