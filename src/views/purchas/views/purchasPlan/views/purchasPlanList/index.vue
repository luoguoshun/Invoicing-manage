<template>
  <div class="purchasPlanList">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-delete">
          新建申请
        </el-button>
        <el-button type="primary" size="mini">
          审批
        </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
          </el-date-picker>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.warehouseId" placeholder="请选择开单仓库">
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.approvalName" size="mini" label-width="80px" placeholder="请输入开单人"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectLog()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="table.purchasPlanList" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column label="采购编号" width="120" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.purchaseId }}</el-tag>
          </template>
        </el-table-column>
      <el-table-column prop="stateStr" label="状态" align="center"></el-table-column>
      <el-table-column prop="applicantName" label="开单人" align="center"></el-table-column>
      <el-table-column prop="approvalName" label="审批人" align="center"></el-table-column>
      <el-table-column prop="transportPrice" label="运输费用" align="center"></el-table-column>
      <el-table-column prop="otherPrice" label="其他费用" align="center"></el-table-column>
      <el-table-column prop="approvalPersonId" label="审批人" align="center"></el-table-column>
      <el-table-column prop="purchasTotalPrice" label="订单总价" align="center"></el-table-column>
      <el-table-column prop="totalCount" label="货品总数" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑"  align="center">
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
    <!-- 修改采购信息对话框 -->
    <el-dialog title="采购信息" center :visible.sync="dialogObject.updateVisible" :close-on-click-modal="false" width="55%">
      <el-form ref="updateform" :model="purchasPlanForm" label-width="80px">
        <el-form-item label="采购Id">
          <el-input v-model="purchasPlanForm.purchasPlanId" disabled></el-input>
        </el-form-item>
        <el-form-item label="采购名称">
          <el-input v-model="purchasPlanForm.name"></el-input>
        </el-form-item>
        <el-form-item label="采购描述">
          <el-input type="textarea" :rows="6" v-model="purchasPlanForm.descripcion" hidden="50px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.updateVisible = false">取 消</el-button>
        <el-button type="success" @click="updatepurchasPlan()">修 改</el-button>
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
        PublicationDates: [],
        warehouseId: '',
        approvalName: '',
        state: 0,
      },
      purchasPlanForm: {
        purchasPlanId: '',
        name: '',
        descripcion: '',
      },
      table: {
        purchasPlanList: [],
        total: 0,
      },
      dialogObject: {
        updateVisible: false,
        allocationDiolog: false,
      },
      purchasPlanIds: [{ '0': '选择仓库' }],
      //仓库列表
      warehouseList: [],
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getPurchasePlanList();
    },
    async getPurchasePlanList() {
      await this.$api.purchase.getPurchasePlanList(this.queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        console.log(data);
        this.table.purchasPlanList = data.purchase;
        this.table.total = data.count;
      });
    },
    //获取仓库列表数据
    async getWarehouseList() {
      await this.$api.warehouse.getWarehouseList(1, 100, '', 0).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.warehouseList = data.warehouses;
      });
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
    resetQueryForm() {
      this.queryForm.state = 0;
      this.queryForm.approvalName = '';
      this.queryForm.warehouseId = '0';
      this.queryForm.publicationDates = [];
      this.loadData();
    },
    //添加采购数据
    addpurchasPlan() {
      const purchasPlan = {
        purchasPlanId: this.purchasPlanForm.purchasPlanId,
        descripcion: this.purchasPlanForm.descripcion,
        name: this.purchasPlanForm.name,
      };
      this.$api.purchas.addpurchasPlan(purchasPlan).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '添加失败！', type: 'error' });
        } else {
          this.$message({ message: '添加成功！', type: 'success' });
          this.dialogObject.createVisible = false;
          this.loadData();
        }
      });
    },
    //打开修改弹窗
    updateDiolog(row) {
      this.purchasPlanForm.purchasPlanId = row.purchasPlanId;
      this.purchasPlanForm.name = row.name;
      this.purchasPlanForm.descripcion = row.descripcion;
      this.dialogObject.updateVisible = true;
    },
    //修改采购数据
    updatepurchasPlan() {
      const purchasPlan = {
        purchasPlanId: this.purchasPlanForm.purchasPlanId,
        descripcion: this.purchasPlanForm.descripcion,
        name: this.purchasPlanForm.name,
      };
      this.$api.purchas.updatepurchasPlan(purchasPlan).then((res) => {
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
    //获取选中行的数据
    selectRows(selection) {
      console.log(selection);
      this.purchasPlanIds = [];
      selection.forEach((element) => {
        this.purchasPlanIds.push(element.purchasPlanId);
      });
      console.log(this.purchasPlanIds);
    },
    //删除采购
    deletepurchasPlanIdById() {
      console.log('asd');
      if (this.purchasPlanIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.purchas.deletepurchasPlanIdById(this.purchasPlanIds).then((res) => {
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
    openAllocationDiolog(row) {
      this.dialogObject.allocationDiolog = true;
      this.purchasPlanForm.purchasPlanId = row.purchasPlanId;
      this.$api.purchas.getAllPermissionsBypurchasPlanId(row['purchasPlanId']).then((res) => {
        const { data, success, message } = res.data;
        //清空选中节点
        this.$refs.routerTree.setCheckedKeys([]);
        if (success) {
          //设置默认选中节点
          this.defaultCheckedKeys = data;
        }
      });
    },
  },
  created() {
    this.loadData();
    this.getWarehouseList();
  },
};
</script>

<style lang="less" scoped>
.purchasPlanList {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 20px 0px 10px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      .upload {
        margin-left: 10px;
      }
    }
    .edit_query {
      width: 100%;
      display: grid;
      grid-template-columns: 2fr 1.5fr 1.5fr 1fr;
      grid-column-gap: 5px;
      .edit_query_1 {
        width: 100%;
        text-align: center;
        div {
          width: 100%;
          color: rgb(0, 153, 255);
        }
      }
    }
  }
}
</style>
