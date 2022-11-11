<template>
  <div class="slide">
    <el-menu default-active="this.$route.name" :router="true" background-color="#324157" text-color="#bfcbd9" active-text-color="#049eff">
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        首页
      </el-menu-item>

      <el-submenu index="system">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/system/users" :to="{ name: 'users' }" @click.native="createTab({ tabName: '用户管理', routeName: 'users' })">
          用户管理
        </el-menu-item>
        <el-menu-item index="/system/role" @click.native="createTab({ tabName: '角色管理', routeName: 'role' })">角色管理</el-menu-item>
        <el-menu-item index="/system/department">部门管理</el-menu-item>
        <el-menu-item index="/system/setting" @click.native="createTab({ tabName: '系统设置', routeName: 'setting' })">系统设置</el-menu-item>
        <!-- <el-menu-item index="/system/dataInitialization" @click.native="createTab({ tabName: '数据初始化', routeName: 'dataInitialization' })">
          数据初始化
        </el-menu-item> -->
      </el-submenu>

      <el-submenu index="baseInfo">
        <template slot="title">
          <i class="el-icon-notebook-2"></i>
          <span>基础资料管理</span>
        </template>
        <el-menu-item index="/baseInfo/supplier/supplierList" @click.native="createTab({ tabName: '供应商', routeName: 'supplierList' })">
          供应商
        </el-menu-item>
        <el-menu-item index="/baseInfo/goods/spuList" @click.native="createTab({ tabName: '货品档案', routeName: 'spuList' })">
          货品档案
        </el-menu-item>
        <el-menu-item index="/baseInfo/warehouse/warehouseList" @click.native="createTab({ tabName: '仓库信息', routeName: 'warehouseList' })">
          仓库信息
        </el-menu-item>
        <el-menu-item index="/baseInfo/others/goodsTypeList" @click.native="createTab({ tabName: '其他信息', routeName: 'goodsTypeList' })">
          其他信息
        </el-menu-item>
      </el-submenu>

      <el-submenu index="purchase">
        <template slot="title">
          <i class="el-icon-circle-plus"></i>
          <span>采购管理</span>
        </template>
        <el-menu-item
          index="/purchase/purchasePlan/purchasePlanList"
          @click.native="createTab({ tabName: '采购计划管理', routeName: 'purchasePlanList' })"
          >采购计划管理</el-menu-item
        >
        <el-menu-item
          index="/purchase/purchaseOrder/purchaseOrderList"
          @click.native="createTab({ tabName: '采购订单管理', routeName: 'purchaseOrderList' })"
          >采购订单管理</el-menu-item
        >
      </el-submenu>

      <el-submenu index="warehouse">
        <template slot="title">
          <i class="el-icon-s-grid"></i>
          <span>仓库管理</span>
        </template>
        <el-menu-item
          index="/warehouse/putInWarehouse/PurchaseReceipt"
          @click.native="createTab({ tabName: '入库管理', routeName: 'PurchaseReceipt' })"
        >
          入库管理
        </el-menu-item>
        <el-menu-item
          index="/warehouse/putOutWarehouse/ExwarehouseReceipt"
          @click.native="createTab({ tabName: '出库管理', routeName: 'ExwarehouseReceipt' })"
        >
          出库管理
        </el-menu-item>
        <el-menu-item index="/warehouse/ItemManage" @click.native="createTab({ tabName: '物资管理', routeName: 'ItemManage' })">
          物资管理
        </el-menu-item>
      </el-submenu>

      <el-submenu index="sales">
        <template slot="title">
          <i class="el-icon-s-data"></i>
          <span>销售管理</span>
        </template>
        <el-menu-item index="/sales/salesOrder/salesOrderList" @click.native="createTab({ tabName: '销售管理', routeName: 'salesOrderList' })">
          销售管理
        </el-menu-item>
        <el-menu-item index="/sales/salesReturn/salesReturnList" @click.native="createTab({ tabName: '销售退货', routeName: 'salesReturnList' })">
          销售退货
        </el-menu-item>
      </el-submenu>

      <el-submenu index="financial">
        <template slot="title">
          <i class="el-icon-s-order"></i>
          <span>财务管理</span>
        </template>
        <el-menu-item index="/financial/accountsPayable" @click.native="createTab({ tabName: '应付账管理', routeName: 'accountsPayable' })">
          应付账管理
        </el-menu-item>
        <el-menu-item index="/financial/accountReceivable" @click.native="createTab({ tabName: '应收账管理', routeName: 'accountReceivable' })">
          应收账管理
        </el-menu-item>
      </el-submenu>

      <el-submenu index="logs">
        <template slot="title">
          <i class="el-icon-chat-line-round"></i>
          <span>日志管理</span>
        </template>
        <el-menu-item index="/logs/operateLog" @click.native="createTab({ tabName: '操作日志', routeName: 'operateLog' })">
          操作日志
        </el-menu-item>
        <el-menu-item index="/logs/systemLog" @click.native="createTab({ tabName: '操作日志', routeName: 'systemLog' })">
          系统日志
        </el-menu-item>
      </el-submenu>

      <el-submenu index="message">
        <template slot="title">
          <i class="el-icon-chat-line-round"></i>
          <span>消息管理</span>
        </template>
        <el-menu-item index="/message/notice" @click.native="createTab({ tabName: '消息管理', routeName: 'notice' })">
          通知管理
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  computed: {},
  methods: {
    //   映射添加标签页函数
    //  载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：
    ...mapMutations({ createTab: 'tagsView/createTab' }),
  },
};
</script>
<style lang="less" scoped>
.slide {
  height: 100%;
  .el-menu {
    min-height: 100%;
    background-color: #324157;
    color:#bfcbd9;
  }
}
</style>
