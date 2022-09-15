<template>
  <div class="skuList_container">
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
          <el-select size="mini" v-model="queryForm.WarehouseType" placeholder="请选择类别">
            <el-option v-for="item in warehouseTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectWarehouse()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.skuList"
      @row-dblclick="updateDiolog"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
    >
      <el-table-column type="selection" width="45" align="center"> </el-table-column>
      <el-table-column fixed prop="warehouseId" label="编号" width="90" align="center"> </el-table-column>
      <el-table-column label="仓库名" width="80" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.warehouseName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseTypeStr" label="类别" width="80" align="center"> </el-table-column>
      <el-table-column prop="leadCadre" label="负责人" width="200" align="center"> </el-table-column>
      <el-table-column prop="warehouseAddr" label="住址" align="center"> </el-table-column>
      <el-table-column prop="phone" label="负责联系方式" width="120" align="center"> </el-table-column>
      <el-table-column prop="goodsCount" label="仓库物品总数" align="center"> </el-table-column>
      <el-table-column fixed="right" label="编辑" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateDiolog(scope.row)" icon="el-icon-edit">详细信息</el-button>
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
    <el-dialog title="用户信息" center :visible.sync="dialogObject.updateVisible" :close-on-click-modal="false" width="40%">
      <el-form ref="updateform" :model="skuForm" label-width="80px">
        <el-form-item label="头像">
          <img :src="skuForm.headerImgUrl" width="100" height="100" />
          <el-upload ref="upload" action="" :http-request="uploadUserHeaderImg" :auto-upload="false" :limit="1">
            <el-button slot="trigger" size="small" type="primary">
              选取文件
            </el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="$refs.upload.submit()">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="skuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input type="text" v-model="skuForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="text" v-model="skuForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.updateVisible = false">取 消</el-button>
        <el-button type="success" @click="updateUserInfo()">修 改</el-button>
      </div>
    </el-dialog>

    <!-- 添加用户信息对话框 -->
    <el-dialog title="用户信息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="40%">
      <el-form :model="skuForm" :rules="rules" ref="skuForm" label-width="80px">
        <el-form-item label="用户Id" prop="userId">
          <el-input v-model="skuForm.userId"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="skuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input type="text" v-model="skuForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="text" v-model="skuForm.address"></el-input>
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
        WarehouseType: 0,
      },
      table: {
        userList: [],
        total: 0,
      },
      dialogObject: {
        updateVisible: false,
        addVisible: false,
      },
      skuForm: {
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
      warehouseTypes: [{ typeId: 0, typeName: '请选择类型' }],
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
    loadData() {
      this.getSKUListByWhId();
    },
    //获取用户数据
    async getSKUListByWhId() {
      await this.$api.goods
        .getSKUListByWhId(this.$route.query.warehouseId)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          console.log(data);
          this.table.skuList = data;
        });
    },
    //获取角色列表
    async getWarehouseTypeList() {
      await this.$api.warehouse.getWarehouseTypeList().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.warehouseTypes = data;
      });
    },
    //查找用户
    selectWarehouse() {
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.WarehouseType = 0;
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
        this.userIds.push(element.warehouseId);
      });
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
      this.skuForm.userId = '';
      this.skuForm.name = '';
      this.skuForm.sex = '男';
      this.skuForm.address = '';
      this.skuForm.phone = '';
      this.roleIds = [];
    },
    addUser() {
      this.$refs['skuForm'].validate((valid) => {
        if (valid) {
          const user = {
            userId: this.skuForm.userId,
            name: this.skuForm.name,
            sex: this.skuForm.sex == '男' ? 1 : 2,
            address: this.skuForm.address,
            phone: this.skuForm.phone,
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
    //上传用户头像
    uploadUserHeaderImg(param) {
      if (param.file.type != 'image/png' && param.file.type != 'image/gif' && param.file.type != 'image/jpg' && param.file.type != 'image/jpeg') {
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
        formdata.append('userId', this.skuForm.userId);
        this.$api.user.UploadUserHeadImg(formdata).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message({ message: message, type: 'error' });
            return;
          } else {
            this.dialogObject.updateVisible = false;
            this.$message({ message: '上传成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //打开修改弹窗
    updateDiolog(row) {
      this.skuForm = { ...row };
      if (this.skuForm.roleIdStr !== null) {
        this.roleIds = this.skuForm.roleIdStr.split('、');
      }
      this.dialogObject.updateVisible = true;
    },
    //修改用户数据
    updateUserInfo() {
      const user = {
        userId: this.skuForm.userId,
        roleIds: this.roleIds,
        phone: this.skuForm.phone,
        address: this.skuForm.address,
        sex: this.skuForm.sex,
        name: this.skuForm.name,
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
    this.getWarehouseTypeList();
    console.log(this.$route.query.warehouseId);
  },
};
</script>

<style lang="less" scoped>
.skuList_container {
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
