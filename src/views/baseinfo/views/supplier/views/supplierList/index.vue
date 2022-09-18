<template>
  <div class="supplier_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" round @click="openAddDialog()">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteSupplier()" round>
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
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border="">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="spuId" label="物品编码" align="center"> </el-table-column>
      <el-table-column prop="skuId" label="物品编码" align="center"> </el-table-column>
      <el-table-column prop="spuName" label="物品名称" align="center"> </el-table-column>
      <el-table-column prop="typeStr" label="物品分类" align="center"> </el-table-column>
      <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.createTime) }}
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
    <!-- 添加供应商货品对话框 -->
    <el-dialog title="供应商信息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="40%">
      <el-form :model="supplierForm" :rules="rules" ref="supplierForm" label-width="100px">
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="supplierForm.supplierName"></el-input>
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
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="addSupplier()">添 加</el-button>
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
        GoodsName: '',
        GoodsType: 0,
        WarehouseId: '',
        SupplierId: '',
        conditions:'',
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
        GoodsName:'',
        GoodsType: 0,
        WarehouseId: '',
        SupplierId: 0,
      },
      supplierIds: [],
      rules: {
        leadCadre: [
          { required: true, message: '负责人不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
        ],
        supplierAddr: [{ required: true, message: '供应商地址不能为空', trigger: 'blur' }],
        supplierName: [{ required: true, message: '供应商名字不能为空', trigger: 'blur' }],
      },
    };
  },
  methods: {
    loadData() {
      this.GetSKUListBySupplierId();
    },
    //根据供应商id获取供应商货品数据
    async GetSKUListBySupplierId() {
      await this.$api.goods
        .GetSKUListBySupplierId(
          this.queryForm.page,
          this.queryForm.row,
          this.queryForm.GoodsName,
          this.queryForm.GoodsType,
          this.queryForm.WarehouseId,
          this.$route.query.supplierId,
        )
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          console.log(data);
          this.table.supplierList = data.goods;
          this.table.total = data.count;
        });
    },
    //查看供应商货品
    lookSupplier(supplierId) {
      this.$router.push({
        name: 'supplierList',
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
    //删除供应商货品
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
    addSupplier() {
      this.$refs['supplierForm'].validate((valid) => {
        if (valid) {
          const supplier = {
            supplierName: this.supplierForm.supplierName,
            supplierAddr: this.supplierForm.supplierAddr,
            phone: this.supplierForm.phone,
            leadCadre: this.supplierForm.leadCadre,
            supplierType: 0,
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
