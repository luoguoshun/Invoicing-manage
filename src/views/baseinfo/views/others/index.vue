<template>
  <div class="ohters_container">
    <el-menu :default-active="this.$route.name" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="goodsTypeList" >物品类型管理</el-menu-item>
      <el-menu-item index="approvalStateList" disabled>审批状态管理</el-menu-item>
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
.ohters_container {
  height: 100%;
  width: 100%;
}
</style>
