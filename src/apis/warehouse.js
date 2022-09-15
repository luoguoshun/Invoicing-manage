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
        return ajax.post('/api/Background/Warehouse/GetWarehouseTypeList', 
        );
    },

};