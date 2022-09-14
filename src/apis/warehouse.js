import ajax from "../utils/ajax";

export default{
    getWarehouseList(){
        return ajax.post('/api/Background/Warehouse/GetWarehouseList',{
            Page:1,
            Row:10,
        });
    }
};