<template>
  <div class="applicationPlan">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-dropdown>
          <el-button type="primary" size="mini"> 更多菜单<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="getPurchasePlanList()"> 历史记录 </el-dropdown-item>
            <el-dropdown-item @click.native="getNeedRreviewPlanByUserId()">待办事项</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" size="mini" @click="adoptPurchaseRequest()" v-show="IsToBeList == true">
          审核
        </el-button>
        <el-button type="danger" size="mini" @click="rejectPurchaseRequest()" v-show="IsToBeList == true">
          驳回
        </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.state" placeholder="申请状态" v-show="IsToBeList == false">
            <el-option label="审核中" value="2"></el-option>
            <el-option label="已审核" value="3"></el-option>
            <el-option label="待引用" value="5"></el-option>
            <el-option label="已引用" value="6"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
          </el-date-picker>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.warehouseId" placeholder="请输入开单仓库">
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.approvalName" size="mini" label-width="80px" placeholder="请输入申请人"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="getPurchasePlanList()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.purchasePlanList"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectPlanRows"
      :row-style="tableRowClassName"
      v-loading="table.loading"
    >
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column label="采购编号" width="120" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.purchaseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stateStr" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.stateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"> </el-table-column>
      <el-table-column prop="applicantName" label="开单人" align="center"></el-table-column>
      <el-table-column prop="approvalName" label="审批人" align="center"></el-table-column>
      <el-table-column prop="transportPrice" label="运输费用" align="center"> </el-table-column>
      <el-table-column prop="otherPrice" label="其他费用" align="center"> </el-table-column>
      <el-table-column prop="purchaseTotalPrice" label="订单总价" align="center"></el-table-column>
      <el-table-column prop="totalCount" label="货品总数" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="140px" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success " size="mini" @click="openApprovalDetails(scope.row.purchaseId)" plain>审批详情</el-button>
          <el-button type="info" size="mini" @click="showPlanDetail(scope.row)" plain>申请详情</el-button>
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
    <!-- 采购计划详情对话框 -->
    <el-dialog title="采购计划详情" :visible.sync="planDetailDiolog.show" center width="70%">
      <el-divider></el-divider>
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
    <!-- 审核记录对话框 -->
    <el-dialog title="审批记录" center :visible.sync="dialogObject.approvalDetails" width="30%">
      <el-timeline>
        <el-timeline-item :timestamp="approvalDetails.createTime" type="primary" icon="el-icon-more">
          <p>提交人</p>
          {{ approvalDetails.applicantName }}
        </el-timeline-item>
        <el-timeline-item
          v-for="(Step, index) in approvalDetails.workFlowSteps"
          :key="index"
          :timestamp="Step.completeTime"
          :type="Step.approvalStateStr == '已通过' ? 'success ' : 'danger '"
        >
          <p>审核人:{{ Step.reviewerName }}</p>
          <p>审核结果:{{ Step.approvalStateStr }}</p>
          <p>审核备注:{{ Step.RejectReason }}</p>
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.approvalDetails = false"> 关 闭</el-button>
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
        approvalName: '',
        state: '',
        IsToBeSubmitted: false,
      },
      //新建采购计划表
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
        purchasePlanList: [],
        total: 0,
        loading: true,
      },
      planDetailDiolog: {
        editPurchaseId: '',
        show: false,
        detailPlanItems: [],
      },
      ToBeListDrawer: {
        show: false,
      },
      //新建采购计划对话框
      applicationPlanDiolog: {
        Visible: false,
        skuQueryForm: {
          page: 1,
          row: 10,
          conditions: '',
          goodsTypeId: '',
        },
        skuTabledata: [],
        tatol: 0,
      },
      dialogObject: {
        updateVisible: false,
        allocationDiolog: false,
        approvalDetails: false,
      },
      purchasePlanIds: [],
      //仓库列表
      warehouseList: [],
      //物品类别列表
      puchasePlanRules: {
        warehouseId: [{ required: true, message: '请选择开单仓库', trigger: 'blur' }],
        supplierId: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
        applicantId: [{ required: true, message: '请选择申请人', trigger: 'blur' }],
      },
      IsToBeList: false,
      approvalDetails: {},
    };
  },
  computed: {},
  methods: {
    tableRowClassName(row, rowIndex) {
      if (rowIndex === 1) {
        return 'background: rgb(194, 173, 135)';
      } else if (rowIndex === 3) {
        return 'background: rgb(194, 173, 135)';
      }
      return '';
    },
    loadData() {
      if (this.IsToBeList) {
        this.getNeedRreviewPlanByUserId();
      } else {
        this.getPurchasePlanList();
      }
      this.getWarehouseList();
    },
    //获取采购计划列表
    async getPurchasePlanList() {
      this.IsToBeList = false;
      var queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.state=queryForm.state == '' ? 0 : parseInt(queryForm.state);
      await this.$api.purchase.getPurchasePlanList(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.purchasePlanList = data.purchase;
        this.table.total = data.count;
        this.table.loading = false;
      });
    },
    // //获取我需要审批的采购计划列表
    async getNeedRreviewPlanByUserId() {
      this.IsToBeList = true;
      this.IsToBeList = false;
      var queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.state=queryForm.state == '' ? 0 : parseInt(queryForm.state);
      await this.$api.purchase.getNeedRreviewPlanByUserId(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.purchasePlanList = data.purchase;
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
    //获取采购计划详细项目列表
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
    //获取指定供应商指定货品数据
    async getSKUListBySupplierId() {
      let supplierId = 0;
      if (this.purchasPlanForm.supplierId == null || this.purchasPlanForm.supplierId == '') {
        supplierId = 0;
      } else {
        supplierId = parseInt(this.purchasPlanForm.supplierId);
      }
      await this.$api.goods.GetSKUListBySupplierId(1, 100, 0, supplierId, this.applicationPlanDiolog.skuQueryForm.conditions).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        console.log(data);
        this.applicationPlanDiolog.skuTabledata = data.goods;
        this.applicationPlanDiolog.tatol = data.count;
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
        this.approvalDetails = data;
      });
    },
    //条数改变
    handleSizeChange(row) {
      this.queryForm.row = row;
      console.log(row);
      this.loadData();
    },
    //页数改变
    handleCurrentChange(page) {
      this.queryForm.page = page;
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.state = '';
      this.queryForm.approvalName = '';
      this.queryForm.warehouseId = '';
      this.queryForm.publicationDates = [];
      this.loadData();
    },
    //修改采购数据
    updatePurchasePlan(row) {
      console.log(row);
      const purchasPlan = {
        purchaseId: row.purchaseId,
        otherPrice: row.otherPrice,
        transportPrice: row.transportPrice,
        remarks: row.remarks,
      };
      this.$api.purchase.updatePurchasePlan(purchasPlan).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error(success);
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.dialogObject.updateVisible = false;
          this.loadData();
        }
      });
    },
    //获取采购计划选中行的数据
    selectPlanRows(selection) {
      this.purchasePlanIds = [];
      selection.forEach((element) => {
        this.purchasePlanIds.push(element.purchaseId);
      });
    },
    //通过采购申请
    adoptPurchaseRequest() {
      let adopt = true;
      if (this.purchasePlanIds.length == 0) {
        this.$message({
          message: '请选择要审核的采购单',
          type: 'warning',
        });
        return false;
      } else {
        //找出在 采购数据列表ID包含在 purchasePlanIds 里的数据 判断stateStr的值 是否全部是待审核
        this.table.purchasePlanList.forEach((plan, index) => {
          //adopt = false 说明找到符合的数据 函数返回
          if (adopt == false) {
            return false;
          }
          this.purchasePlanIds.forEach((purchaseId) => {
            if (plan.purchaseId == purchaseId) {
              //找到不符合的数据 返回 并设置adopt = false
              var state = this.table.purchasePlanList[index]['stateStr'];
              if (state !== '待审核' && state !== '审核中') {
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
        this.$api.purchase.adoptPurchaseRequest(this.purchasePlanIds).then((res) => {
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
    //驳回采购申请
    rejectPurchaseRequest() {
      let adopt = true;
      if (this.purchasePlanIds.length == 0) {
        this.$message({
          message: '请选择要审核的采购单',
          type: 'warning',
        });
        return false;
      } else {
        //找出在 采购数据列表ID包含在 purchasePlanIds 里的数据 判断stateStr的值 是否全部是待审核
        this.table.purchasePlanList.forEach((plan, index) => {
          //adopt = false 说明找到符合的数据 函数返回
          if (adopt == false) {
            return false;
          }
          this.purchasePlanIds.forEach((purchaseId) => {
            if (plan.purchaseId == purchaseId) {
              //找到不符合的数据 返回 并设置adopt = false
              if (this.table.purchasePlanList[index]['stateStr'] !== '待审核') {
                this.$message({
                  message: '请选择待审核的采购单',
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
        this.$api.purchase.rejectPurchaseRequest(this.purchasePlanIds).then((res) => {
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
    },
    //显示采购单子项目
    showPlanDetail(row) {
      this.planDetailDiolog.editPurchaseId = row.purchaseId;
      this.getDetailPlanListByPurchasId(row.purchaseId);
      this.planDetailDiolog.show = true;
    },
    //获取我的待办事项（待审批计划）
    showToBeListDrawer() {
      this.ToBeListDrawer.show = true;
    },
    getElTagClass(row) {
      if (row.stateStr == '已审核') {
        return 'success';
      } else if (row.stateStr == '待审核') {
        return 'warning';
      } else if (row.stateStr == '已引用') {
        return 'info';
      } else {
        return '';
      }
    },
    //查看审批详情
    openApprovalDetails(purchaseId) {
      this.dialogObject.approvalDetails = true;
      this.getApprovalDetails(purchaseId);
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.applicationPlan {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 20px 0px 10px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 1fr 2.5fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      grid-gap: 10px;
    }
    .edit_query {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 2fr 1.5fr 1.5fr 1fr;
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
