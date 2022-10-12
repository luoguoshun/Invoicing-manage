import ajax from "../utils/ajax"

export default{
    //获取出库类型
    getExWareHouseType(){
        return ajax.post('/api/Background/ExWarehouse/GetExWarehouseType')
    },
    //获取出库单
    getExWareHouseOrder(queryfrom)
    {
        return ajax.post('/api/Background/ExWarehouse/GetExWarehouse',queryfrom)
    },

    //获取出库计划
    getExWarhousePlanList(from)
    {
      return ajax.post('/api/Background/ExWarehouse/GetExWarhousePlanList',from)
    },
    //获取出库详情
    getExWareHouseDet(from)
    {
        console.log(from);
        return ajax.post('/api/Background/ExWarehouse/GetExWareHouseDet',from)
    },
    //生成出库计划
    createExWarhousePlan(ExFrom){
        console.log(ExFrom);
        return ajax.post('/api/Background/ExWarehouse/CreateExWarhousePlan',ExFrom)
    },
    //修改出库详情
    updateExWareHouseDet(from)
    {
        console.log(from);
        return ajax.post('/api/Background/ExWarehouse/UpdateExWareHouseDet',from)
    },
    //出库开单
    CreateExWarehousePlanOrder(exwarehouseIds)
    {
        return ajax.post('/api/Background/ExWarehouse/CreateExWarehouseOrder',exwarehouseIds)
    },
    //提交出库单
    submitExWarehouseOrder(exwarehouseIds)
    {
        return ajax.post('/api/Background/ExWarehouse/SubmitExWarehouseOrder',exwarehouseIds)
    },
};