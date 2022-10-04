import account from './account';
import user from './user';
import role from './role';
import system from './system';
import log from './log';
import goods from './goods';
import supplier from './supplier'
import warehouse from './warehouse';
import vueRouter from './vueRouter'
import goodsType from './goodsType';
import purchase from './purchase';
import stock from './stock';
import purchaseOrder from './purchaseOrder'
import workFlow from './workFlow'
import paymentOrder from './paymentOrder'

export default {
  account,
  system,
  user,
  log,
  role,
  goods,
  supplier,
  warehouse,
  vueRouter,
  goodsType,
  purchase,//采购
  stock,//仓库管理
  purchaseOrder,
  workFlow,//审核
  paymentOrder,//应付款
};
