import ajax from '@/utils/ajax';
export default {
    //获取物品类型列表
    getGoodsTypeList(goodsTypeName) {
        return ajax.post('/api/Background/GoodsType/GetGoodsTypeList', {
            goodsTypeName
        });
    },

    //添加物品类型
    addGoodsType(goodsTypeName) {
        return ajax.post('/api/Background/GoodsType/AddGoodsType', {
            goodsTypeName,
        });
    },

    //修改物品类型信息
    updateGoodsType(goodsTypeId, goodsTypeName) {
        return ajax.post('/api/Background/GoodsType/UpdateGoodsType', {
            goodsTypeId,
            goodsTypeName
        });
    },

    //删除物品类型
    deleteGoodsTypeById(goodsTypeIds) {
        return ajax.post("/api/Background/GoodsType/DeleteGoodsTypeById",
            goodsTypeIds
        );
    }
};