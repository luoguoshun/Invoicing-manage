<template>
  <div class="purchasePlan">
    <el-menu :default-active="this.$route.path" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="/purchase/purchasePlan/purchasePlanList">采购计划管理</el-menu-item>
      <el-menu-item index="/purchase/purchasePlan/applicationPlan">采购计划申请</el-menu-item>
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
  created(){
  },
};
</script>

<style lang="less" scoped>
.purchasePlan {
  height: 100%;
  width: 100%;
}
</style>
