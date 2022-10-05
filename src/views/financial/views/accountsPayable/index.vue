<template>
  <div class="accountsPayable">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" @click="openPurchaseOrderDialog()" icon="el-icon-plus">
          引入采购单
        </el-button>
        <el-button type="primary" size="mini">自主开单</el-button>
      </div>
      <div class="edit_query">
        <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
        </el-date-picker>
        <el-select size="mini" filterable v-model="queryForm.supplierId" placeholder="收款方">
          <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId"></el-option>
        </el-select>
        <el-select size="mini" v-model="queryForm.paymentState" placeholder="订单状态">
          <el-option label="待付款" value="1"></el-option>
          <el-option label="已付款" value="2"></el-option>
        </el-select>
        <el-input v-model="queryForm.approvalName" size="mini" label-width="80px" placeholder="请输入开单人编号"></el-input>
        <div class="edit_query_1">
          <el-button type="primary" @click="getPaymentOrderList()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm(1)" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.paymentOrderList"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectOrderRows"
      @row-dbclick="showOrderDetailDialog()"
      v-loading="table.loading"
    >
      <el-table-column label="付款单编号" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>采购单编号: {{ scope.row.projectId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.paymentOrdertId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="paymentStateStr" label="付款订单状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.paymentStateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sourceTypeStr" label="订单来源" align="center"> </el-table-column>
      <el-table-column prop="supplierId" label="收款方编号" align="center"> </el-table-column>
      <el-table-column prop="supplierName" label="收款方名称" align="center"> </el-table-column>
      <el-table-column prop="operationPersonId" label="开单人编号" align="center"></el-table-column>
      <el-table-column prop="paymentTotalPrice" label="应付款金额" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="开单时间" width="140px" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="showOrderDetailDialog(scope.row)" plain>订单详情</el-button>
          <el-button type="info" size="mini" @click="showOrderDetailDialog(scope.row)" plain>付款详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="编辑" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="showPayDialog(scope.row)" plain v-if="scope.row.paymentStateStr == '待付款'">
            付款
          </el-button>
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
    <el-drawer title="采购单详情" :visible.sync="orderDetailDialog.show" center size="70%" direction="rtl">
      <el-button size="mini" type="primary" @click="orderDetailDialog.show = false" plain>关闭</el-button>
      <el-table :data="orderDetailDialog.detailPlanItems" :header-cell-style="{ 'text-align': 'center' }" border>
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
    </el-drawer>
    <!-- 引入采购单对话框 -->
    <el-dialog title="引入采购单" :visible.sync="purchaseOrderDialog.visible" center width="70%" :fullscreen="true">
      <el-divider></el-divider>
      <!-- 操作 -->
      <div class="editbar">
        <div class="edit_btn">
          <el-button type="primary" size="mini" class="el-icon-check" @click="importPurchaseOrder()">
            引入
          </el-button>
        </div>
        <div class="edit_query">
          <el-date-picker
            v-model="purchaseOrderDialog.queryForm.publicationDates"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          >
          </el-date-picker>
          <el-select size="mini" filterable v-model="purchaseOrderDialog.queryForm.supplierId" placeholder="供应商">
            <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId"></el-option>
          </el-select>
          <div class="edit_query_1">
            <el-button type="primary" @click="getNoExecuteOrderList()" size="mini">查找</el-button>
            <el-button type="primary" @click="resetQueryForm(2)" size="mini">重置</el-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
        :data="purchaseOrderDialog.table.purchaseOrderList"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="selectOrderRows"
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
        <el-table-column prop="orderStateStr" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.orderStateStr }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderTypeStr" label="开单类型" align="center"> </el-table-column>
        <el-table-column prop="supplierName" label="收款方" align="center"> </el-table-column>
        <el-table-column prop="operationPersonName" label="开单人" align="center"></el-table-column>
        <el-table-column prop="approvalName" label="审批人" align="center"></el-table-column>
        <el-table-column prop="transportPrice" label="运输费用" align="center"> </el-table-column>
        <el-table-column prop="otherPrice" label="其他费用" align="center"> </el-table-column>
        <el-table-column prop="orderTotalPrice" label="采购总价" align="center"></el-table-column>
        <el-table-column prop="warehouseName" label="接收仓库" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="开单时间" width="138px" align="center">
          <template slot-scope="scope">
            {{ $timeFormat.leaveTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="编辑" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="showOrderDetailDialog(scope.row)" plain>订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="purchaseOrderSizeChange"
          @current-change="purchaseOrderCurrentChange"
          :total="table.total"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="purchaseOrderDialog.queryForm.page"
          :page-size="purchaseOrderDialog.queryForm.row"
          layout="total, sizes, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 付款对话框 -->
    <el-dialog title="付款" :visible.sync="payDialog.visible" center width="40%">
      <el-form ref="form" :model="payForm" label-width="90px" size="mini">
        <el-form-item label="操作人">
          <el-input v-model="payForm.payUserId" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款方编号">
          <el-input v-model="payForm.supplierId" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款方">
          <el-input v-model="payForm.supplierName" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-radio-group v-model="payForm.payType" size="medium">
            <el-radio border label="1">微信</el-radio>
            <el-radio border label="2">支付宝</el-radio>
            <el-radio border label="3">银行卡转账</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="￥应付金额">
          <span style="color:red">
            {{ payForm.paymentTotalPrice }}
          </span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="payDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="paymentOrder()">确 定</el-button>
      </span>
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
        supplierId: '',
        conditions: '',
        paymentState: '',
      },
      //新建应付款订单表
      purchasPlanForm: {
        supplierId: '',
        supplierName: '',
        applicantId: '', //申请人
        applicanName: '',
        remarks: '',
        applicanSKUIds: [],
      },
      table: {
        paymentOrderList: [],
        total: 0,
        loading: true,
      },
      orderDetailDialog: {
        editPurchaseId: '',
        show: false,
        detailPlanItems: [],
      },
      purchaseOrderDialog: {
        visible: false,
        table: {
          purchaseOrderList: [],
          total: 0,
          loading: true,
        },
        queryForm: {
          page: 1,
          row: 10,
          publicationDates: [],
          supplierId: '',
        },
      },
      payDialog: {
        visible: false,
      },
      payForm: {
        paymentOrdertId: '', //要支付的订单
        payType: '1',
        supplierId: '',
        supplierName: '',
        payUserId: '', //支付人
        payUserName: '', //支付人
        payeeName: '', //收款人名称
        paymentTotalPrice: '',
        collectionAccountNo: '', //收款账号
      },
      purchaseOrderIds: [],
      //仓库列表
      warehouseList: [],
      //供应商列表
      supplierList: [],
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getPaymentOrderList();
    },
    //获取提交应付款订单列表
    async getPaymentOrderList() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.supplierId = queryForm.supplierId == '' ? 0 : parseInt(queryForm.supplierId);
      queryForm.paymentState = queryForm.paymentState == '' ? 0 : parseInt(queryForm.paymentState);
      await this.$api.paymentOrder.getPaymentOrderList(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.paymentOrderList = data.paymentOrders;
        this.table.total = data.count;
        this.table.loading = false;
      });
    },
    //获取已完成采购订单列表
    async getNoExecuteOrderList() {
      let queryForm = JSON.parse(JSON.stringify(this.purchaseOrderDialog.queryForm));
      queryForm.supplierId = queryForm.supplierId == '' ? 0 : parseInt(queryForm.supplierId);
      console.log(queryForm);
      await this.$api.purchaseOrder.getNoExecuteOrderList(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.purchaseOrderDialog.table.purchaseOrderList = data.purchaseOrders;
        this.purchaseOrderDialog.table.total = data.count;
      });
    },
    //获取应付款订单详细项目列表
    async getDetailPlanListByPurchasId(purchaseId) {
      await this.$api.purchase.getDetailPlanListByPurchasId(purchaseId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.orderDetailDialog.detailPlanItems = data;
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
    async getSupplierList(purchaseOrderId) {
      this.supplierList = [];
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
    resetQueryForm(editName) {
      if (editName == 1) {
        this.queryForm.supplierId = '';
        this.queryForm.conditions = '';
        this.queryForm.publicationDates = [];
        this.loadData();
      } else {
        this.introducePlanDiolog.planQueryForm.supplierId = '';
        this.introducePlanDiolog.planQueryForm.approvalName = '';
        this.getPassPurchasePlanList();
      }
    },
    //获取应付款订单选中行的数据
    selectOrderRows(selection) {
      this.purchaseOrderIds = [];
      selection.forEach((element) => {
        this.purchaseOrderIds.push(element.purchaseOrderId);
      });
    },
    //显示采购单子项目
    showOrderDetailDialog(row) {
      //通过付款单获取采购单详情 再获取到采购计划详情进行展示
      this.orderDetailDialog.editPurchaseId = row.projectId;
      this.$api.purchaseOrder.getPurcahseOrderByOrderId(row.projectId).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        this.getDetailPlanListByPurchasId(data.purchaseId);
      });
      this.orderDetailDialog.show = true;
    },
    getElTagClass(row) {
      if (row.paymentStateStr == '已付款') {
        return 'success';
      } else if (row.paymentStateStr == '待付款') {
        return 'warning';
      } else {
        return '';
      }
    },
    //引入采购单
    openPurchaseOrderDialog() {
      this.purchaseOrderDialog.visible = true;
      this.getNoExecuteOrderList();
    },
    purchaseOrderSizeChange(row) {
      this.purchaseOrderDialog.queryForm.row = row;
      this.getNoExecuteOrderList();
    },
    purchaseOrderCurrentChange(page) {
      this.purchaseOrderDialog.queryForm.page = page;
      this.getNoExecuteOrderList();
    },
    //引入采购单生成付款单
    importPurchaseOrder() {
      this.$api.paymentOrder.addPaymentOrderByPurchaseOrder(this.purchaseOrderIds).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error(message);
        } else {
          this.$message({
            message: message,
            type: 'success',
          });
          this.purchaseOrderDialog.visible = false;
          this.loadData();
        }
      });
    },
    //付款
    showPayDialog(row) {
      //获取当前登入人信息
      let userInfo = store.getters['userInfo/getUserInfo'];
      this.payDialog.visible = true;
      this.payForm.payUserId = userInfo.userId;
      this.payForm.payUserName = userInfo.name;
      this.payForm.paymentOrdertId = row.paymentOrdertId;
      this.payForm.supplierId = row.supplierId;
      this.payForm.supplierName = row.supplierName;
      this.payForm.paymentTotalPrice = row.paymentTotalPrice;
    },
    paymentOrder() {
      console.log(this.payForm);
      if (this.payForm.payType == '') {
        this.$message({
          message: '请选择支付方式',
          type: 'warning',
        });
      } else {
        let payForm = JSON.parse(JSON.stringify(this.payForm));
        payForm.payType = parseInt(payForm.payType);
        this.$api.paymentOrder.paymentOrder(payForm).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message.error(message);
          } else {
            setTimeout(() => {
              this.$message({
                message: message,
                type: 'success',
              });
              this.payDialog.visible = false;
              this.loadData();
            }, 2000);
          }
        });
      }
    },
  },
  created() {
    this.loadData();
    this.getSupplierList();
  },
};
</script>

<style lang="less" scoped>
.accountsPayable {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 10px 0px;
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
  .dialogSelectInput {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
