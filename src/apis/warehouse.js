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

    //获取仓库类别列表
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
    addSkuToWarehouse(warehouseId, skuIds) {
        return ajax.post('/api/Background/Warehouse/AddSkuToWarehouse', {
            WarehouseId: warehouseId,
            SKUIds: skuIds
        });
    },
    updateWarehouseSku(warehouseId, skuId, count, warnCount) {
        return ajax.post('/api/Background/Warehouse/UpdateWarehouseSku', {
            warehouseId,
            skuId,
            count,
            warnCount
        });
    },
};