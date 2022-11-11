<template>
  <div class="content">
    <!-- 标签区 -->
    <div class="header_tab">
      <el-tabs v-model="getDynamicTags.activeRoute" @tab-remove="removeTab" @tab-click="switchComponent" type="card">
        <el-tab-pane key="home" label="首页" name="home" :closable="false"> </el-tab-pane>
        <el-tab-pane v-for="tab in getDynamicTags.tabs" :key="tab.routeName" :label="tab.tabName" :name="tab.routeName" :closable="true">
        </el-tab-pane>
      </el-tabs>
      <el-button type="danger" size="mini" @click="closeTags()">
        <i class="el-icon-close"></i>
        关闭
      </el-button>
    </div>
    <!-- 面包屑 -->
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
        <span v-if="index !== 0"> {{ item.meta.title }}</span>
        <!-- <router-link v-if="index!==0" :to="item.path">{{item.meta.title}}</router-link> -->
      </el-breadcrumb-item>
    </el-breadcrumb>
    <RouterView />
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  computed: {
    //将this.getDynamicTags 映射为 this.$store.getters.getDynamicTags
    ...mapGetters({ getDynamicTags: 'tagsView/getDynamicTags', userInfo: 'userInfo/getUserInfo' }),
  },
  data() {
    return {
      updateDialog: {
        visible: false,
      },
      breadcrumbList: [],
      messageList: [],
      messageCount: 0,
    };
  },
  methods: {
    ...mapMutations({
      delTagFromArray: 'tagsView/removeTab',
      closeAllTags: 'tagsView/closeAllTags',
    }),
    //切换组件
    switchComponent(tab) {
      let routeName = tab.$vnode.data.key;
      if (this.$route.path !== routeName) {
        this.$router.push({ name: routeName });
      }
    },
    //删除tag标签并跳转路由
    removeTab(routeName) {
      this.delTagFromArray(routeName);
      if (this.routeName != '') {
        this.$router.push({ name: this.getDynamicTags.activeRoute });
      }
    },
    //关闭所有标签并重定向
    closeTags() {
      this.$confirm('是否删除所有标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (this.getDynamicTags.tabs.length == 0) {
          this.$message({
            type: 'success',
            message: '无可删除的标签！',
          });
        } else {
          this.closeAllTags();
          if (this.getDynamicTags.tabs.length == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.$router.push({ name: 'home' }); //重定向首页
          }
        }
      });
    },
  },
  created() {
    //获取路由内的全部信息
    this.breadcrumbList = this.$route.matched;
  },
  watch: {
    //监听，实时获取路由变动信息
    $route(to, from) {
      this.breadcrumbList = to.matched;
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  .header_tab {
    height: 45px;
    display: grid;
    grid-template-columns: 96% 4%;
    .el-button {
      margin-top: 10px;
      height: 30px;
    }
  }
  .breadcrumb {
    margin: 10px 0px;
  }
}
</style>
