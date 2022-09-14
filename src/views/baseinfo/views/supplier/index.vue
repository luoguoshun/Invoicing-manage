<template>
  <div class="supplier_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" round @click="openAddDialog()">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteUsers()" round>
          移除
        </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.supplierType" placeholder="请选择类别">
            <el-option v-for="item in roleTypes" :key="item.roleId" :label="item.name" :value="item.roleId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectsupplier()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.supplierList"
      @row-dblclick="updateDiolog"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
    >
      <el-table-column type="selection" width="45" align="center"> </el-table-column>
      <el-table-column fixed prop="supplierId" label="供应商编号" width="90" align="center"> </el-table-column>
      <el-table-column label="供应商名称" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.supplierName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="supplierAddr" label="供应商地址" width="200" align="center"> </el-table-column>
      <el-table-column prop="leadCadre" label="负责人"> </el-table-column>
      <el-table-column prop="phone" label="联系方式" align="center"> </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.CreateTime) }}
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
    <el-dialog title="供应商信息" center :visible.sync="dialogObject.updateVisible" :close-on-click-modal="false" width="40%">
      <el-form ref="updateform" :model="supplierFrom" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="supplierFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIds">
            <el-checkbox v-for="role in roleTypes" :label="role.roleId" :key="role.roleId">
              {{ role.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input type="text" v-model="supplierFrom.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="text" v-model="supplierFrom.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.updateVisible = false">取 消</el-button>
        <el-button type="success" @click="updateUserInfo()">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户信息对话框 -->
    <el-dialog title="供应商信息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="40%">
      <el-form :model="supplierFrom" :rules="rules" ref="supplierFrom" label-width="80px">
        <el-form-item label="用户Id" prop="userId">
          <el-input v-model="supplierFrom.userId"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="supplierFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="supplierFrom.sex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIds">
            <el-checkbox v-for="role in roleTypes" :label="role.roleId" :key="role.roleId">
              {{ role.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input type="text" v-model="supplierFrom.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="text" v-model="supplierFrom.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="addUser()">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证手机号的规则
    const cheackMobile = (rule, value, callback) => {
      // 手机号一般最小以“13”开头
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error('请输入合法的手机号!'));
    };
    //身份证校验
    const cheackIdNumber = (rule, value, callback) => {
      var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //加权因子
      var arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; //校验码
      if (/^\d{17}\d|x$/i.test(value)) {
        var sum = 0,
          idx;
        for (var i = 0; i < value.length - 1; i++) {
          // 对前17位数字与权值乘积求和
          sum += parseInt(value.substr(i, 1), 10) * arrExp[i];
        }
        // 计算模（固定算法）
        idx = sum % 11;
        // 检验第18为是否与校验码相等
        if (arrValid[idx] == value.substr(17, 1).toUpperCase()) {
          callback();
        } else {
          callback('身份证格式有误');
        }
      } else {
        callback('身份证格式有误');
      }
    };
    //检查用户编号是否存在
    const cheackUserId = (rule, value, callback) => {
      const regUserId = /^[A-Za-z0-9]+$/;
      if (!regUserId.test(value)) {
        return callback(new Error('用户id由英文和数字组成!'));
      } else {
        this.$api.user.checkUserExists(value).then((res) => {
          const { data, success, message } = res.data;
          if (success) {
            return callback();
          }
          callback(new Error('用户Id重复!'));
        });
      }
    };
    return {
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
        supplierType: 0,
      },
      table: {
        supplierList: [],
        total: 0,
      },
      dialogObject: {
        updateVisible: false,
        addVisible: false,
      },
      supplierFrom: {
        userId: '',
        name: '',
        headerImgUrl: '',
        sex: 1,
        IdNumber: '',
        address: '',
        phone: '',
        roleIdStr: '',
        state: 0,
      },
      roleIds: [],
      userIds: [],
      roleTypes: [{ roleId: 0, name: '请选择类型' }],
      rules: {
        name: [
          //^[\u4e00-\u9fa5]{0,}$ 纯汉字
          { required: true, message: '姓名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: cheackMobile, trigger: 'blur' },
        ],
        idCardNumber: [
          { required: true, message: '身份证不能为空', trigger: 'blur' },
          { validator: cheackIdNumber, trigger: 'blur' },
        ],
        userId: [
          { required: true, message: '用户Id不能为空', trigger: 'change' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
          { validator: cheackUserId, trigger: 'blur' },
        ],
      },
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
            this.dialogObject.updateVisible = false;
            this.$message({ message: '导入成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    loadData() {
      this.getSupplierList();
    },
    //获取用户数据
    async getSupplierList() {
      await this.$api.supplier
        .getSupplierList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.supplierType)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          console.log(data);
          this.table.supplierList = data.suppliers;
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
    selectsupplier() {
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.supplierType = 0;
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
    //打开添加弹窗
    openAddDialog() {
      this.dialogObject.addVisible = true;
      this.supplierFrom.userId = '';
      this.supplierFrom.name = '';
      this.supplierFrom.sex = '男';
      this.supplierFrom.address = '';
      this.supplierFrom.phone = '';
      this.roleIds = [];
    },
    addUser() {
      this.$refs['supplierFrom'].validate((valid) => {
        if (valid) {
          const user = {
            userId: this.supplierFrom.userId,
            name: this.supplierFrom.name,
            sex: this.supplierFrom.sex == '男' ? 1 : 2,
            address: this.supplierFrom.address,
            phone: this.supplierFrom.phone,
            roleIds: this.roleIds,
          };
          this.$api.user.addUser(user).then((res) => {
            const { data, success, message } = res.data;
            if (!success) {
              console.log(message);
              return;
            }
            this.$message({ message: '删除成功！', type: 'success' });
            this.dialogObject.addVisible = false;
            this.loadData();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //打开修改弹窗
    updateDiolog(row) {
      this.supplierFrom = { ...row };
      this.dialogObject.updateVisible = true;
    },
    //修改用户数据
    updateUserInfo() {
      const user = {
        userId: this.supplierFrom.userId,
        roleIds: this.roleIds,
        phone: this.supplierFrom.phone,
        address: this.supplierFrom.address,
        sex: this.supplierFrom.sex,
        name: this.supplierFrom.name,
      };
      this.$api.user.updateUser(user).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.dialogObject.updateVisible = false;
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
.supplier_container {
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
