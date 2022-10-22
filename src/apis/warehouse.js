import ajax from "../utils/ajax";

export default {
    //获取仓库列表
    getWarehouseList(page, row, conditions, warehouseType) {
        return ajax.post('/api/Background/Warehouse/GetWarehouseList', {
            page,
            row,
            conditions,
            warehouseType
        });
    },
    //获取仓库类别列表
    getWarehouseTypeList() {
        return ajax.post('/api/Background/Warehouse/GetWarehouseTypeList', );
    },

    //修改仓库信息
    updateWarehouse(warehouse) {
        return ajax.post('/api/Background/Warehouse/UpdateWarehouse',
            warehouse
        );
    },

    //检查仓库编号是否存在
    checkWarehouseExists(warehouseId) {
        return ajax.get("/api/Background/Warehouse/CheckWarehouseExists?warehouseId=" + warehouseId + "");
    },

    //新增仓库
    addWarehouses(warehouse) {
        return ajax.post('/api/Background/Warehouse/AddWarehouses', [warehouse]);
    },

    //删除仓库
    deleteWarehouseById(warehouseIds) {
        return ajax.post('/api/Background/Warehouse/DeleteWarehouseById', {
            warehouseIds
        });
    },
    //物品入库（手动添加）
    addSkuToWarehouse(warehouseId, supplierIdSkuIds) {
        return ajax.post('/api/Background/Warehouse/AddSkuToWarehouse', {
            WarehouseId: warehouseId,
            SupplierIdSkuIds: supplierIdSkuIds
        });
    },
    //修改库存 警戒数量
    updateWarehouseSku(warehouseId, skuId, count, warnCount, costPrice) {
        return ajax.post('/api/Background/Warehouse/UpdateWarehouseSku', {
            warehouseId,
            skuId,
            count,
            warnCount,
            costPrice
        });
    },
    //修改库存 警戒数量
    deleteSkuFromWarehouse(WarehouseSkus) {
        return ajax.post('/api/Background/Warehouse/DeleteSkuFromWarehouse', WarehouseSkus);
    },
    // 计算仓库的总成本、物资总和
    calculateWarehouseItems(warehouseId) {
        return ajax.get("/api/Background/Warehouse/CalculateWarehouseItemsById?warehouseId=" + warehouseId + "");
    },
};