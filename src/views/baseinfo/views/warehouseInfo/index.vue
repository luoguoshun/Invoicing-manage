<template>
  <div class="warehouse_container">
    <el-menu :default-active="this.$route.path" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="/baseInfo/warehouseInfo/warehouseList" >仓库中心</el-menu-item>
      <el-menu-item index="/baseInfo/warehouseInfo/warehouseSkuList" disabled>清单列表</el-menu-item>
    </el-menu>
    <RouterView></RouterView>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="less" scoped>
.warehouse_container {
  height: 100%;
  width: 100%;
}
</style>
