<template>
  <div class="applicationPlan">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-edit" @click="openApplicationPlanDiolog()">
          新建申请
        </el-button>
        <el-button type="primary" size="mini" class="el-icon-check" @click="submitApplications()">
          提交
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="cancelPurchaseRequest()">
          撤销
        </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
          </el-date-picker>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.warehouseId">
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.approvalName" size="mini" label-width="80px" placeholder="请输入开单人"></el-input>
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
      <el-table-column prop="supplierName" label="供应商" align="center"> </el-table-column>
      <el-table-column prop="applicantName" label="申请人" align="center"></el-table-column>
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
      <el-table-column prop="purchaseTotalPrice" label="订单总价" align="center"></el-table-column>
      <el-table-column prop="totalCount" label="货品总数" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center">
        <template slot-scope="scope">
          <el-input type="textare" rows="2" size="mini" v-model="scope.row.remarks"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="审批详情" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.stateStr === '驳回'" type="success " size="mini" @click="openApprovalDetails(scope.row.purchaseId)" plain>
            审批详情
          </el-button>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="updatePurchasePlan(scope.row)" plain>修改</el-button>
          <el-button type="info" size="mini" @click="showplanDetailDiolog(scope.row)" plain>详情</el-button>
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
    <!-- 采购计划申请对话框 -->
    <el-dialog title="采购计划申请" center :visible.sync="applicationPlanDiolog.Visible" :close-on-click-modal="false" :fullscreen="true">
      <el-form ref="purchasePlanForm" :rules="puchasePlanRules" :model="purchasePlanForm" label-width="80px" class="editform">
        <el-form-item label="申请仓库" prop="warehouseId">
          <el-select size="mini" filterable v-model="purchasePlanForm.warehouseId">
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <el-select size="mini" filterable v-model="purchasePlanForm.supplierId" @change="supplierOnChange">
            <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applicantName">
          <el-input size="mini" type="text" v-model="purchasePlanForm.applicantName" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注"> <el-input type="textarea" v-model="purchasePlanForm.remarks"></el-input> </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="selectInput">
        <div></div>
        <el-input size="mini" v-model="applicationPlanDiolog.skuQueryForm.conditions" placeholder="请输入物品名称"></el-input>
        <el-select size="mini" v-model="applicationPlanDiolog.skuQueryForm.goodsTypeId" placeholder="物品类型">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
        </el-select>
        <el-button type="primary" @click="getSKUListBySupplierId()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetDialogQueryForm()" size="mini">重置</el-button>
      </div>
      <el-divider></el-divider>
      <el-table
        :data="applicationPlanDiolog.skuTabledata"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="selectSKURows"
        border=""
      >
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column prop="skuId" label="物品编码" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="goodsTypeName" label="类别" align="center"> </el-table-column>
        <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
        <el-table-column prop="purchasePrice" label="单品进价" align="center"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="dialogSizeChange"
          @current-change="dialogCurrentChange"
          :total="table.total"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="queryForm.page"
          :page-size="queryForm.row"
          layout="total, sizes, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applicationPlanDiolog.Visible = false">取 消</el-button>
        <el-button type="success" @click="addPurchasePlan()">申 请</el-button>
      </div>
    </el-dialog>
    <!-- 采购计划详情对话框 -->
    <el-drawer title="采购计划详情" :visible.sync="planDetailDiolog.show" direction="rtl" size="70%">
      <el-button size="mini" type="primary" @click="updatePurchaseDetails()" plain>保存</el-button>
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
        <el-table-column prop="count" label="采购数量" align="center">
          <template slot-scope="scope">
            <el-input-number
              type="number"
              size="mini"
              v-model.number="scope.row.count"
              @change="addGoodsCount(scope.$index, scope.row)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总价" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.totalPrice }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
          <template slot-scope="scope">
            <el-input type="textare" rows="2" size="mini" v-model="scope.row.remarks"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center"> </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deletePurchaseDetail(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <!-- 审核记录对话框 -->
    <el-dialog title="审批记录" center :visible.sync="dialogObject.approvalDetails" width="30%">
      <el-timeline>
        <el-timeline-item :timestamp="approvalDetails.createTime" type="primary" icon="el-icon-more">
          <p>提交人: {{ approvalDetails.applicantName }}</p>
        </el-timeline-item>
        <el-timeline-item
          v-for="(Step, index) in approvalDetails.workFlowSteps"
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
        <el-button @click="dialogObject.approvalDetails = false"> 关 闭</el-button>
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
        warehouseId: '',
        approvalName: '',
        state: 0, //待提交
        IsToBeSubmitted: true,
      },
      //新建采购计划表
      purchasePlanForm: {
        warehouseId: '',
        supplierId: '',
        supplierName: '',
        applicantId: '', //申请人
        applicantName: '',
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
      //供应商列表
      supplierList: [],
      //物品类别列表
      goodsTypes: [],
      puchasePlanRules: {
        warehouseId: [{ required: true, message: '请选择开单仓库', trigger: 'blur' }],
        supplierId: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
        applicantId: [{ required: true, message: '请选择申请人', trigger: 'blur' }],
      },
      approvalDetails: {}, //审批详情
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getPurchasePlanList();
      this.getWarehouseList();
    },
    //获取采购计划列表
    async getPurchasePlanList() {
      await this.$api.purchase.getPurchasePlanList(this.queryForm).then((res) => {
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
    //构造供应商下拉数据
    async getSupplierList() {
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
    //获取指定供应商指定货品数据
    async getSKUListBySupplierId() {
      let supplierId = 0;
      let goodsTypeId = 0;
      if (this.purchasePlanForm.supplierId != '') {
        supplierId = parseInt(this.purchasePlanForm.supplierId);
      }
      if (this.applicationPlanDiolog.skuQueryForm.goodsTypeId != '') {
        goodsTypeId = parseInt(this.applicationPlanDiolog.skuQueryForm.goodsTypeId);
      }
      await this.$api.goods
        .GetSKUListBySupplierId(1, 100, goodsTypeId, supplierId, this.applicationPlanDiolog.skuQueryForm.conditions)
        .then((res) => {
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
    //获取物品类型列表
    async getGoodInfoType() {
      await this.$api.goods.getGoodInfoType().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        data.forEach((element) => {
          this.goodsTypes.push({ goodsTypeId: element.goodsTypeId, goodsTypeName: element.goodsTypeName });
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
        this.approvalDetails = data;
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
      this.queryForm.state = 1;
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
    //撤销采购申请
    cancelPurchaseRequest() {
      if (this.purchasePlanIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.purchase.cancelPurchaseRequest(this.purchasePlanIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('撤销失败，服务器未知错误');
          } else {
            this.$message({ message: '撤销成功！', type: 'success' });
            this.planDetailDiolog.show = false;
            this.loadData();
          }
        });
      }
    },
    //显示采购单子项目
    showplanDetailDiolog(row) {
      this.planDetailDiolog.editPurchaseId = row.purchaseId;
      this.getDetailPlanListByPurchasId(row.purchaseId);
      this.planDetailDiolog.show = true;
    },
    //打开申请表模态框
    openApplicationPlanDiolog() {
      this.applicationPlanDiolog.Visible = true;
      const userInfo = store.getters['userInfo/getUserInfo'];
      this.purchasePlanForm.applicantId = userInfo.userId || '';
      this.purchasePlanForm.applicantName = userInfo.name || '';
      // 加载数据
      this.getSupplierList();
      this.getGoodInfoType();
    },
    //重置申请采购计划模态框搜索条件
    resetDialogQueryForm() {
      this.applicationPlanDiolog.skuQueryForm.conditions = '';
      this.applicationPlanDiolog.skuQueryForm.goodsTypeId = 0;
      this.getSKUListBySupplierId();
    },
    //供应商改变 刷新数据
    supplierOnChange(supplierId) {
      //根据供应商Id值修改供应商名称的值
      this.supplierList.forEach((item, index) => {
        if (item.supplierId == supplierId) {
          this.purchasePlanForm.supplierName = this.supplierList[index]['supplierName'];
          return true;
        }
      });
      this.getSKUListBySupplierId();
    },
    //对话框表格条数改变
    dialogSizeChange(row) {
      this.applicationPlanDiolog.skuQueryForm.row = row;
      this.getSKUListBySupplierId();
    },
    //对话框表格页数改变
    dialogCurrentChange(page) {
      this.applicationPlanDiolog.skuQueryForm = page;
      this.getSKUListBySupplierId();
    },
    //获取采购计划选中行的数据
    selectSKURows(selection) {
      this.purchasePlanForm.applicanSKUIds = [];
      selection.forEach((element) => {
        this.purchasePlanForm.applicanSKUIds.push(element.skuId);
      });
      console.log(this.purchasePlanForm.applicanSKUIds);
    },
    //添加采购数据
    addPurchasePlan() {
      this.$refs['purchasePlanForm'].validate((valid) => {
        if (valid) {
          if (this.purchasePlanForm.applicanSKUIds.length == 0) {
            this.$message({ message: '请选择商品', type: 'warning' });
          } else {
            const purchasPlan = {
              applicantId: this.purchasePlanForm.applicantId,
              warehouseId: this.purchasePlanForm.warehouseId,
              supplierId: this.purchasePlanForm.supplierId,
              supplierName: this.purchasePlanForm.supplierName,
              remarks: this.purchasePlanForm.remarks,
              applicanSKUIds: this.purchasePlanForm.applicanSKUIds,
            };
            this.$api.purchase.addPurchasePlan(purchasPlan).then((res) => {
              const { data, success, message } = res.data;
              if (!success) {
                this.$error(message);
              } else {
                this.$message({ message: '添加成功！', type: 'success' });
                this.applicationPlanDiolog.Visible = false;
                this.loadData();
              }
            });
          }
        }
      });
    },
    //添加物品数量触发函数
    addGoodsCount(index, row) {
      this.planDetailDiolog.detailPlanItems[index]['totalPrice'] = row.count * row.purchasePrice;
    },
    //更新采购计划项目
    updatePurchaseDetails() {
      this.$api.purchase.updatePurchaseDetails(this.planDetailDiolog.editPurchaseId, this.planDetailDiolog.detailPlanItems).then((res) => {
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
    //移除采购计划单的子项目
    deletePurchaseDetail(index, row) {
      this.$api.purchase.deletePurchaseDetail(this.planDetailDiolog.editPurchaseId, row.purchaseDetailId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error(message);
        } else {
          this.$message({ message: '移除成功！', type: 'success' });
          this.planDetailDiolog.show = false;
          this.loadData();
        }
      });
    },
    //提交采购申请
    async submitApplications() {
      let success = true;
      if (this.purchasePlanIds.length == 0) {
        this.$message({ message: '请选择提交的计划', type: 'warning' });
      } else {
        //判断采购计划是否含有采购数量为空的数据
        for (let index = 0; index < this.purchasePlanIds.length; index++) {
          const purchaseId = this.purchasePlanIds[index];
          //获取当前采购计划单详情
          await this.getDetailPlanListByPurchasId(purchaseId);
          for (let i = 0; i < this.planDetailDiolog.detailPlanItems.length; i++) {
            const item = this.planDetailDiolog.detailPlanItems[i];
            if (item.count == 0) {
              this.$message({ message: '采购计划含有采购数量为空的数据', type: 'warning' });
              success = false;
              return; //终止所有for循环
            }
          }
        }
        if (success) {
          this.$api.purchase.submitApplications(this.purchasePlanIds).then((res) => {
            const { data, success, message } = res.data;
            if (!success) {
              this.$message.error(message);
            } else {
              this.$message({ message: '提交成功！', type: 'success' });
              this.planDetailDiolog.show = false;
              this.loadData();
            }
          });
        }
      }
    },
    //查看审批详情
    openApprovalDetails(purchaseId) {
      this.dialogObject.approvalDetails = true;
      this.getApprovalDetails(purchaseId);
    },
    getElTagClass(row) {
      if (row.stateStr == '驳回') {
        return 'danger';
      } else {
        return '';
      }
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
  .editform {
    width: 40%;
    overflow: hidden;
  }
  .selectInput {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
