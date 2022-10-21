<template>
  <div class="warehouseList_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="openDiolog('add', '')">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteWarehouse()">
          移除
        </el-button>
      </div>
      <div class="edit_query">
        <el-select size="mini" v-model="queryForm.WarehouseType" placeholder="请选择类别">
          <el-option v-for="item in warehouseTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
        </el-select>
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        <el-button type="primary" @click="getWarehouseList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.warehouseList"
      @row-dblclick="openDiolog('update')"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
    >
      <el-table-column type="selection" width="45" align="center"> </el-table-column>
      <el-table-column fixed prop="warehouseId" label="编号" width="90" align="center"> </el-table-column>
      <el-table-column label="仓库名" width="80" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.warehouseName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseTypeStr" label="类别" align="center"> </el-table-column>
      <el-table-column prop="leadCadre" label="负责人" align="center"> </el-table-column>
      <el-table-column prop="warehouseAddr" label="仓库" align="center"> </el-table-column>
      <el-table-column prop="phone" label="负责人联系方式" width="120" align="center"> </el-table-column>
      <el-table-column prop="goodsCount" label="仓库物品总数" align="center"> </el-table-column>
      <el-table-column fixed="right" label="库存清单" width="100" align="center">
        <template slot-scope="scope">
          <el-link type="primary" @click="lookSKUList(scope.row.warehouseId)">查看</el-link>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="编辑" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDiolog('update', scope.row)" icon="el-icon-edit">修改</el-button>
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
    <!-- 添加修改仓库信息对话框 -->
    <el-dialog title="仓库信息" center :visible.sync="dialogObject.editVisible" :close-on-click-modal="false" width="40%">
      <el-form ref="warehouseForm" :model="warehouseForm" :rules="rules" label-width="80px">
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="warehouseForm.warehouseName"></el-input>
        </el-form-item>
        <el-form-item label="仓库类别" prop="warehouseType">
          <el-select size="mini" v-model="warehouseForm.warehouseType" placeholder="请选择仓库类别">
            <el-option v-for="item in warehouseTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="负责人" prop="leadCadreId">
          <el-select size="mini" v-model="warehouseForm.leadCadreId" placeholder="请选择负责人">
            <el-option v-for="item in userList" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="联系方式" prop="phone">
          <el-input type="text" v-model="warehouseForm.phone"></el-input>
        </el-form-item> -->
        <el-form-item label="仓库地址">
          <el-input type="text" v-model="warehouseForm.warehouseAddr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.editVisible = false">取 消</el-button>
        <el-button type="success" @click="submitInfo()">提 交</el-button>
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
    //检查仓库编号是否存在
    const cheackWarehouseId = (rule, value, callback) => {
      const regUserId = /^[A-Za-z0-9]+$/;
      if (!regUserId.test(value)) {
        return callback(new Error('仓库编号由英文和数字组成!'));
      } else {
        this.$api.warehouse.checkWarehouseExists(value).then((res) => {
          const { data, success, message } = res.data;
          if (success) {
            return callback();
          }
          callback(new Error('仓库编号重复!'));
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
        editVisible: false,
        editName: '',
      },
      warehouseForm: {
        warehouseId: '',
        warehouseName: '',
        warehouseType: '',
        leadCadreId: '',
        warehouseAddr: '',
        phone: '',
      },
      userList: [],
      warehouseIds: [],
      warehouseTypes: [{ typeId: 0, typeName: '请选择类型' }],
      rules: {
        warehouseId: [
          { required: true, message: '仓库Id不能为空', trigger: 'change' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
          { validator: cheackWarehouseId, trigger: 'blur' },
        ],
        warehouseName: [
          { required: true, message: '仓库名不能为空', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: cheackMobile, trigger: 'blur' },
        ],
        warehouseType: [{ required: true, message: '请选择类别', trigger: 'blur' }],
        leadCadreId: [{ required: true, message: '请选择负责人', trigger: 'blur' }],
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
            this.dialogObject.editVisible = false;
            this.$message({ message: '导入成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    loadData() {
      this.getWarehouseList();
      this.getUsersByRoleId();
    },
    //获取仓库数据
    async getWarehouseList() {
      await this.$api.warehouse
        .getWarehouseList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.WarehouseType)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          this.table.warehouseList = data.warehouses;
          this.table.total = data.count;
        });
    },
    //获取仓库类型列表
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
    //获取所有角色为仓库管理员的仓库
    async getUsersByRoleId() {
      await this.$api.user.getUsersByRoleId('4').then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.userList = data;
      });
    },
    //查找仓库
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
      this.warehouseIds = [];
      selection.forEach((element) => {
        this.warehouseIds.push(element.warehouseId);
      });
    },
    //删除仓库
    deleteWarehouse() {
      if (this.warehouseIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.warehouse.deleteWarehouseById(this.warehouseIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('删除失败！');
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.getWarehouseList();
          }
        });
      }
    },
    addWarehouse() {
      this.$refs['warehouseForm'].validate((valid) => {
        if (valid) {
          const warehouse = {
            warehouseId: this.warehouseForm.warehouseId,
            warehouseType: this.warehouseForm.warehouseType,
            phone: this.warehouseForm.phone,
            warehouseAddr: this.warehouseForm.warehouseAddr,
            leadCadreId: this.warehouseForm.leadCadreId,
            warehouseName: this.warehouseForm.warehouseName,
          };
          this.$api.warehouse.addWarehouses(warehouse).then((res) => {
            const { data, success, message } = res.data;
            if (!success) {
              console.log(message);
              return;
            }
            this.$message({ message: '添加成功！', type: 'success' });
            this.dialogObject.addVisible = false;
            this.getWarehouseList();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    openDiolog(editName, row) {
      switch (editName) {
        case 'add':
          this.warehouseForm.warehouseId = '';
          this.warehouseForm.warehouseType = 1;
          this.warehouseForm.warehouseName = '';
          this.warehouseForm.warehouseAddr = '';
          this.warehouseForm.phone = '';
          this.warehouseForm.leadCadreId = '';
          break;
        case 'update':
          this.warehouseForm = { ...row };
        default:
          break;
      }
      this.dialogObject.editName = editName;
      this.dialogObject.editVisible = true;
    },
    //修改仓库数据
    updateWarehouseInfo() {
      const warehouse = {
        warehouseId: this.warehouseForm.warehouseId,
        warehouseType: this.warehouseForm.warehouseType,
        phone: this.warehouseForm.phone,
        warehouseAddr: this.warehouseForm.warehouseAddr,
        leadCadreId: this.warehouseForm.leadCadreId,
        warehouseName: this.warehouseForm.warehouseName,
      };
      this.$refs['warehouseForm'].validate((valid) => {
        if (valid) {
          this.$api.warehouse.updateWarehouse(warehouse).then((res) => {
            const { data, success, message } = res.data;
            if (!success) {
              this.$message({ message: '修改失败！', type: 'error' });
            } else {
              this.$message({ message: '修改成功！', type: 'success' });
              this.dialogObject.editVisible = false;
              this.getWarehouseList();
            }
          });
        }
      });
    },
    submitInfo() {
      console.log(this.dialogObject.editName);
      if (this.dialogObject.editName == 'add') {
        this.addWarehouse();
      } else {
        this.updateWarehouseInfo();
      }
    },
    //查看库存
    lookSKUList(warehouseId) {
      this.$router.push({
        name: 'warehouseSkuList',
        query: {
          warehouseId: warehouseId,
        },
      });
    },
  },
  created() {
    this.loadData();
    this.getWarehouseTypeList();
  },
};
</script>

<style lang="less" scoped>
.warehouseList_container {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 5px 0px;
    display: grid;
    grid-template-columns: 2fr 1.5fr;
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
      grid-template-columns: 2fr 2fr 0.5fr 0.5fr;
      grid-column-gap: 5px;
    }
  }
}
</style>
