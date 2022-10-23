<template>
  <div class="purchasOrder">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-dropdown>
          <el-button type="primary" size="mini"> 开单申请<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="openIntroducePlanDiolog()"> 引入开单 </el-dropdown-item>
            <el-dropdown-item @click.native="openAppOrderDialog()">自主开单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="warning" size="mini" class="el-icon-check" @click="submitPurchaseOrder()">
          提交
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="cancelOrderRequest()">
          撤销
        </el-button>
      </div>
      <div class="edit_query">
        <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
        </el-date-picker>
        <el-select size="mini" v-model="queryForm.orderState" placeholder="订单状态">
          <el-option label="待提交" value="1"></el-option>
          <el-option label="驳回" value="4"></el-option>
        </el-select>
        <el-select size="mini" v-model="queryForm.warehouseId" placeholder="开单仓库">
          <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
        </el-select>
        <el-input v-model="queryForm.approvalName" size="mini" label-width="80px" placeholder="请输入开单人"></el-input>
        <el-button type="primary" @click="getUnsubmitOrderList()" size="mini">查找</el-button>
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
          <el-button type="info" size="mini" @click="showorderDetailDialog(scope.row)" plain>详情</el-button>
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
        <el-button type="primary" @click="resetPlanQueryForm()" size="mini">重置</el-button>
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
        <el-table-column prop="purchaseTotalPrice" label="订单总价" align="center"></el-table-column>
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
    <!-- 采购开单申请对话框 -->
    <el-dialog id="appOrderDialog" title="采购开单" center :visible.sync="appOrderDialog.visible" :close-on-click-modal="false" :fullscreen="true">
      <el-steps :active="1" style="width:50%;margin:0px auto;">
        <el-step title="步骤 1" description="提交采购单"></el-step>
        <el-step title="步骤 2" description="审核采购单"></el-step>
        <el-step title="步骤 3" description="采购单审核完后待执行"></el-step>
      </el-steps>
      <el-form ref="orderForm" :rules="puchaseOrderRules" :model="appOrderDialog.orderForm" label-width="80px" class="editform">
        <el-form-item label="申请仓库" prop="warehouseId">
          <el-select size="mini" filterable v-model="appOrderDialog.orderForm.warehouseId">
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <el-select size="mini" filterable v-model="appOrderDialog.orderForm.supplierId" @change="supplierOnChange">
            <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applicantName">
          <el-input size="mini" type="text" v-model="appOrderDialog.orderForm.operationPersonName" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注"> <el-input type="textarea" v-model="appOrderDialog.orderForm.remarks"></el-input> </el-form-item>
      </el-form>
      <!-- 费用信息 -->
      <el-descriptions class="margin-top" :column="4" size="mini" style="width:90%" :border="true">
        <el-descriptions-item label="运输费用">
          <el-input size="mini" type="number" v-model="appOrderDialog.orderForm.transportPrice" @change="transportOrotherPriceChange"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="其他费用">
          <el-input size="mini" type="number" v-model="appOrderDialog.orderForm.otherPrice" @change="transportOrotherPriceChange"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="物品总数">
          <el-input size="mini" type="number" v-model="appOrderDialog.orderForm.totalCount" disabled></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="订单总价">
          <el-input size="mini" type="number" v-model="appOrderDialog.orderForm.orderTotalPrice" disabled></el-input>
        </el-descriptions-item>
      </el-descriptions>
      <el-divider></el-divider>
      <div class="appOrderSelectInput">
        <div></div>
        <el-input size="mini" v-model="appOrderDialog.skuQueryForm.conditions" placeholder="请输入物品名称"></el-input>
        <el-select size="mini" v-model="appOrderDialog.skuQueryForm.goodsTypeId" placeholder="物品类型">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
        </el-select>
        <el-button type="primary" @click="getSKUListBySupplierId()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetDialogQueryForm()" size="mini">重置</el-button>
      </div>
      <el-table :data="appOrderDialog.skuTabledata" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectSKURows" border="">
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <template slot-scope="scope">
            <el-image style="width: 60px; height: 50px" :src="scope.row.skuLogoUrl" :preview-src-list="[scope.row.skuLogoUrl]"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="skuId" label="物品编码" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="goodsTypeName" label="类别" align="center"> </el-table-column>
        <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
        <el-table-column prop="needCount" label="采购数量" align="center">
          <template slot-scope="scope">
            <el-input-number
              type="number"
              size="mini"
              v-model.number="scope.row.needCount"
              @change="goodsCountChange(scope.$index, scope.row)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" label="单品进价" align="center"> </el-table-column>
        <el-table-column prop="totalPrice" label="总价" align="center"> </el-table-column>
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
        <el-button @click="appOrderDialog.Visible = false">取 消</el-button>
        <el-button type="success" @click="addPurchaseOrder()">申 请</el-button>
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
      //添加采购单
      appOrderDialog: {
        visible: false,
        skuQueryForm: {
          page: 1,
          row: 10,
          conditions: '',
          goodsTypeId: '',
        },
        //新建采购订单表
        orderForm: {
          warehouseId: '',
          supplierId: '',
          supplierName: '',
          operationPersonId: '', //申请人
          operationPersonName: '',
          otherPrice: 0,
          transportPrice: 0,
          orderTotalPrice: 0,
          totalCount: 0,
          remarks: '',
          purchaseOrderDetails: [],
        },
        skuTabledata: [],
        tatol: 0,
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
      puchaseOrderRules: {
        warehouseId: [{ required: true, message: '请选择开单仓库', trigger: 'blur' }],
        supplierId: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
        applicantId: [{ required: true, message: '请选择申请人', trigger: 'blur' }],
      },
      goodsTypes: [], // 物品类型列表
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
    //获取通过
    async getPassPurchasePlanList() {
      let planQueryForm = JSON.parse(JSON.stringify(this.introducePlanDiolog.planQueryForm));
      planQueryForm.goodsTypeId = planQueryForm.goodsTypeId == '' ? 0 : parseInt(planQueryForm.goodsTypeId);
      planQueryForm.supplierId = planQueryForm.supplierId == '' ? 0 : parseInt(planQueryForm.supplierId);
      await this.$api.purchase.getPassPurchasePlanList(planQueryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        console.log(data.purchase);
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
    //获取指定供应商指定货品数据
    async getSKUListBySupplierId() {
      let supplierId = 0;
      let goodsTypeId = 0;
      if (this.appOrderDialog.orderForm.supplierId != '') {
        supplierId = parseInt(this.appOrderDialog.orderForm.supplierId);
      }
      if (this.appOrderDialog.skuQueryForm.goodsTypeId != '') {
        goodsTypeId = parseInt(this.appOrderDialog.skuQueryForm.goodsTypeId);
      }
      // let skuQueryForm=JSON.parse(JSON.stringify(this.appOrderDialog.skuQueryForm));
      // skuQueryForm.goodsTypeId=skuQueryForm.goodsTypeId==''?0:parseInt(skuQueryForm.goodsTypeId);
      // skuQueryForm.supplierId=skuQueryForm.supplierId==''?0:parseInt(skuQueryForm.supplierId);
      await this.$api.goods.GetSKUListBySupplierId(1, 100, goodsTypeId, supplierId, this.appOrderDialog.skuQueryForm.conditions).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        console.log(data);
        this.appOrderDialog.skuTabledata = data.goods;
        this.appOrderDialog.tatol = data.count;
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
    resetPlanQueryForm() {
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
    //start-----------------申请开单-----------------------
    openAppOrderDialog() {
      let orderForm = this.appOrderDialog.orderForm;
      orderForm.operationPersonId = '';
      orderForm.operationPersonName = '';
      orderForm.warehouseId = '';
      orderForm.supplierId = '';
      orderForm.supplierName = '';
      orderForm.operationPersonId = ''; //申请人
      orderForm.operationPersonName = '';
      orderForm.otherPrice = 0;
      orderForm.transportPrice = 0;
      orderForm.orderTotalPrice = 0;
      orderForm.totalCount = 0;
      orderForm.remarks = '';
      orderForm.purchaseOrderDetails = [];
      this.appOrderDialog.visible = true;
      const userInfo = store.getters['userInfo/getUserInfo'];
      this.appOrderDialog.orderForm.operationPersonId = userInfo.userId || '';
      this.appOrderDialog.orderForm.operationPersonName = userInfo.name || '';
    },
    //重置申请采购计划模态框搜索条件
    resetDialogQueryForm() {
      this.appOrderDialog.skuQueryForm.conditions = '';
      this.appOrderDialog.skuQueryForm.goodsTypeId = '';
      this.getSKUListBySupplierId();
    },
    //对话框表格条数改变
    dialogSizeChange(row) {
      this.appOrderDialog.skuQueryForm.row = row;
      this.getSKUListBySupplierId();
    },
    //对话框表格页数改变
    dialogCurrentChange(page) {
      this.appOrderDialog.skuQueryForm = page;
      this.getSKUListBySupplierId();
    },
    //供应商改变 刷新数据
    supplierOnChange(supplierId) {
      //根据供应商Id值修改供应商名称的值
      this.supplierList.forEach((item, index) => {
        if (item.supplierId == supplierId) {
          this.appOrderDialog.orderForm.supplierName = this.supplierList[index]['supplierName'];
          return true;
        }
      });
      this.getSKUListBySupplierId();
    },
    //获取采购计划选中行的数据
    selectSKURows(selection) {
      this.appOrderDialog.orderForm.purchaseOrderDetails = [];
      let orderTotalPrice = 0; //销售详情单总价之和
      let goodsCount = 0;
      selection.forEach((element) => {
        const orderDetail = {
          skuId: element.skuId,
          purchasePrice: element.purchasePrice, //进价
          count: element['needCount'],
          totalPrice: element['needCount'] * element['purchasePrice'],
          remarks: '',
        };
        element['totalPrice'] = orderDetail['totalPrice'];
        orderTotalPrice += orderDetail['totalPrice'];
        goodsCount += orderDetail['count'];
        this.appOrderDialog.orderForm.purchaseOrderDetails.push(orderDetail);
      });
      //销售单总价=每个销售详情单单的总价之和+（运输费用+其他费用）
      this.appOrderDialog.orderForm.orderTotalPrice =
        orderTotalPrice + parseInt(this.appOrderDialog.orderForm.transportPrice) + parseInt(this.appOrderDialog.orderForm.otherPrice);
      this.appOrderDialog.orderForm.totalCount = goodsCount;
    },
    //数量改变 index 当前操作行的下标 row 当前行
    goodsCountChange(index, row) {
      if (row['needCount'] < 0 || row['needCount'] == null || row['needCount'] == '') {
        this.$message({ message: '数量不应小于等于0', type: 'warning' });
        row['needCount'] = 1;
      }
      let detailTotalPrice = 0; //销售单总价
      let goodsCount = 0;
      //1.获取当前行的数据进行赋值
      this.appOrderDialog.orderForm.purchaseOrderDetails.forEach((item, i) => {
        if (index == i) {
          item['count'] = row['needCount'];
          item['totalPrice'] = row['totalPrice'] = row['needCount'] * row['purchasePrice'];
        }
        //2.计算每个订单的总价 数量
        detailTotalPrice += item['totalPrice'];
        goodsCount += item['count'];
      });
      //计算总数 总利润 总价格
      //销售单总价=每个销售详情单单的总价之和+运输费用+其他费用
      this.appOrderDialog.orderForm.orderTotalPrice =
        parseInt(detailTotalPrice) + parseInt(this.appOrderDialog.orderForm.transportPrice) + parseInt(this.appOrderDialog.orderForm.otherPrice);
      this.appOrderDialog.orderForm.totalCount = goodsCount;
    },
    //运输费用或其他费用改变
    transportOrotherPriceChange() {
      if (this.appOrderDialog.orderForm.transportPrice == '') {
        this.appOrderDialog.orderForm.transportPrice = 0;
      }
      if (this.appOrderDialog.orderForm.otherPrice == '') {
        this.appOrderDialog.orderForm.otherPrice = 0;
      }
      //1.先获取原本的（运输费用+其他费用）
      let transportOrotherPrice = 0;
      let detailTotalPrice = 0; //销售详情单总价
      //2. 计算销售详情单单的总价之和
      this.appOrderDialog.orderForm.purchaseOrderDetails.forEach((item, i) => {
        detailTotalPrice += item['totalPrice'];
      });
      transportOrotherPrice = this.appOrderDialog.orderForm.orderTotalPrice - detailTotalPrice;
      //3.减掉原本的(运输费用+其他费用） 再加上新的(运输费用+其他费用）
      //销售单总价=每个销售详情单单的总价之和+（运输费用+其他费用）
      this.appOrderDialog.orderForm.orderTotalPrice =
        this.appOrderDialog.orderForm.orderTotalPrice -
        parseInt(transportOrotherPrice) +
        parseInt(this.appOrderDialog.orderForm.transportPrice) +
        parseInt(this.appOrderDialog.orderForm.otherPrice);
    },
    //添加采购数据
    addPurchaseOrder() {
      this.$refs['orderForm'].validate((valid) => {
        if (valid) {
          const orderForm = this.appOrderDialog.orderForm;
          if (this.appOrderDialog.orderForm.purchaseOrderDetails.length == 0) {
            this.$message({ message: '请选择商品', type: 'warning' });
          } else {
            let success = true;
            //判断采购计划是否含有采购数量为空的数据
            for (let i = 0; i < this.appOrderDialog.orderForm.purchaseOrderDetails.length; i++) {
              const item = this.appOrderDialog.orderForm.purchaseOrderDetails[i];
              if (item.count == 0 || item.count == NaN) {
                this.$message({ message: '采购单中含有数量为0的数据', type: 'warning' });
                success = false;
                break; //终止所有for循环
              }
            }
            if (success) {
              this.$api.purchaseOrder.addPurchaseOrder(orderForm).then((res) => {
                const { data, success, message } = res.data;
                if (!success) {
                  this.$error(message);
                } else {
                  this.$message({ message: '添加成功！', type: 'success' });
                  this.appOrderDialog.visible = false;
                  this.loadData();
                }
              });
            }
          }
        }
      });
    },
    //end------------------申请开单----------------------------
    //打开引入采购计划单模态框
    openIntroducePlanDiolog() {
      let orderForm = this.introducePlanDiolog.orderForm;
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
    showorderDetailDialog(row) {
      console.log(row);
      this.orderDetailDialog.eidtPurchaseOrderId = row.purchaseOrderId;
      this.getOrderDetailByPurchaseOrderId(row.purchaseOrderId);
      this.orderDetailDialog.show = true;
    },
  },
  created() {
    this.loadData();
    this.getWarehouseList();
    this.getSupplierList();
    this.getGoodInfoType();
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
      grid-template-columns: 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
      grid-column-gap: 5px;
    }
  }
  .editPlanItem {
    position: relative;
    z-index: 999;
    bottom: -120px;
  }
  .dialogSelectInput {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
  #appOrderDialog {
    .editform {
      width: 40%;
      overflow: hidden;
    }
    .appOrderSelectInput {
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: 4fr 1fr 1fr 0.3fr 0.3fr;
      grid-column-gap: 3px;
    }
  }
}
</style>
