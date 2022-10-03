<template>
  <div class="purchasePlan">
    <el-menu :default-active="this.$route.name" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="purchasePlanList">采购计划管理</el-menu-item>
      <el-menu-item index="applicationPlan">采购计划申请</el-menu-item>
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
.purchasePlan {
  height: 100%;
  width: 100%;
}
</style>
