import ajax from '@/utils/ajax';
export default {
    //获取入库单信息
    getPutInWarehouseOrder(page, row, conditions, warehouseId) {
        return ajax.post('/api/Background/Putinwarehous/GetPutinWarehousList', {
            page,
            row,
            conditions,
            warehouseId
        });
    },

    //获取入库单详情
    GetPutinWarehousDetail(page, row, putinWarehousId) {
        return ajax.post('/api/Background/Putinwarehous/GetPutinWarehousDetail', {
            Page: page,
            Row: row,
            PutinWarehousId: putinWarehousId
        });
    },
    //提交入库申请
    SubmitPutinWarehousApply(putinWarehousIds) {
        return ajax.post('/api/Background/Putinwarehous/SubmitPutinWarehousApply', {
            putinWarehousIds
        })
    },
    //生成入库单和入库详情
    CreatePutinWarehousId(from) {
        return ajax.post('/api/Background/Putinwarehous/CreatePutinWarehousId', {
            ...from
        })
    },

    //删除入库单
    DeletetPutinWarehousApply(putinWarehousIds) {
        return ajax.post('/api/Background/Putinwarehous/DdeletePutinWarehousApply', putinWarehousIds)
    },

    EditPutinWarhouseOrder(PutinWarehousId, PutinWarehousDetails) {
        return ajax.post('/api/Background/Putinwarehous/EditPutinWarehous', {
            PutinWarehousId,
            PutinWarehousDetails
        })
    },
}