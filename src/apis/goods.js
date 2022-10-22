import ajax from "../utils/ajax"

export default {
    getSPUList(page, row, spuId, publicattionDates, goodsName, goodsTypeId, warehouseId) {
        return ajax.post('/api/Background/Googs/GetSPUList', {
            Page: page,
            Row: row,
            SpuId: spuId,
            PublicationDates: publicattionDates,
            GoodsName: goodsName,
            goodsTypeId: goodsTypeId,
            WarehouseId: warehouseId
        });
    },
    //获取物品类别信息
    getGoodInfoType() {
        return ajax.post('/api/Background/Googs/GetGoodsTypeInfo')
    },
    //通过仓库编号获取物品
    getSKUListByWhId(page, row, warehouseId, conditions, goodsTypeId) {
        return ajax.post('/api/Background/Googs/GetSKUListByWarehouseId', {
            page,
            row,
            warehouseId,
            conditions,
            goodsTypeId,
            //warehouseId,
        });
    },
    //获取品牌类型
    getBrandType() {
        return ajax.post('/api/Background/Googs/GetBrandType');
    },
    //添加SPU
    addSpu(spu) {
        return ajax.post('/api/Background/Googs/AddGoodsInfo', {
            ...spu,
        })
    },
    //通过供应商编号获取供应商货品
    GetSKUListBySupplierId(page, row, goodsTypeId, supplierId, conditions) {
        return ajax.post('/api/Background/Googs/GetSKUListBySupplierId', {
            Page: page,
            Row: row,
            GoodsTypeId: goodsTypeId,
            SupplierId: supplierId,
            Conditions: conditions,
        })
    },
    ///修改SPU
    updateSpu(spu) {
        return ajax.post('/api/Background/Googs/UpdateGoodsInfo', {
            ...spu,
        })
    },
    //删除SPU
    deleteSpuById(spuIds) {
        return ajax.post("/api/Background/Googs/DeleteGoodsByid",
            spuIds
        );
    },
    //查询SKU
    getSKUList(page, row, spuId, skuId, goodsName, goodsTypeId) {
        return ajax.post("/api/Background/Googs/GetSKUList", {
            Page: page,
            Row: row,
            SpuId: spuId,
            SkuId: skuId,
            GoodsName: goodsName,
            GoodsTypeId: goodsTypeId
        })
    },
    //上传sku图片
    uploadSKULogoImg(file) {
        return ajax.post("/api/Background/Googs/UploadSKULogoImg", file);
    },
    //删除SKU
    deleteSKUListById(skuIds) {
        return ajax.post("/api/Background/Googs/DeleteSKUListById",
            skuIds
        );
    },
    //修改sku信息
    updateSKUById(sku) {
        return ajax.post("/api/Background/Googs/UpdateSKUById",
            sku
        );
    }
};