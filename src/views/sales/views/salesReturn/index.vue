<template>
  <div class="salesOrderList">
    <el-menu :default-active="this.$route.name" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="salesReturnList">销售退货单管理</el-menu-item>
      <el-menu-item index="returnDocApplication">销售退货开单</el-menu-item>
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
  methods: {},
};
</script>
<style lang="less" scoped>
.salesOrderList {
  height: 100%;
  width: 100%;
}
</style>
