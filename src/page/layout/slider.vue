<template>
  <div class="slide">
    <el-menu default-active="this.$route.name" background-color="#324157" text-color="#bfcbd9" active-text-color="#049eff" :router="true">

      <el-menu-item index="homeIndex">
        <i class="el-icon-menu"></i>
        首页
      </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="clientList" @click.native="createTab({ tabName: '用户列表', routeName: 'clientList' })">用户列表</el-menu-item>
        <el-menu-item index="1-2">权限设置</el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-notebook-2"></i>
          <span>书籍管理</span>
        </template>
        <el-menu-item index="bookList" @click.native="createTab({ tabName: '书籍列表', routeName: 'bookList' })">书籍列表</el-menu-item>
        <el-menu-item index="2-2">其他</el-menu-item>
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
        <el-menu-item index="nLogList" @click.native="createTab({ tabName: '日志管理', routeName: 'nLogList' })">日志管理</el-menu-item>
        <el-menu-item index="4-2">基础设置</el-menu-item>
        <el-menu-item index="4-3">其他</el-menu-item>
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
