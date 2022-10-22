<template>
  <div class=" header">
    <!-- 基本信息区 -->
    <div class="header_info">
      <div class="title">
        <p>翻斗花园进销存管理系统</p>
      </div>
      <div class="user">
        <el-avatar :size="40" :src="userInfo.headerImgUrl" shape="circle"></el-avatar>
        <el-badge :value="messageCount" class="item">
          <el-button size="small" @click="$router.push({ name: 'home' })">通知</el-button>
          <!-- <i class="el-icon-bell"></i> -->
        </el-badge>
        <el-dropdown>
          <el-button type="primary" size="mini"> 更多菜单<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updateDialog.visible = true">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="exitLogin()">退出登入</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>  
      </div>
    </div>
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
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
        <span v-if="index !== 0"> {{ item.meta.title }}</span>
        <!-- <router-link v-if="index!==0" :to="item.path">{{item.meta.title}}</router-link> -->
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 修改登入密码对话框 -->
    <el-dialog title="修改登入密码" :visible.sync="updateDialog.visible" :close-on-click-modal="false" width="30%" center>
      <el-form :model="updateForm" :rules="updatePwdRules" ref="updateForm" label-width="100px" class="demo-ruleForm" status-icon>
        <el-form-item label="原密码" prop="oldPwd" required>
          <el-input type="password" v-model="updateForm.oldPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd" required>
          <el-input type="password" v-model="updateForm.newPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd" required>
          <el-input type="password" v-model="updateForm.confirmPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePwd('updateForm')">提交</el-button>
          <el-button @click="resetForm('updateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
    var checkOldPwd = (value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    var checknewPwd = (value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.updateForm.newPws !== '') this.$refs.updateForm.validateField('checkconfirmPwd');
        callback();
      }
    };
    var checkconfirmPwd = (value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.updateForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      updateDialog: {
        visible: false,
      },
      updateForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
      },
      updatePwdRules: {
        oldPwd: [{ validator: checkOldPwd, trigger: 'blur' }],
        newPwd: [{ validator: checknewPwd, trigger: 'blur' }],
        confirmPwd: [{ validator: checkconfirmPwd, trigger: 'blur' }],
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
      clearToken: 'token/clearToken',
      clearRouters: 'routers/clearRouters',
    }),
    //获取我的消息列表
    async getMessageListByUserId() {
      await this.$api.message.getMessageListByUserId().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        // filter()数组方法不会改变原数组
        this.messageList = data.filter((item) => {
          //符合条件 就添加到新的 filter( ) 方法所创建出来的数组
          return item.messageState == 2 || item.messageState == 3;
        });
      });
    },
    getNewMessageCount() {
      if (this.$signalR.connection['_connectionState'] == 'Connected') {
        this.$signalR.connection.on('SendNewMessageCount', (message) => {
          this.messageCount = message.MessageParameter;
        });
      }
    },
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
    //修改密码
    updatePwd(updateForm) {
      this.$refs[updateForm].validate((valid) => {
        if (valid) {
          this.$api.admin.updatePwd(userInfo.userId, this.updateForm.oldPwd, this.updateForm.newPwd).then((res) => {
            const { data, success, message } = res.data;
            if (success) {
              this.updateDialog.visible = false;
              this.$message({
                message: '修改成功!登入失效,请重新登入！',
                type: 'success',
                center: true,
              });
              this.exitLogin();
            } else {
              this.$message({
                message: message,
                type: 'warning',
                center: true,
              });
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    closeConnection() {
      if (this.$signalR.connection['_connectionState'] !== 'Disconnected') {
        this.$signalR.connection.stop();
      }
    },
    //退出登入(清除Token、断开signalR连接、清除所有标签页、跳转登入页)
    exitLogin() {
      this.closeAllTags();
      this.clearToken();
      this.clearRouters();
      this.closeConnection();
      this.$router.push({ name: 'login' });
    },
    // toHome(){
    //   this.$router.push({ name: 'home' });
    // }
  },
  created() {
    //获取路由内的全部信息
    this.breadcrumbList = this.$route.matched;
    this.getMessageListByUserId();
    this.getNewMessageCount();
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
.header {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  .header_info {
    height: 60px;
    display: flex;
    flex-direction: row;
    background-color: rgb(247, 250, 253);
    margin-bottom: 5px;
    .title {
      flex-grow: 30;
      p {
        margin-top: 10px;
        font-size: 20px;
        color: rgb(14, 13, 11);
      }
    }
    .user {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      grid-gap: 15px;
    }
  }
  .header_tab {
    height: 45px;
    display: grid;
    grid-template-columns: 95% 5%;
    padding-right: 15px;
    margin-bottom: 10px;
    .el-button {
      margin: 10px auto;
      height: 30px;
    }
  }
}
</style>
