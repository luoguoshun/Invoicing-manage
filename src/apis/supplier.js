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
    console.log(supplierFrom)
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
    return ajax.post('/api/Background/Supplier/DeleteSupplier', {
      supplierIds
    });
  },

  //调取供应商分类
  getSupplierTypeList() {
    return ajax.post('/api/Background/Supplier/GetSupplierTypeList');
  },

  //删除供应商关联的货品
  DeleteSupplierSKU(skuId, supplierId) {
    return ajax.post('/api/Background/Supplier/DeleteSupplierSKU', {
      SKUIds: skuId,
      SupplierId: supplierId
    });
  },


  //物品绑定供应商
  GoodsAddtoSupplier(supplier) {
    console.log(supplier)
    return ajax.post('/api/Background/Supplier/GoodsAddtoSupplier', {
      ...supplier
    })
  },
  //修改供应商绑定的SKU的采购价
  EditSupplierPurchasePrice(supplierId, PurchasePrice, SKUId) {
    return ajax.post('/api/Background/Supplier/EditSupplierPurchasePrice', {
      SkuId: SKUId,
      SupplierId: parseInt(supplierId),
      PurchasePrice: parseFloat(PurchasePrice),
    })
  },
  //构造供应商下拉选择数据
  constructDropDownData() {
    return ajax.post('/api/Background/Supplier/ConstructDropDownData')
  }
};