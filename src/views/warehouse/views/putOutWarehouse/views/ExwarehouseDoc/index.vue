<template>
  <div class="purchasOrder">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="warning" size="mini" class="el-icon-check" @click="adoptOrderRequest()"> 提交 </el-button>
        <el-button type="primary" size="mini" class="el-icon-check" @click="adoptOrderRequest()"> 编辑 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="rejectOrderRequest()"> 取消 </el-button>
      </div>
      <div class="edit_query">
        <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
        </el-date-picker>
        <el-select size="mini" v-model="queryForm.ExwarehouseState" placeholder="订单状态">
          <el-option label="待编辑" value="2"></el-option>
          <el-option label="已完成" value="3"></el-option>
          <el-option label="已取消" value="4"></el-option>
        </el-select>
        <el-select size="mini" v-model="queryForm.warehouseId" placeholder="请输入开单仓库">
          <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
        </el-select>
        <el-input v-model="queryForm.approvalName" size="mini" label-width="80px" placeholder="请输入开单人"></el-input>
        <el-button type="primary" @click="getExWarehouseOrderList()" size="mini">查找</el-button>
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
      <el-table-column label="出库单号" width="120" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>采购计划编号: {{ scope.row.exwarehouseId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.exwarehouseId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="exwarehouseStateStr" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.exwarehouseStateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="exwarehouseTypeStr" label="类别" align="center"> </el-table-column>
      <el-table-column prop="sourceOrderId" label="来源单号" align="center"> </el-table-column>
      <el-table-column prop="operationPersonId" label="开单人" align="center"></el-table-column>
      <el-table-column prop="approvalPersonId" label="审批人" align="center"></el-table-column>
      <el-table-column prop="exwarehouseCout" label="出库总数" align="center"></el-table-column>
      <el-table-column prop="exGoodsTypeNum" label="货品种类数" align="center"></el-table-column>
      <el-table-column prop="nn" label="物流公司" align="center"> </el-table-column>
      <el-table-column prop="nn" label="物流单号" align="center"> </el-table-column>
      <el-table-column prop="exwarehouseMoney" label="出库总价" align="center"></el-table-column>
      <el-table-column prop="warehouseName" label="出库仓" align="center"></el-table-column>
      <el-table-column prop="postage" label="邮费" align="center"> </el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="制单时间" width="138px" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="exwarehouseTime" label="出库时间" width="138px" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.exwarehouseTime) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success " size="mini" @click="openApprovalDetails(scope.row.purchaseId)" plain>审批详情</el-button>
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
    <!-- 出库单详情 -->
    <el-drawer title="出库单据详情信息" :visible.sync="planDetailDiolog.show" direction="rtl" size="80%">
      <el-button size="mini" type="primary" @click="updatePurchaseDetails()" plain>保存</el-button>
      <el-button size="mini" type="primary" @click="planDetailDiolog.show = false" plain>关闭</el-button>
      <el-table :data="planDetailDiolog.detailPlanItems" :header-cell-style="{ 'text-align': 'center' }" border>
        <el-table-column prop="exwarehouseDeteilId" label="出库详情编号" width="120" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.exwarehouseDeteilId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
        <el-table-column prop="brand" label="品牌" width="120" align="center"> </el-table-column>
        <el-table-column prop="unit" label="单位" width="120" align="center"> </el-table-column>
        <el-table-column prop="wCount" label="库存数量" align="center"></el-table-column>
        <el-table-column prop="count" label="出库数量(可编辑)" align="center">
          <template slot-scope="scope">
            <el-input-number
              type="number"
              size="mini"
              v-model.number="scope.row.count"
              @change="addGoodsCount(scope.$index, scope.row)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="单价(可编辑)" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" placeholder="" type="text"> </el-input>
            <!-- <el-tag type="success">{{ scope.row.price }}</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="remakes" label="备注" align="center"> </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deletePurchaseDetail(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
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
        ExwarehouseId: '',
        ExwarehouseState: '',
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
      orderDetailDiolog: {
        editPurchaseId: '',
        show: false,
        detailPlanItems: [],
      },
      purchaseOrderIds: [],
      OrderState: [],
      //仓库列表
      warehouseList: [],
      //供应商列表
      supplierList: [],
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getExWarehouseOrderList();
    },
    //获取提交采购订单列表
    async getExWarehouseOrderList() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.orderState = queryForm.orderState == '' ? 0 : parseInt(queryForm.orderState);
      queryForm.supplierId = queryForm.supplierId == '' ? 0 : parseInt(queryForm.supplierId);
      queryForm.ExwarehouseState = queryForm.ExwarehouseState == '' ? 0 : parseInt(queryForm.ExwarehouseState);
      await this.$api.exwarehouse.getExWareHouseOrder(queryForm).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        this.table.purchaseOrderList = data.data;
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
        this.orderDetailDiolog.detailPlanItems = data;
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
    //更新采购计划项目
    updatePurchaseDetails() {
      this.planDetailDiolog.detailPlanItems.forEach((item) => {
        this.updateExdetFrom.exwarehouseDeteilIds.push(item.exwarehouseDeteilId);
        this.updateExdetFrom.prices.push(item.price);
        this.updateExdetFrom.count.push(item.count);
      });
      this.$api.exwarehouse.updateExWareHouseDet(this.updateExdetFrom).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error(message);
        } else {
          this.$message({ message: '保存成功！', type: 'success' });
          this.planDetailDiolog.show = false;
          this.loadData();
        }
      });
    },
    //获取采购订单选中行的数据
    selectOrderRows(selection) {
      console.log(selection);
      this.purchaseOrderIds = [];
      this.OrderState = [];
      selection.forEach((element) => {
        this.purchaseOrderIds.push(element.exwarehouseId);
        this.OrderState.push(element.exwarehouseStateStr);
      });
    },
    showplanDetailDiolog(row) {
      console.log(row);
      this.planDetailDiolog.editPurchaseId = row.exwarehouseId;
      this.getExWareHouseDet(row.exwarehouseId);
      this.planDetailDiolog.show = true;
    },
    //获取出库详情信息
    getExWareHouseDet(row) {
      console.log(row);
      const from = {
        ExwarehouseId: row,
        Page: this.queryForm.page,
        row: this.queryForm.row,
      };
      this.$api.exwarehouse.getExWareHouseDet(from).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          this.$message.error(success);
        } else {
          this.planDetailDiolog.detailPlanItems = data.data;
          this.loadData();
        }
      });
    },
    //出库单提交
    adoptOrderRequest() {
      for (let i = 0; i < this.OrderState.length; i++) {
        if (this.OrderState[i] != '审核中') {
          this.$message({
            message: '只能提交审核中的出库单！',
            type: 'warning',
          });
          this.OrderState = [];
          return false;
        }
      }
      if (this.purchaseOrderIds.length == 0) {
        this.$message({
          message: '请选择要提交的出库单',
          type: 'warning',
        });
        return false;
      }
      this.$api.exwarehouse.submitExWarehouseOrder(this.purchaseOrderIds).then((res) => {
        let { success, message } = res.data;
        if (!success) {
          console.log(message);
          this.$message.error(message);
        } else {
          this.$message({ message: '已提交！', type: 'success' });
          this.loadData();
        }
      });
    },
    //驳回
    rejectOrderRequest() {
      if (this.purchaseOrderIds.length == 0) {
        this.$message({
          message: '请选择要取消的出库单',
          type: 'warning',
        });
        return false;
      } else {
        this.$api.exwarehouse.rejectOrderRequest(this.purchaseOrderIds).then((res) => {
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
    showorderDetailDiolog(row) {
      this.orderDetailDiolog.editPurchaseId = row.purchaseId;
      this.getDetailPlanListByPurchasId(row.purchaseId);
      this.orderDetailDiolog.show = true;
    },
    getElTagClass(row) {
      console.log(row);
      if (row.exwarehouseStateStr == '已完成') {
        return 'success';
      } else if (row.exwarehouseStateStr == '待编辑') {
        return 'warning';
      } else if (row.exwarehouseStateStr == '已取消') {
        return 'info';
      }
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
      grid-template-columns: 2fr 2fr 2fr 2fr 0.3fr 0.3fr;
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
