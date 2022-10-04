<template>
  <div class="purchasOrder">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-dropdown>
          <el-button type="primary" size="mini"> 开单申请<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="openIntroducePlanDiolog()"> 引入开单 </el-dropdown-item>
            <el-dropdown-item>自主开单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" size="mini" class="el-icon-check" @click="submitPurchaseOrder()">
          提交
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="cancelOrderRequest()">
          撤销
        </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
          </el-date-picker>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.orderState" placeholder="订单状态">
            <el-option label="待提交" value="1"></el-option>
            <el-option label="驳回" value="4"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.warehouseId" placeholder="请输入开单仓库">
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.approvalName" size="mini" label-width="80px" placeholder="请输入开单人"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="getUnsubmitOrderList()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.purchaseOrderList"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectOrderRows"
      v-loading="table.loading"
    >
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column label="采购单编号" width="120" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>采购计划编号: {{ scope.row.purchaseId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.purchaseOrderId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="orderStateStr" label="采购单状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions type="warning" effect="plain">{{ scope.row.orderStateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderTypeStr" label="开单类型" align="center"> </el-table-column>
      <el-table-column prop="supplierName" label="收款方" align="center"> </el-table-column>
      <el-table-column prop="operationPersonName" label="开单人" align="center"></el-table-column>
      <el-table-column prop="approvalName" label="审批人" align="center"></el-table-column>
      <el-table-column prop="transportPrice" label="运输费用" align="center">
        <template slot-scope="scope">
          <el-input type="number" size="mini" v-model.number="scope.row.transportPrice"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="otherPrice" label="其他费用" align="center">
        <template slot-scope="scope">
          <el-input type="number" size="mini" v-model.number="scope.row.otherPrice"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="orderTotalPrice" label="采购单总价" align="center"></el-table-column>
      <el-table-column prop="warehouseName" label="接收仓库" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center">
        <template slot-scope="scope">
          <el-input type="textare" size="mini" v-model.number="scope.row.remarks"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="开单时间" width="138px" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="updatePurchaseOrder(scope.row)" plain>修改</el-button>
          <el-button type="info" size="mini" @click="showplanDetailDiolog(scope.row)" plain>订单详情</el-button>
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
    <!-- 采购单详情 -->
    <el-dialog title="采购单详情" :visible.sync="planDetailDiolog.show" center width="70%">
      <el-divider></el-divider>
      <el-button size="mini" type="primary" @click="planDetailDiolog.show = false" plain>关闭</el-button>
      <el-table :data="planDetailDiolog.detailPlanItems" :header-cell-style="{ 'text-align': 'center' }" border>
        <el-table-column prop="purchaseDetailId" label="采购明细编号" width="120" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.purchaseDetailId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
        <el-table-column label="供应商进价" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.purchasePrice }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="采购数量" align="center"> </el-table-column>
        <el-table-column prop="totalPrice" label="总价" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.totalPrice }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center">
          <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.createTime) }}
        </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 引入计划单对话框 -->
    <el-dialog title="引入采购计划单" center :visible.sync="introducePlanDiolog.Visible" :close-on-click-modal="false" :fullscreen="true">
      <div class="dialogSelectInput">
        <div>
          <el-button type="primary" size="mini" class="el-icon-plus" @click="importPurhaseOrder()"> 引入 </el-button>
        </div>
        <el-select size="mini" filterable v-model="introducePlanDiolog.planQueryForm.supplierId" placeholder="请输入供应商">
          <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId"></el-option>
        </el-select>
        <el-select size="mini" v-model="introducePlanDiolog.planQueryForm.warehouseId" placeholder="请输入开单仓库">
          <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
        </el-select>
        <el-input v-model="introducePlanDiolog.planQueryForm.approvalName" size="mini" label-width="80px" placeholder="请输入申请人"></el-input>
        <el-button type="primary" @click="getPassPurchasePlanList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetDialogQueryForm()" size="mini">重置</el-button>
      </div>
      <el-divider></el-divider>
      <el-table
        :data="introducePlanDiolog.passPlanTabledata"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="selectPassPurchasePlanRows"
        border=""
      >
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column label="采购编号" width="120" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>采购编号: {{ scope.row.purchaseId }}</p>
              <p>申请时间: {{ scope.row.createTime }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag disable-transitions>{{ scope.row.purchaseId }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions type="warning" effect="plain">{{ scope.row.stateStr }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" align="center"> </el-table-column>
        <el-table-column prop="approvalPersonId" label="审批人" align="center"></el-table-column>
        <el-table-column prop="transportPrice" label="运输费用" align="center"> </el-table-column>
        <el-table-column prop="otherPrice" label="其他费用" align="center"> </el-table-column>
        <el-table-column prop="purchasTotalPrice" label="订单总价" align="center"></el-table-column>
        <el-table-column prop="totalCount" label="货品总数" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="140px" align="center">
          <template slot-scope="scope">
            {{ $timeFormat.leaveTime(scope.row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="introducePlanDiolog.Visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store';
export default {
  data() {
    return {
      queryForm: {
        page: 1,
        row: 10,
        publicationDates: [],
        warehouseId: '',
        supplierId: '',
        drawerName: '',
        orderState: '',
      },
      //新建采购订单表
      purchasPlanForm: {
        warehouseId: '',
        supplierId: '',
        supplierName: '',
        applicantId: '', //申请人
        applicanName: '',
        remarks: '',
        applicanSKUIds: [],
      },
      table: {
        purchaseOrderList: [],
        total: 0,
        loading: true,
      },
      planDetailDiolog: {
        editPurchaseId: '',
        show: false,
        detailPlanItems: [],
      },
      //新建采购计划对话框
      introducePlanDiolog: {
        Visible: false,
        planQueryForm: {
          page: 1,
          row: 10,
          supplierId: '',
          warehouseId: '',
          approvalName: '', //申请人
        },
        passPlanTabledata: [],
        tatol: 0,
      },
      purchaseOrderIds: [],
      //要引用的采购计划
      purchaseIds: [],
      //仓库列表
      warehouseList: [],
      //供应商列表
      supplierList: [],
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getUnsubmitOrderList();
    },
    //获取未提交采购订单列表
    async getUnsubmitOrderList() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      if (queryForm.orderState == '') {
        queryForm.orderState = '0';
      }
      if (queryForm.supplierId == '') {
        queryForm.supplierId = '0';
      }
      queryForm.orderState = parseInt(queryForm.orderState);
      queryForm.supplierId = parseInt(queryForm.supplierId);
      console.log(queryForm);
      await this.$api.purchaseOrder.getUnsubmitOrderList(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.purchaseOrderList = data.purchaseOrders;
        this.table.total = data.count;
        this.table.loading = false;
      });
    },
    //获取仓库列表数据
    async getWarehouseList() {
      this.warehouseList = [];
      await this.$api.warehouse.getWarehouseList(1, 100, '', 0).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        data.warehouses.forEach((item) => {
          this.warehouseList.push({ warehouseId: item.warehouseId, warehouseName: item.warehouseName });
        });
      });
    },
    //获取采购订单详细项目列表
    async getDetailPlanListByPurchasId(purchaseId) {
      await this.$api.purchase.getDetailPlanListByPurchasId(purchaseId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.planDetailDiolog.detailPlanItems = data;
      });
    },
    //获取通过
    async getPassPurchasePlanList() {
      let planQueryForm = this.introducePlanDiolog.planQueryForm;
      if (planQueryForm.supplierId == '') {
        planQueryForm.supplierId = 0;
      } else {
        planQueryForm.planQueryForm = parseInt(planQueryForm.supplierId);
      }
      console.log(planQueryForm);
      await this.$api.purchase.getPassPurchasePlanList(planQueryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.introducePlanDiolog.passPlanTabledata = data.purchase;
        this.introducePlanDiolog.total = data.count;
      });
    },
    //构造供应商下拉数据
    async getSupplierList() {
      await this.$api.supplier.constructDropDownData().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        data.forEach((item) => {
          this.supplierList.push({ supplierId: item.supplierId, supplierName: item.supplierName });
        });
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
      this.queryForm.orderState = '';
      this.queryForm.approvalName = '';
      this.queryForm.warehouseId = '';
      this.queryForm.publicationDates = [];
      this.loadData();
    },
    resetDialogQueryForm() {
      this.introducePlanDiolog.planQueryForm.supplierId = '';
      this.introducePlanDiolog.planQueryForm.warehouseId = '';
      this.introducePlanDiolog.planQueryForm.approvalName = '';
      this.getPassPurchasePlanList();
    },
    //获取采购订单选中行的数据
    selectOrderRows(selection) {
      this.purchaseOrderIds = [];
      selection.forEach((element) => {
        this.purchaseOrderIds.push(element.purchaseOrderId);
      });
    },
    //获取通过采购计划行的数据
    selectPassPurchasePlanRows(selection) {
      this.purchaseIds = [];
      selection.forEach((element) => {
        this.purchaseIds.push(element.purchaseId);
      });
    },
    //打开引入采购计划单模态框
    openIntroducePlanDiolog() {
      this.introducePlanDiolog.Visible = true;
      this.getPassPurchasePlanList();
    },
    //引入采购单
    importPurhaseOrder() {
      if (this.purchaseIds.length == 0) {
        this.$message({
          message: '请选择要引入的数据',
          type: 'warning',
        });
      } else {
        this.$api.purchaseOrder.importPurhaseOrder(this.purchaseIds).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message.error(message);
          } else {
            this.$message({
              message: message,
              type: 'success',
            });
            this.introducePlanDiolog.Visible = false;
            this.loadData();
          }
        });
      }
    },
    //提交采购单
    submitPurchaseOrder() {
      if (this.purchaseOrderIds.length == 0) {
        this.$message({
          message: '请选择要提交的数据',
          type: 'warning',
        });
      } else {
        this.$api.purchaseOrder.submitPurchaseOrder(this.purchaseOrderIds).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message.error(message);
          } else {
            this.$message({
              message: message,
              type: 'success',
            });
            this.loadData();
          }
        });
      }
    },
    //撤销采购单
    cancelOrderRequest() {
      if (this.purchaseOrderIds.length == 0) {
        this.$message({
          message: '请选择要提交的数据',
          type: 'warning',
        });
      } else {
        this.$api.purchaseOrder.cancelOrderRequest(this.purchaseOrderIds).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message.error(message);
          } else {
            this.$message({
              message: message,
              type: 'success',
            });
            this.loadData();
          }
        });
      }
    },
    //修改采购单数据
    updatePurchaseOrder(row) {
      const purchasOrder = {
        purchaseOrderId: row.purchaseOrderId,
        otherPrice: row.otherPrice,
        transportPrice: row.transportPrice,
        remarks: row.remarks,
      };
      this.$api.purchaseOrder.updatePurchaseOrder(purchasOrder).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error(success);
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.loadData();
        }
      });
    },
    //显示采购单子项目
    showplanDetailDiolog(row) {
      this.planDetailDiolog.editPurchaseId = row.purchaseId;
      this.getDetailPlanListByPurchasId(row.purchaseId);
      this.planDetailDiolog.show = true;
    },
  },
  created() {
    this.loadData();
    this.getWarehouseList();
    this.getSupplierList();
  },
};
</script>

<style lang="less" scoped>
.purchasOrder {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 5px 0px;
    display: grid;
    grid-template-columns: 0.5fr 1fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      grid-gap: 5px;
      justify-content: flex-start; //左对齐lex-end：右对齐 space-between：两端对齐，项目之间的间隔都相等
    }
    .edit_query {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 2fr 1.5fr;
      grid-column-gap: 5px;
      .edit_query_1:last-child {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    }
  }
  .editPlanItem {
    position: relative;
    z-index: 999;
    bottom: -120px;
  }
  .dialogSelectInput {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
