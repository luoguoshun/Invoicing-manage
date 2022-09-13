<template>
  <div class="user_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" round @click="openCreateDialog()"
          >添加
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteUsers()" round>
          移除
        </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.roleId" placeholder="请选择类别">
            <el-option v-for="item in roleTypes" :key="item.roleId" :label="item.name" :value="item.roleId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectUser()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.userList"
      @row-dblclick="updateDiolog"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
    >
      <el-table-column type="selection" width="45" align="center"> </el-table-column>
      <el-table-column fixed prop="userId" label="编号" width="90" align="center"> </el-table-column>
      <el-table-column label="头像" width="100" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 50px"
            :src="scope.row.headerImgUrl"
            :preview-src-list="[scope.row.headerImgUrl]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="80" align="center">
        <template slot-scope="scope">
          <span style=" color:rgb(0, 153, 255)">
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="80" align="center">
        <template slot-scope="scope">
          <span v-if="(scope.row.sex = 1)">
            男
          </span>
          <span v-else-if="(scope.row.sex = 2)">
            女
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="idNumber" label="身份证号码" width="200" align="center"> </el-table-column>
      <el-table-column prop="address" label="住址" align="center"> </el-table-column>
      <el-table-column prop="phone" label="联系方式" width="120" align="center"> </el-table-column>
      <el-table-column label="角色" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleNames }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150" align="center"> </el-table-column>
      <el-table-column prop="state" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            class="switch"
            :inactive-value="0"
            :active-value="1"
            active-color="rgb(0, 255, 149)"
            inactive-color="rgb(151, 148, 148)"
            v-model="scope.row.state"
            @change="updateUserState(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateDiolog(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="table.total"
        :page-sizes="[5, 10, 15, 20]"
        :current-page="queryForm.page"
        :page-size="queryForm.row"
        layout="total, sizes, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </div>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="用户信息" center :visible.sync="updateDialog.visible" :close-on-click-modal="false" width="40%">
      <el-form ref="updateform" :model="userForm" label-width="80px">
        <el-form-item label="头像">
          <img :src="userForm.headerImgUrl" width="100" height="100" />
          <el-upload ref="upload" action="" :http-request="uploadUserHeaderImg" :auto-upload="false" :limit="1">
            <el-button slot="trigger" size="small" type="primary">
              选取文件
            </el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="$refs.upload.submit()"
              >上传到服务器</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIds">
            <el-checkbox v-for="role in roleTypes" :label="role.roleId" :key="role.roleId">
              {{ role.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input type="text" v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="text" v-model="userForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog.visible = false">取 消</el-button>
        <el-button type="success" @click="updateUserInfo()">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
        roleId: 0,
      },
      table: {
        userList: [],
        total: 0,
      },
      updateDialog: {
        visible: false,
      },
      userForm: {
        userId: '',
        name: '',
        headerImgUrl: '',
        sex: '',
        IdNumber: '',
        address: '',
        phone: '',
        roleIdStr: '',
        state: 0,
      },
      roleIds: [],
      userIds: [],
      roleTypes: [{ roleId: 0, name: '请选择类型' }],
    };
  },
  methods: {
    //导入数据
    importClients(param) {
      if (param.file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为.xlsx 的文件',
        });
      } else {
        const formdata = new FormData();
        formdata.append('file', param.file);
        this.$api.book.importBooks(formdata).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message({ message: message, type: 'error' });
          } else {
            this.updateDialog.visible = false;
            this.$message({ message: '导入成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    loadData() {
      this.getUserList();
    },
    //获取用户数据
    async getUserList() {
      await this.$api.user
        .GetUserList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.roleId)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          console.log(data);
          this.table.userList = data.users;
          this.table.total = data.count;
        });
    },
    //获取角色列表
    async getRoleList() {
      await this.$api.role.getRoleList().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.roleTypes = data;
      });
    },
    //查找用户
    selectUser() {
      this.loadData();
    },
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.roleId = 0;
      this.loadData();
    },
    //条数改变
    handleSizeChange(row) {
      this.queryForm.row = row;
      this.loadData();
    },
    //页数改变
    handleCurrentChange(page) {
      this.queryForm.page = page;
      this.loadData();
    },
    //重置搜索条件
    resetingForm() {
      this.queryForm.conditions = '';
      this.form.flag = 0;
      this.loadData();
    },
    //获取选中行的数据
    selectRows(selection) {
      this.userIds = [];
      selection.forEach((element) => {
        this.userIds.push(element.userId);
      });
      console.log(this.userIds);
    },
    //删除用户
    deleteUsers() {
      if (this.userIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.user.deleteUsersById(this.userIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('删除失败！');
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //打开修改弹窗
    updateDiolog(row) {
      this.userForm = { ...row };
      if (this.userForm.roleIdStr !== null) {
        this.roleIds = this.userForm.roleIdStr.split('、');
      }
      this.updateDialog.visible = true;
    },
    //上传用户头像
    uploadUserHeaderImg(param) {
      if (
        param.file.type != 'image/png' &&
        param.file.type != 'image/gif' &&
        param.file.type != 'image/jpg' &&
        param.file.type != 'image/jpeg'
      ) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为.png .gif .jpg .jpeg的图片',
        });
      } else if (param.file.size / 1024 / 1024 / 2 > 2) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于2M',
        });
      } else {
        //创建FormData对象(键值对集合) 将模型存在FormData中
        const formdata = new FormData();
        formdata.append('file', param.file);
        formdata.append('userId', this.userForm.userId);
        this.$api.user.UploadUserHeadImg(formdata).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message({ message: message, type: 'error' });
            return;
          } else {
            this.updateDialog.visible = false;
            this.$message({ message: '上传成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //修改用户数据
    updateUserInfo() {
      const user = {
        userId: this.userForm.userId,
        roleIds: this.roleIds,
        phone: this.userForm.phone,
        address: this.userForm.address,
        sex: this.userForm.sex,
        name: this.userForm.name,
      };
      this.$api.user.updateUser(user).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.updateDialog.visible = false;
          this.loadData();
        }
      });
    },
    //修改用户状态
    updateUserState(row) {
      this.$api.user.updateUserState(row.userId, row.state).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          if (row.state == 1) {
            this.$message({ message: '开启成功！', type: 'success' });
          } else {
            this.$message({ message: '禁用成功！', type: 'success' });
          }
          this.loadData();
        }
      });
    },
  },
  created() {
    this.loadData();
    this.getRoleList();
  },
};
</script>

<style lang="less" scoped>
.user_container {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 20px 0px 10px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 2fr 1.1fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      div {
        margin-left: 10px;
      }
    }
    .edit_query {
      width: 100%;
      display: grid;
      // border: 1px solid red;
      grid-template-columns: 2fr 2fr 1.5fr;
      grid-column-gap: 5px;
      .edit_query_1 {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
