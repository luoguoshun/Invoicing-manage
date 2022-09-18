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

  //修改供应商信息
  updateSupplier(supplierFrom) {
    return ajax.post('api/Background/Supplier/UpdateSupplier', {
      ...supplierFrom,
    });
  },

  //添加供应商信息
  addSupplier(supplierFrom) {
    console.log(supplierFrom);
    return ajax.post('/api/Background/Supplier/AddSupplier', [supplierFrom]);
  },

  //删除供应商
  deleteSupplier(supplierIds) {
    console.log(supplierIds);
    return ajax.post('/api/Background/Supplier/DeleteSupplier', { supplierIds });
  },

  //调取供应商分类
  getSupplierTypeList() {
    return ajax.post('/api/Background/Supplier/GetSupplierTypeList', 
    );
},
};
