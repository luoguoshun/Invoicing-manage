import ajax from '@/utils/ajax';
export default {
    //获取入库单信息
    getPutInWarehouseOrder(page, row, conditions, WarehouseType){
        return ajax.post('/api/Background/Stock/GetPutinWarehousList',{
        page,row,conditions,WarehouseType
        });
    },

    //获取入库单详情
    GetPutinWarehousDetail(page, row, putinWarehousId){
        console.log(putinWarehousId);
        return ajax.post('/api/Background/Stock/GetPutinWarehousDetail',{
        page,row,putinWarehousId
        });
    },
}