<template>
  <div class="container">
    <!-- 导航栏 -->
    <div class="nav">
      <el-menu default-active="2" @open="handleOpen">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="1-1">
            <router-link @click.native="addTagToArray('用户管理', 'userList')" :to="{ name: 'userList' }">
              用户列表
            </router-link>
          </el-menu-item>
          <el-menu-item index="1-2">
            权限设置
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-notebook-2"></i>
            <span>书籍管理</span>
          </template>
          <el-menu-item index="2-1">
            <router-link @click.native="addTagToArray('书籍列表', 'bookList')" :to="{ name: 'bookList' }">
              书籍列表
            </router-link>
          </el-menu-item>
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
          <el-menu-item index="4-1">基础设置</el-menu-item>
          <el-menu-item index="4-2">其他</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <!-- 主内容区 -->
    <div class="main">
      <!-- 头部 -->
      <div class=" header">
        <!-- 基本信息区 -->
        <div class="header_info">
          <div class="title"></div>
          <div class="adminInfo">
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          </div>
        </div>
        <!-- 标签区 -->
        <div class="header_tab">
          <div class="tabs">
            <el-tag type="warning" @click="switchComponent('homeIndex')">
              &nbsp;&nbsp;&nbsp;首页&nbsp;&nbsp;&nbsp;
            </el-tag>
            <el-tag
              :key="tag.routerName"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @click="switchComponent(tag.routerName)"
              @close="delTagFromArray(tag)"
            >
              {{ tag.tagName }}
            </el-tag>
          </div>
          <div class="closetabs">
            <el-button size="small" round @click="closeAllTags()">
              <i class="el-icon-close"></i>
              关闭所有
            </el-button>
          </div>
        </div>
      </div>
      <!-- 动态组件内容区 -->
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dynamicTags: [],
      thisRouterName: '',
    };
  },
  methods: {
    /**
     * @description: 点击跳转并把跳转信息添加至dynamicTags中
     * @param {标签名称} tagName
     * @param {路由地址} path
     * @return {*}
     */
    addTagToArray(tagName, routerName) {
      //保存当前组件的路由
      this.thisRouterName = routerName;
      let isHave = false;
      this.dynamicTags.forEach((item) => {
        //判断点击的标签是否存在数组中
        if (item.tagName == tagName && item.routerName == path) {
          isHave = true;
          return;
        }
      });
      if (!isHave) {
        this.dynamicTags.push({
          tagName: tagName,
          routerName: routerName,
        });
      }
    },
    /**
     * @description: 根据标签页跳转组件
     * @param {路由地址} path
     * @return {*}
     */
    switchComponent(routerName) {
      //保存当前组件的路由
      this.thisRouterName = routerName;
      this.$router.push({ name: routerName });
    },
    //删除tag标签
    delTagFromArray(tag) {
      //indexOf()在数组中搜索元素并返回其下标 如果要检索的字符串值没有出现，则该方法返回 -1。
      //splice()从数组添加/删除项目，并返回删除的项目(会改变原始数组)
      //this.dynamicTags.splice(2, 1, item1, item2);在位置 2，添加新项目，并删除 1 个项目
      //this.dynamicTags.splice(2, 1);在位置 2，删除 1 个项目
      let index = this.dynamicTags.indexOf(tag);
      this.dynamicTags.splice(index, 1);
      //如果为数组最后一个元素 则直接跳转首页
      if (this.dynamicTags.length == 0) {
        this.redirectIndex();
      } else {
        //判断删掉的标签是否为当前打开的组件
        if (tag.routerName == this.thisRouterName) {
          let element = null;
          //如果为数组最后一个元素则跳转到上一个元素的路由地址 否则跳转到下一个元素的路由地址
          if (this.dynamicTags.length == index) {
            element = this.dynamicTags[index - 1];
          } else {
            element = this.dynamicTags[index];
          }
          this.thisRouterName = element.routerName;
          this.$router.push({
            name: element.routerName,
          });
        }
      }
    },
    //关闭所有标签
    closeAllTags() {
      this.$confirm('是否删除所有标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (this.dynamicTags.length == 0) {
          this.$message({
            type: 'success',
            message: '无可删除的标签！',
          });
        } else {
          this.dynamicTags = [];
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.redirectIndex();
        }
      });
    },
    //重定向到首页
    redirectIndex() {
      this.thisRouterName = 'homeIndex';
      this.$router.push({ name: 'homeIndex' });
    },
    handleOpen() {},
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 7fr;
  grid-column-gap: 3px;
  .main {
    display: grid;
    grid-template-rows: 3fr 17fr;
    .header {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      .header_info {
        flex-grow: 10;
        display: flex;
        flex-direction: row;
        border: 1px solid rgb(214, 184, 184);
        margin-bottom: 5px;
        .title {
          flex-grow: 18;
        }
        .adminInfo {
          flex-grow: 2;
          background-color: pink;
        }
      }
      .header_tab {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        background-color: whitesmoke;
        padding: 2px 10px 2px 10px;
        border: 1px solid rgb(214, 184, 184);
        .tabs {
          width: 94%;
          .el-tag + .el-tag {
            margin-left: 10px;
          }
        }
        .closetabs {
          width: 5%;
        }
      }
    }
    .content {
      border: 1px solid whitesmoke;
      border-radius: 5px;
    }
  }
  .nav {
    a {
      text-decoration: none;
    }
    a:hover {
      color: rgb(171, 48, 187);
    }
  }
}
</style>
