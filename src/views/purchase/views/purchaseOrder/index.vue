<template>
  <div class="purchasOrder">
    <el-menu :default-active="this.$route.path" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="/purchase/purchaseOrder/purchaseOrderList">采购单管理</el-menu-item>
      <el-menu-item index="/purchase/purchaseOrder/applyForBilling">采购开单</el-menu-item>
    </el-menu>
    <RouterView></RouterView>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'second',
    };
  },
  computed: {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="less" scoped>
.purchasOrder {
  height: 100%;
  width: 100%;
}
</style>
