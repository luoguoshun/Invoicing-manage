<template>
  <div class="purchasOrder">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-dropdown>
          <el-button type="primary" size="mini"> 更多菜单<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="getSubmitOrderList()"> 历史记录 </el-dropdown-item>
            <el-dropdown-item @click.native="getNeedRreviewOrderByUserId()">待办事项</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" size="mini" class="el-icon-check" @click="adoptOrderRequest()" v-show="IsToBeList == true">
          审核
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="rejectOrderRequest()" v-show="IsToBeList == true">
          驳回
        </el-button>
      </div>
      <div class="edit_query">
        <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
        </el-date-picker>
        <el-select size="mini" v-model="queryForm.orderState" placeholder="订单状态">
          <el-option label="待审核" value="2"></el-option>
          <el-option label="已审核" value="3"></el-option>
          <el-option label="已完成" value="5"></el-option>
          <el-option label="部分到货" value="6"></el-option>
        </el-select>
        <el-select size="mini" v-model="queryForm.warehouseId" placeholder="开单仓库">
          <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
        </el-select>
        <el-input v-model="queryForm.approvalName" size="mini" placeholder="请输入开单人"></el-input>
        <el-button type="primary" @click="getSubmitOrderList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
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
      <el-table-column prop="purchaseOrderId" label="采购单编号" width="120" align="center">
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
      <!-- <el-table-column prop="approvalName" label="审批人" align="center"></el-table-column> -->
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
          <el-button type="success " size="mini" @click="openApprovalDetails(scope.row.purchaseOrderId)" plain>审批详情</el-button>
          <el-button type="info" size="mini" @click="showorderDetailDialog(scope.row)" plain>订单详情</el-button>
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
    <el-dialog title="采购单详情" :visible.sync="orderDetailDialog.show" center width="70%">
      <el-divider></el-divider>
      <el-button size="mini" type="primary" @click="orderDetailDialog.show = false" plain>关闭</el-button>
      <el-table :data="orderDetailDialog.orderDetailItems" :header-cell-style="{ 'text-align': 'center' }" border>
        <el-table-column prop="purchaseDetailId" label="采购明细编号" width="120" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.purchaseOrderDetailId }}</el-tag>
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
    <!-- 审核记录对话框 -->
    <el-dialog title="审批记录" center :visible.sync="approvalDetailsDialog.visible" width="30%">
      <el-timeline>
        <el-timeline-item :timestamp="approvalDetailsDialog.approvalDetails.createTime" type="primary" icon="el-icon-more">
          <p>提交人</p>
          {{ approvalDetailsDialog.approvalDetails.applicantName }}
        </el-timeline-item>
        <el-timeline-item
          v-for="(Step, index) in approvalDetailsDialog.approvalDetails.workFlowSteps"
          :key="index"
          :timestamp="Step.completeTime"
          :type="Step.approvalStateStr == '已通过' ? 'success ' : 'danger '"
        >
          <p>审核人:{{ Step.reviewerName }}</p>
          <p>审核结果:{{ Step.approvalStateStr }}</p>
          <p>审核备注:{{ Step.rejectReason }}</p>
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approvalDetailsDialog.visible = false"> 关 闭</el-button>
      </span>
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
      orderDetailDialog: {
        eidtPurchaseOrderId: '',
        show: false,
        orderDetailItems: [],
      },
      approvalDetailsDialog: {
        visible: false,
        approvalDetails: {},
      },
      purchaseOrderIds: [],
      //仓库列表
      warehouseList: [],
      //供应商列表
      supplierList: [],
      IsToBeList: false,
    };
  },
  computed: {},
  methods: {
    loadData() {
      if (this.IsToBeList) {
        this.getNeedRreviewOrderByUserId();
      } else {
        this.getSubmitOrderList();
      }
    },
    //获取提交采购订单列表
    async getSubmitOrderList() {
      this.IsToBeList = false;
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.orderState = queryForm.orderState == '' ? 0 : parseInt(queryForm.orderState);
      queryForm.supplierId = queryForm.supplierId == '' ? 0 : parseInt(queryForm.supplierId);
      await this.$api.purchaseOrder.getSubmitOrderList(queryForm).then((res) => {
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
    //获取登入人需要的审批的采购订单
    async getNeedRreviewOrderByUserId() {
      this.IsToBeList = true;
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.orderState = queryForm.orderState == '' ? 0 : parseInt(queryForm.orderState);
      queryForm.supplierId = queryForm.supplierId == '' ? 0 : parseInt(queryForm.supplierId);
      await this.$api.purchaseOrder.getNeedRreviewOrderByUserId(queryForm).then((res) => {
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
    async getOrderDetailByPurchaseOrderId(purchaseOrderId) {
      await this.$api.purchaseOrder.getOrderDetailByPurchaseOrderId(purchaseOrderId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.orderDetailDialog.orderDetailItems = data;
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
    //获取审批详情
    async getApprovalDetails(projectId) {
      await this.$api.workFlow.getApprovalDetails(projectId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.approvalDetailsDialog.approvalDetails = data;
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
    //获取采购订单选中行的数据
    selectOrderRows(selection) {
      this.purchaseOrderIds = [];
      selection.forEach((element) => {
        this.purchaseOrderIds.push(element.purchaseOrderId);
      });
    },
    //审核
    adoptOrderRequest() {
      let adopt = true;
      if (this.purchaseOrderIds.length == 0) {
        this.$message({
          message: '请选择要审核的采购单',
          type: 'warning',
        });
        return false;
      } else {
        //找出在 采购数据列表ID包含在 purchaseOrderList 里的数据 判断stateStr的值 是否全部是待审核
        this.table.purchaseOrderList.forEach((plan, index) => {
          //adopt = false 说明找到符合的数据 函数返回
          if (adopt == false) {
            return false;
          }
          this.purchaseOrderIds.forEach((purchaseOrderId) => {
            if (plan.purchaseOrderId == purchaseOrderId) {
              //找到不符合的数据 返回 并设置adopt = false
              if (this.table.purchaseOrderList[index]['orderStateStr'] !== '审核中') {
                this.$message({
                  message: '请选择审核中的采购单',
                  type: 'warning',
                });
                adopt = false;
                return false;
              }
            }
          });
        });
      }
      //找不到符合的数据才允许审核
      if (adopt) {
        this.$api.purchaseOrder.adoptOrderRequest(this.purchaseOrderIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('审核失败，服务器未知错误');
          } else {
            this.$message({ message: '已审核！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //驳回
    rejectOrderRequest() {
      this.$prompt('驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '请输入驳回原因',
      })
        .then(({ value }) => {
          let adopt = true;
          if (this.purchaseOrderIds.length == 0) {
            this.$message({
              message: '请选择要审核的采购单',
              type: 'warning',
            });
            return false;
          } else {
            //找出在 采购数据列表ID包含在 purchaseOrderList 里的数据 判断stateStr的值 是否全部是待审核
            this.table.purchaseOrderList.forEach((plan, index) => {
              //adopt = false 说明找到符合的数据 函数返回
              if (adopt == false) {
                return false;
              }
              this.purchaseOrderIds.forEach((purchaseOrderId) => {
                if (plan.purchaseOrderId == purchaseOrderId) {
                  //找到不符合的数据 返回 并设置adopt = false
                  if (this.table.purchaseOrderList[index]['orderStateStr'] !== '审核中') {
                    this.$message({
                      message: '请选择审核中的采购单',
                      type: 'warning',
                    });
                    adopt = false;
                    return false;
                  }
                }
              });
            });
          }
          //找不到符合的数据才允许审核
          if (adopt) {
            this.$api.purchaseOrder.rejectOrderRequest(this.purchaseOrderIds, value).then((res) => {
              let { success, message } = res.data;
              if (!success) {
                console.log(message);
                this.$message.error('驳回失败，服务器未知错误');
              } else {
                this.$message({ message: '已驳回！', type: 'success' });
                this.loadData();
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入',
          });
        });
    },
    //显示采购单子项目
    showorderDetailDialog(row) {
      this.orderDetailDialog.eidtPurchaseOrderId = row.purchaseOrderId;
      this.getOrderDetailByPurchaseOrderId(row.purchaseOrderId);
      this.orderDetailDialog.show = true;
    },
    //查看审批详情
    openApprovalDetails(purchaseOrderId) {
      this.approvalDetailsDialog.visible = true;
      this.getApprovalDetails(purchaseOrderId);
    },
    getElTagClass(row) {
      if (row.orderStateStr == '已审核') {
        return 'success';
      } else if (row.orderStateStr == '审核中') {
        return 'warning';
      } else {
        return '';
      }
    },
  },
  created() {
    if (this.$route.query.IsToBeList) {
      this.IsToBeList = true;
    }
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
    grid-template-columns: 1fr 2fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      grid-gap: 5px;
      justify-content: flex-start; //左对齐lex-end：右对齐 space-between：两端对齐，项目之间的间隔都相等
    }
    .edit_query {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
      grid-column-gap: 5px;
    }
  }
  .dialogSelectInput {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
