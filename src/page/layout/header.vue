<template>
  <div class=" header">
    <!-- 基本信息区 -->
    <div class="header_info">
      <div class="title">
        <p>书城管理系统</p>
      </div>
      <div class="adminInfo">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
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
      <div class="tabs">
        <el-tabs v-model="getDynamicTags.activeRoute" @tab-remove="removeTab" @tab-click="switchComponent" type="card">
          <el-tab-pane key="homeIndex" label="首页" name="homeIndex" :closable="false"> </el-tab-pane>
          <el-tab-pane
            v-for="tab in getDynamicTags.tabs"
            :key="tab.routeName"
            :label="tab.tabName"
            :name="tab.routeName"
            :closable="true"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="closetabs">
        <el-button size="small" @click="closeTags()">
          <i class="el-icon-close"></i>
          关闭
        </el-button>
      </div>
    </div>
    <!-- 日志详细信息对话框 -->
    <el-dialog
      title="修改登入密码"
      :visible.sync="updateDialog.visible"
      :close-on-click-modal="false"
      width="25%"
      center
    >
      <el-form
        :model="updateForm"
        :rules="updatePwdRules"
        ref="updateForm"
        label-width="100px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="原密码" prop="oldPwd">
          <el-input type="password" v-model="updateForm.oldPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="updateForm.newPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
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
    ...mapGetters({ getDynamicTags: 'tagsView/getDynamicTags', getAdminInfo: 'adminInfo/getAdminInfo' }),
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
    };
  },
  methods: {
    ...mapMutations({
      delTagFromArray: 'tagsView/removeTab',
      closeAllTags: 'tagsView/closeAllTags',
      clearToken: 'token/clearToken',
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
            this.$router.push({ name: 'homeIndex' }); //重定向首页
          }
        }
      });
    },
    //修改密码
    updatePwd(updateForm) {
      let adminInfo = this.getAdminInfo;
      console.log(adminInfo);
      this.$refs[updateForm].validate((valid) => {
        if (valid) {
          this.$api.admin.updatePwd('luo', this.updateForm.oldPwd, this.updateForm.newPwd).then((res) => {
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
    //退出登入(清除Token、断开signalR连接、清除所有标签页、跳转登入页)
    exitLogin() {
      try {
        this.closeAllTags();
        this.clearToken();
        this.$signalR.connection.stop();
        this.$router.push({ name: 'login' });
      } catch (err) {
        console.log(err);
      }
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
  margin-bottom: 10px;
  .header_info {
    height: 120px;
    display: flex;
    flex-direction: row;
    border: 1px solid rgb(214, 184, 184);
    margin-bottom: 5px;
    .title {
      flex-grow: 30;
      p {
        margin-top: 20px;
        font-size: 20px;
        color: rgb(14, 13, 11);
      }
    }
    .adminInfo {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border: 1px solid rgb(245, 238, 238);
    }
  }
  .header_tab {
    display: flex;
    flex-direction: row;
    .tabs {
      width: 95%;
    }
  }
}
</style>
