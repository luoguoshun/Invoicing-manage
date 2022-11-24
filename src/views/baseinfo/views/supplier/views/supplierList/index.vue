<template>
  <div class="supplier_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="openAddDialog()">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteSupplier()">
          移除
        </el-button>
      </div>
      <div class="edit_query">
        <el-select size="mini" v-model="queryForm.supplierType" placeholder="请选择类别">
          <el-option v-for="item in supplierTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
        </el-select>
        <el-input v-model="queryForm.conditions" size="mini" placeholder="请输入"></el-input>
        <el-button type="primary" @click="getSupplierList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
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
      <el-table-column prop="supplierTypeStr" label="供应商分类" width="150" align="center"></el-table-column>
      <el-table-column prop="supplierAddr" label="供应商地址" width="200" align="center"> </el-table-column>
      <el-table-column prop="leadCadre" label="负责人" align="center"> </el-table-column>
      <el-table-column prop="phone" label="联系方式" align="center"> </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="供应商货品" width="100" align="center">
        <template slot-scope="scope">
          <el-link type="primary" @click="GetSKUListBySupplierId(scope.row.supplierId)">查看</el-link>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="编辑" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateDiolog(scope.row)" icon="el-icon-edit">修改信息</el-button>
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
    <!-- 修改供应商信息对话框 -->
    <el-dialog title="供应商信息" center :visible.sync="dialogObject.updateVisible" :close-on-click-modal="false" width="40%">
      <el-form ref="updateform" :rules="rules" :model="supplierForm" label-width="100px">
        <el-form-item label="供应商编号">
          <el-input v-model="supplierForm.supplierId" disabled></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="supplierForm.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="供应商分类">
          <el-select size="mini" v-model="supplierForm.supplierType" placeholder="请选择">
            <el-option v-for="item in supplierForm.supplierTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商地址" prop="supplierAddr">
          <el-input v-model="supplierForm.supplierAddr"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="leadCadre">
          <el-input v-model="supplierForm.leadCadre"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="supplierForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.updateVisible = false">取 消</el-button>
        <el-button type="success" @click="updateSupplier()">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 添加供应商对话框 -->
    <el-dialog title="供应商信息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="40%">
      <el-form :model="supplierForm" :rules="rules" ref="supplierForm" label-width="100px">
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="supplierForm.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="供应商分类" prop="supplierType">
          <el-select size="mini" v-model="supplierForm.supplierType" placeholder="请选择类别">
            <el-option v-for="item in supplierForm.supplierTypes" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商地址" prop="supplierAddr">
          <el-input v-model="supplierForm.supplierAddr"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="leadCadre">
          <el-input v-model="supplierForm.leadCadre"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="supplierForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog()">取 消</el-button>
        <el-button type="success" @click="addSupplier()">添 加</el-button>
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
    return {
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
        supplierType: 0,
        supplierId: 0,
        supplierAddr: '',
        supplierName: '',
        leadCadre: '',
      },
      table: {
        supplierList: [],
        total: 0,
      },
      dialogObject: {
        updateVisible: false,
        addVisible: false,
      },
      supplierForm: {
        supplierType: 0,
        supplierId: 0,
        supplierAddr: '',
        supplierName: '',
        leadCadre: '',
        phone: '',
        supplierTypes: [{ typeId: 0, typeName: '请选择类型' }],
      },
      supplierIds: [],
      supplierTypes: [{ typeId: 0, typeName: '请选择类型' }],
      rules: {
        supplierType: { required: true, message: '请选择共应商分类', trigger: 'blur' },
        leadCadre: [
          { required: true, message: '负责人不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: cheackMobile, trigger: 'blur' },
        ],
        supplierAddr: [{ required: true, message: '供应商地址不能为空', trigger: 'blur' }],
        supplierName: [{ required: true, message: '供应商名字不能为空', trigger: 'blur' }],
      },
    };
  },
  methods: {
    loadData() {
      this.getSupplierList();
      this.getSupplierTypeList();
    },

    //获取供应商分类
    async getSupplierTypeList() {
      await this.$api.supplier.getSupplierTypeList().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.supplierTypes = data;
        this.supplierForm.supplierTypes = data;
      });
    },

    //获取供应商信息
    async getSupplierList() {
      console.log(this.queryForm.supplierType);
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
    //查看供应商货品
    GetSKUListBySupplierId(supplierId) {
      this.$router.push({
        name: 'supplierSku',
        query: {
          supplierId: supplierId,
        },
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
      this.queryForm.supplierId = 0;
      this.queryForm.supplierAddr = '';
      this.queryForm.supplierName = '';
      this.queryForm.leadCadre = '';
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
      this.supplierIds = [];
      selection.forEach((element) => {
        this.supplierIds.push(element.supplierId);
      });
      console.log(this.supplierIds);
    },
    //删除供应商
    deleteSupplier() {
      if (this.supplierIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.supplier.deleteSupplier(this.supplierIds).then((res) => {
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
      this.supplierForm.supplierType = '';
      this.supplierForm.supplierId = '';
      this.supplierForm.supplierAddr = '';
      this.supplierForm.supplierName = '';
      this.supplierForm.leadCadre = '';
      this.supplierForm.phone = '';
    },
    closeAddDialog(){
      this.dialogObject.addVisible = false;
      this.$refs['supplierForm'].resetFields();
    },
    addSupplier() {
      this.$refs['supplierForm'].validate((valid) => {
        if (valid) {
          const supplier = {
            supplierName: this.supplierForm.supplierName,
            supplierAddr: this.supplierForm.supplierAddr,
            phone: this.supplierForm.phone,
            leadCadre: this.supplierForm.leadCadre,
            supplierType: this.supplierForm.supplierType,
          };
          this.$api.supplier.addSupplier(supplier).then((res) => {
            console.log();
            const { data, success, message } = res.data;
            if (!success) {
              console.log(message);
              return;
            }
            this.$message({ message: '添加成功！', type: 'success' });
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
      //通过传过来的row赋值给supplierForm的时候，supplierForm的supplierTypesStr会被覆盖成单个字符串
      //this.supplierForm = { ...row };
      //通过手动赋值保留了原本的供应商分类数组，通过传过来的供应商分类Id来识别当前的供应商，渲染到下拉框
      this.supplierForm.supplierId = row.supplierId;
      this.supplierForm.supplierAddr = row.supplierAddr;
      this.supplierForm.supplierName = row.supplierName;
      this.supplierForm.supplierType = row.supplierType;
      this.supplierForm.leadCadre = row.leadCadre;
      this.supplierForm.phone = row.phone;
      this.dialogObject.updateVisible = true;
    },
    //修改供应商数据
    updateSupplier() {
      const supplier = {
        supplierId: this.supplierForm.supplierId,
        phone: this.supplierForm.phone,
        supplierAddr: this.supplierForm.supplierAddr,
        supplierName: this.supplierForm.supplierName,
        leadCadre: this.supplierForm.leadCadre,
        supplierType: this.supplierForm.supplierType,
      };
      this.$api.supplier.updateSupplier(supplier).then((res) => {
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
  },
};
</script>

<style lang="less" scoped>
.supplier_container {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 5px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 2fr 1.2fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
    }
    .edit_query {
      width: 100%;
      display: grid;
      grid-template-columns: 2fr 2fr 0.4fr 0.4fr;
      grid-column-gap: 5px;
    }
  }
}
</style>
