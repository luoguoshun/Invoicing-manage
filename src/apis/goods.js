import ajax from "../utils/ajax"

export default{
    getGoodsList(page,row,publicattionDates,goodsName,goodsType,warehouseId){
        return ajax.post('/api/Background/Googs/GetGoodsList',{
            Page:page,
            Row:row,
            PublicationDates:publicattionDates,
            GoodsName:goodsName,
            goodsType:goodsType,
            WarehouseId:warehouseId
        });
    }
};