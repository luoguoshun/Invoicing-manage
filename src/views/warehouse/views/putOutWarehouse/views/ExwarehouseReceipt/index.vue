<template>
  <div class="applicationPlan">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-edit" @click="openApplicationPlanDiolog()"> 新建申请 </el-button>
        <el-button type="primary" size="mini" class="el-icon-check" @click="submitApplications()"> 提交 </el-button>
      </div>
      <div class="edit_query">
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
      <el-table-column label="出库编号" width="120" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.exwarehouseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="exwarehouseStateStr" label="状态" align="center"> </el-table-column>
      <el-table-column prop="warehouseName" label="出库仓" align="center"> </el-table-column>
      <el-table-column prop="operationPersonId" label="申请人" align="center"></el-table-column>
      <el-table-column prop="exwarehouseMoney" label="订单总价" align="center"></el-table-column>
      <el-table-column prop="exwarehouseCout" label="货品总数" align="center"></el-table-column>
      <el-table-column prop="remakes" label="备注" align="center">
        <template slot-scope="scope">
          <el-input type="textare" rows="2" size="mini" v-model="scope.row.remakes"></el-input>
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
    <!-- 出库开单添加物品模态框 -->
    <el-dialog title="出库开单" center :visible.sync="applicationPlanDiolog.Visible" :close-on-click-modal="false" :fullscreen="true">
      <el-form ref="purchasePlanForm" :rules="puchasePlanRules" :model="purchasePlanForm" label-width="80px" class="editform">
        <div style="float: left">
          <el-form-item label="申请仓库" prop="supplierId">
            <el-select size="mini" filterable v-model="purchasePlanForm.warehouseId" @change="getSKUListByWarehouseId">
              <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库原因" prop="warehouseId">
            <el-select size="mini" filterable v-model="purchasePlanForm.exwarehouseTypeId" @change="ExwarehouseTypeIdOnChange">
              <el-option v-for="item in exwarehouseTypeList" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="申请人" prop="applicanName">
            <el-input size="mini" type="text" v-model="purchasePlanForm.applicanName" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注"> <el-input type="textarea" v-model="purchasePlanForm.remarks"></el-input> </el-form-item>
        </div>
        <div style="float: right">
          <el-form-item label="邮费" prop="postage">
            <el-input v-model="purchasePlanForm.postage" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="选择部门" prop="supplierId" v-model="showDep" v-if="this.showDep">
            <el-select size="mini" filterable v-model="purchasePlanForm.departmentId">
              <el-option v-for="item in depList" :key="item.depId" :label="item.depName" :value="item.depId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原始单" prop="supplierId" v-if="this.SourceDocNo">
            <el-badge is-dot class="item">
              <el-button type="info" size="mini" @click="OpenSalesDiolog()">引入</el-button>
            </el-badge>
          </el-form-item>
        </div>
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
        <el-table-column prop="brand" label="品牌" align="center"> </el-table-column>
        <el-table-column prop="typeStr" label="类别" align="center"> </el-table-column>
        <el-table-column prop="count" label="库存" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.count }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="warnCount" label="警告库存" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions type="danger">{{ scope.row.warnCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
        <el-table-column prop="price" label="单品进价" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.price }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="dialogSizeChange"
          @current-change="dialogCurrentChange"
          :total="this.applicationPlanDiolog.tatol"
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
        <el-button type="success" @click="addExwareHousePlan()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 引入销售单模态框 -->
    <el-dialog title="引入销售单出库" center :visible.sync="importSalesDiolog.Visible" :close-on-click-modal="false" :fullscreen="true">
      <el-form ref="importSalesDiolog" :model="purchasePlanForm" label-width="80px" class="editform"> </el-form>
      <el-divider></el-divider>
      <div class="selectInput">
        <div></div>
      </div>
      <el-divider></el-divider>
      <el-table
        :data="importSalesDiolog.SalesTabledata"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="selectSalesRows"
        border=""
      >
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column prop="salesId" label="销售单编号" width="120" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>销售计划编号: {{ scope.row.salesId }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag disable-transitions>{{ scope.row.salesId }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="salesStateStr" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.salesStateStr }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="salesTypeStr" label="销售类型" align="center"> </el-table-column>
        <el-table-column prop="payTypeStr" label="支付方式" align="center"> </el-table-column>
        <el-table-column prop="logisticsCompanyStr" label="物流公司" align="center"></el-table-column>
        <el-table-column prop="applicantName" label="业务员" align="center"></el-table-column>
        <el-table-column prop="goodsTotalCount" label="物品总数" align="center"></el-table-column>
        <el-table-column prop="arrivalCount" label="到货总数" align="center"></el-table-column>
        <el-table-column prop="warehouseName" label="出货仓库" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
        <el-table-column prop="createTime" label=" 顾客信息" width="120px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showClientInfo(scope.row)" plain>查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="销售单据" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="createSalesNoteBysalesId(scope.row)" plain>点击生成</el-button>
            <el-button type="success" size="mini" @click="lookCreateSalesNote(scope.row)" plain>查看</el-button>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="编辑" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="openApprovalDetails(scope.row.salesId)" plain>审核详情</el-button>
            <el-button type="info" size="mini" @click="showsalesDetailDiolog(scope.row)" plain>订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="dialogSizeChange"
          @current-change="dialogCurrentChange"
          :total="this.applicationPlanDiolog.tatol"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="queryForm.page"
          :page-size="queryForm.row"
          layout="total, sizes, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importSalesDiolog.Visible = false" >取 消</el-button>
        <el-button type="success" @click="addExwareHousePlan()">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer title="编辑出库开单信息" :visible.sync="planDetailDiolog.show" direction="rtl" size="80%">
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
        ExwarehouseState: 1, //待引用
        IsToBeSubmitted: true,
      },
      SalequeryForm: {
        page: 1,
        row: 10,
        publicationDates: [],
        warehouseId: '', //出货仓库
        conditions: '', //综合条件
        salesType: '', //销售类型
        logisticsCompany: '', // 物流公司
        salesState: 4, //销售单状态
      },
      //新建采购计划表
      purchasePlanForm: {
        warehouseId: '',
        departmentId: '',
        applicantId: '', //申请人
        applicanName: '',
        remarks: '',
        postage: 0.0,
        exwarehouseTypeId: '',
        applicanSKUIds: [],
        skuPrices: [],
        logisticsCompany: '',
        salesId:'',//销售id
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
      importSalesDiolog: {
        Visible: false,
        SaleQueryForm: {
          page: 1,
          row: 10,
          conditions: '',
          goodsTypeId: '',
        },
        SalesTabledata: [],
        tatol: 0,
      },
      dialogObject: {
        updateVisible: false,
        allocationDiolog: false,
      },
      purchaseIds: [],
      //仓库列表
      exwarehouseTypeList: [],
      warehouseList: [],
      depList: [],
      //供应商列表
      supplierList: [],
      //物品类别列表
      goodsTypes: [],
      puchasePlanRules: {
        //warehouseId: [{ required: true, message: '请选择开单仓库', trigger: 'blur' }],
        //supplierId: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
        applicantId: [{ required: true, message: '请选择申请人', trigger: 'blur' }],
      },
      showDep: false,
      SourceDocNo: false,
      updateExdetFrom: {
        exwarehouseDeteilIds: [],
        prices: [],
        count: [],
      },
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getPurchasePlanList();
      this.getExWarehouseTypeList();
      this.getWarehouseList();
      this.getDepartmentList();
    },
    //获取开单计划列表
    async getPurchasePlanList() {
      await this.$api.exwarehouse.getExWareHouseOrder(this.queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.purchasePlanList = data.data;
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
    //获取提交销售订单列表
    async getSalesList() {
      let queryForm = JSON.parse(JSON.stringify(this.SalequeryForm));
      queryForm.salesState = queryForm.salesState == '' ? 0 : parseInt(queryForm.salesState);
      await this.$api.sales.getSalesList(queryForm).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        this.importSalesDiolog.SalesTabledata = data.sales;
        this.importSalesDiolog.tatol = data.count;
        this.table.loading = false;
      });
    },
    //获取销售订单详细项目列表
    getSalesDatailBySalesId(salesId) {
      this.$api.sales.getSalesDatailBySalesId(salesId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.salesDetailDiolog.salesDetails = data;
      });
    },
    //获取部门列表
    async getDepartmentList() {
      this.depList = [];
      await this.$api.department.GetDepartmentList().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        data.forEach((item) => {
          this.depList.push({ depId: item.departmentId, depName: item.departmentName });
        });
      });
    },
    //获取出库类型
    async getExWarehouseTypeList() {
      this.exwarehouseTypeList = [];
      await this.$api.exwarehouse.getExWareHouseType().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        data.forEach((item) => {
          this.exwarehouseTypeList.push({ typeId: item.typeId, typeName: item.typeName });
        });
      });
    },
    //出库类型下拉框修改
    ExwarehouseTypeIdOnChange() {
      if (this.purchasePlanForm.exwarehouseTypeId == 2) {
        this.showDep = false;
      } else {
        this.showDep = true;
      }
      if (this.purchasePlanForm.exwarehouseTypeId == 1) {
        this.SourceDocNo = false;
      } else {
        this.SourceDocNo = true;
      }
    },
    //获取指定仓库指定货品数据
    async getSKUListByWarehouseId() {
      await this.$api.goods.getSKUListByWhId(1, 100, this.purchasePlanForm.warehouseId, 'asd', 0).then((res) => {
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
    //获取采购计划选中行的数据
    selectPlanRows(selection) {
      this.purchaseIds = [];
      console.log(selection);
      selection.forEach((element) => {
        this.purchaseIds.push(element.exwarehouseId);
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
      console.log(row);
      this.planDetailDiolog.editPurchaseId = row.exwarehouseId;
      this.getExWareHouseDet(row.exwarehouseId);
      this.planDetailDiolog.show = true;
    },
    //获取出库详情信息
    getExWareHouseDet(row) {
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
    //打开申请表模态框
    openApplicationPlanDiolog() {
      this.applicationPlanDiolog.Visible = true;
      const userInfo = store.getters['userInfo/getUserInfo'];
      this.purchasePlanForm.applicantId = userInfo.userId || '';
      this.purchasePlanForm.applicanName = userInfo.name || '';
      this.updateExdetFrom.count = [];
      this.updateExdetFrom.prices = [];
      this.showDep = false;
      this.updateExdetFrom.exwarehouseDeteilIds = [];
      // 加载数据
      this.getSupplierList();
      this.getGoodInfoType();
    },
    //打开引入销售单模态框
    OpenSalesDiolog() {
      this.importSalesDiolog.Visible = true;
      this.getSalesList();
      const userInfo = store.getters['userInfo/getUserInfo'];
    },
    //重置申请采购计划模态框搜索条件
    resetDialogQueryForm() {
      this.applicationPlanDiolog.skuQueryForm.conditions = '';
      this.applicationPlanDiolog.skuQueryForm.goodsTypeId = 0;
      this.getSKUListBySupplierId();
    },
    //供应商改变 刷新数据
    supplierIdOnChange(supplierId) {
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
    //获取入库计划选中行的数据
    selectSKURows(selection) {
      this.purchasePlanForm.applicanSKUIds = [];
      (this.purchasePlanForm.skuPrices = []),
        selection.forEach((element) => {
          this.purchasePlanForm.applicanSKUIds.push(element.skuId);
          this.purchasePlanForm.skuPrices.push(element.price);
        });
      console.log(this.purchasePlanForm.applicanSKUIds);
    },
    //获取采购计划选中行的数据
    selectSalesRows(selection) {
      console.log(selection);
      this.purchasePlanForm.applicanSKUIds = [];
      (this.purchasePlanForm.skuPrices = []),
        selection.forEach((element) => {
          this.purchasePlanForm.applicanSKUIds.push(element.skuId);
          this.purchasePlanForm.skuPrices.push(element.price);
          this.purchasePlanForm.salesId=element.salesId;
        });
      console.log(this.purchasePlanForm.applicanSKUIds);
    },
    //添加出库计划数据
    addExwareHousePlan() {
      this.$refs['purchasePlanForm'].validate((valid) => {
        if (valid) {
          if (this.purchasePlanForm.applicanSKUIds.length == 0) {
            this.$message({ message: '请选择商品', type: 'warning' });
          } else {
            const ExPlan = {
              applicantId: this.purchasePlanForm.applicantId,
              warehouseId: this.purchasePlanForm.warehouseId,
              remakes: this.purchasePlanForm.remarks,
              departmentId: this.purchasePlanForm.departmentId,
              exwarehouseType: this.purchasePlanForm.exwarehouseTypeId,
              applicanSKUIds: this.purchasePlanForm.applicanSKUIds,
              skuPrices: this.purchasePlanForm.skuPrices,
              postage: this.purchasePlanForm.postage,
              SalesId:this.purchasePlanForm.salesId,
            };
            this.$api.exwarehouse.createExWarhousePlan(ExPlan).then((res) => {
              const { data, success, message } = res.data;
              if (!success) {
                this.$error(message);
              } else {
                this.$message({ message: '添加成功！', type: 'success' });
                this.applicationPlanDiolog.Visible = false;
                this.importSalesDiolog.Visible = false;
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
    //提交出库开单
    async submitApplications() {
      this.$api.exwarehouse.CreateExWarehousePlanOrder(this.purchaseIds).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error(message);
        } else {
          this.$message({ message: '提交成功！', type: 'success' });
          this.planDetailDiolog.show = false;
          this.loadData();
        }
      });
      //}
      //}
    },
    //删除出库计划
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
    margin: 5px 0px;
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
