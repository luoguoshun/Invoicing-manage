<template>
  <div class="purchasOrder">
    <el-menu :default-active="this.$route.name" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="purchasOrderList">采购单管理</el-menu-item>
      <el-menu-item index="applyForBilling">采购开单</el-menu-item>
    </el-menu>
    <RouterView></RouterView>
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs> -->
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
