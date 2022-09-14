<template>
  <div class="slide">
    <el-menu default-active="this.$route.name" background-color="#324157" text-color="#bfcbd9" active-text-color="#049eff" :router="true">

      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        首页
      </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/system/users" :to="{ name: 'users' }" @click.native="createTab({ tabName: '用户管理', routeName: 'users' })">用户管理</el-menu-item>
        <el-menu-item index="/system/role">角色管理</el-menu-item>
        <el-menu-item index="/system/setting">系统设置</el-menu-item>
        <el-menu-item index="/system/dataInitialization">数据初始化</el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-notebook-2"></i>
          <span>基础资料管理</span>
        </template>
        <el-menu-item index="/baseInfo/supplier">供应商</el-menu-item>
        <el-menu-item index="goods">物品信息</el-menu-item>
        <el-menu-item index="warehouse">仓库信息</el-menu-item>
        <el-menu-item index="2-2">其他信息</el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-shopping-cart-1"></i>
          <span>订单管理</span>
        </template>
        <el-menu-item index="3-1">最新订单</el-menu-item>
        <el-menu-item index="3-2">其他</el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item index="4-2">基础设置</el-menu-item>
        <el-menu-item index="4-3">其他</el-menu-item>
      </el-submenu>
      <el-menu-item index="/logs" @click.native="createTab({ tabName: '日志管理', routeName: 'nLogList' })">
        <i class="el-icon-chat-line-round"></i>
        日志管理
      </el-menu-item>
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
    overflow: hidden;
    border: 0;
    background-color: #324157;
    a {
      text-decoration: none;
      color: #bfcbd9;
    }
  }
}
</style>
