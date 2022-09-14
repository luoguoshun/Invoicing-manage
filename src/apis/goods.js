import ajax from "../utils/ajax"

export default{
    getGoodsList(page,row,goodsId,publicattionDates,goodsName,goodsType,warehouseId){
        return ajax.post('/api/Background/Googs/GetGoodsList',{
            Page:page,
            Row:row,
            GoodsId:goodsId,
            PublicationDates:publicattionDates,
            GoodsName:goodsName,
            goodsType:goodsType,
            WarehouseId:warehouseId
        });
    },
    
    getGoodInfoType(){
        return ajax.post('/api/Background/Googs/GetGoodsTypeInfo')
    }

};