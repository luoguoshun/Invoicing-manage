import ajax from '@/utils/ajax';

export default { 
  //获取供应商信息
  getSupplierList(page, row, conditions, SupplierType) {
    return ajax.post('/api/Background/Supplier/GetSupplierList', {
      page,
      row,
      conditions,
      SupplierType,
    });
  },
};
