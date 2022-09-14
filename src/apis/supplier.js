import ajax from '../utils/ajax';

export default {
    getSupplierList(page, row, conditions, supplierType) {
      return ajax.post('/api/Background/Supplier/GetSupplierList', {
        page,
        row,
        conditions,
        supplierType,
      });
    },
  };