<template>
  <div class="accountsPayable">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" @click="opensalesOrderDialog()" icon="el-icon-plus">
          引入销售单
        </el-button>
        <el-button type="primary" size="mini" @click="openAppAccountsPayDiolog()">自主开单</el-button>
      </div>
      <div class="edit_query">
        <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
        </el-date-picker>
        <el-select size="mini" filterable v-model="queryForm.businessType" placeholder="业务类型">
          <el-option label="物品销售" :value="1"></el-option>
          <el-option label="采购退货" :value="2"></el-option>
          <el-option label="订单销售" :value="3"></el-option>
          <el-option label="售后退换" :value="4"></el-option>
        </el-select>
        <el-select size="mini" filterable v-model="queryForm.accountObjectType" placeholder="业务对象类型">
          <el-option label="供应商" :value="1"></el-option>
          <el-option label="客户" :value="2"></el-option>
        </el-select>
        <el-select size="mini" v-model="queryForm.accountState" placeholder="账目状态">
          <el-option label="待收款" :value="3"></el-option>
          <el-option label="已收款" :value="4"></el-option>
        </el-select>
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入查询内容"></el-input>
        <div class="edit_query_1">
          <el-button type="primary" @click="getAccountList()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm(1)" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.accountList"
      :header-cell-style="{ 'text-align': 'center' }"
      @row-dbclick="showSalesDetailDiolog()"
      v-loading="table.loading"
      show-summary
    >
    <el-table-column type="expand" label="展开查看">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="运输费用">
              <span>{{ props.row.transportPrice }}</span>
            </el-form-item>
            <el-form-item label="其他费用">
              <span>{{ props.row.otherPrice }}</span>
            </el-form-item>
            <el-form-item label="销售单总价">
              <span>{{ props.row.accountTotalPrice }}</span>
            </el-form-item>
            <el-form-item label="开单时间">
              <span>{{ $timeFormat.leaveTime(props.row.createTime) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="accountId" label="账目编号" align="center" width="120px">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>销售单编号: {{ scope.row.projectId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.accountId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="accountStateStr" label="账目状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.accountStateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="accountTypeStr" label="账目类型" align="center"> </el-table-column>
      <el-table-column prop="accountObjectTypeStr" label="对象类型" align="center"> </el-table-column>
      <el-table-column prop="businessTypeStr" label="业务类型" align="center"> </el-table-column>
      <el-table-column prop="accountObjectId" label="账单对象编号" align="center"> </el-table-column>
      <el-table-column prop="accountObjectName" label="账单对象名称" align="center"></el-table-column>
      <el-table-column prop="accountTotalPrice" label="应付金额" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
      <el-table-column prop="completeTime" label="完成时间" width="140px" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.completeTime) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="编辑" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showSalesDetailDiolog(scope.row)" plain>订单详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="收款" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="showPaymentDialog(scope.row)" plain v-if="scope.row.accountStateStr == '待收款'">
            点击收款
          </el-button>
          <el-button v-else-if="scope.row.accountStateStr == '已收款'" type="primary" size="mini" @click="showPaymentDetailDialog(scope.row)" plain
            >收款详情</el-button
          >
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
    <!-- 销售单详情 -->
    <el-drawer title="销售单详情" :visible.sync="salesDetailDialog.show" center size="70%" direction="rtl">
      <el-button size="mini" type="primary" @click="salesDetailDialog.show = false" plain>关闭</el-button>
      <el-table :data="salesDetailDialog.salesDetailItems" :header-cell-style="{ 'text-align': 'center' }" border>
        <el-table-column prop="salesDetailId" label="销售明细编号" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.salesDetailId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
        <el-table-column prop="costPrice" label="供应商进价" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.costPrice }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="salesPrice" label="单品售价" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.salesPrice }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="goodsCount" label="销售数量" align="center"> </el-table-column>
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
    <!-- 引入销售单对话框 -->
    <el-dialog title="引入销售单" :visible.sync="salesOrderDialog.visible" center width="70%" :fullscreen="true">
      <el-button type="primary" size="mini" class="el-icon-check" @click="importSaelsOrder()">
        引入
      </el-button>
      <el-divider></el-divider>
      <!-- 操作 -->
      <div class="dialogSelectInput">
        <div></div>
        <el-date-picker
          v-model="salesOrderDialog.queryForm.publicationDates"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </el-date-picker>
        <el-select size="mini" v-model="salesOrderDialog.queryForm.warehouseId" placeholder="请输入开单仓库">
          <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
        </el-select>
        <el-input v-model="salesOrderDialog.queryForm.conditions" size="mini" label-width="80px" placeholder="请输入关键字"></el-input>
        <el-button type="primary" @click="getSalesListBySalesState()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        :data="salesOrderDialog.table.salesOrderList"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="selectOrderRows"
        v-loading="table.loading"
        show-summary
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column type="expand" label="展开查看">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="运输费用">
                <span>{{ props.row.transportPrice }}</span>
              </el-form-item>
              <el-form-item label="其他费用">
                <span>{{ props.row.otherPrice }}</span>
              </el-form-item>
              <el-form-item label="销售单总价">
                <span>{{ props.row.salesTotalPrice }}</span>
              </el-form-item>
              <el-form-item label="订单利润">
                <span>{{ props.row.salesProfit }}</span>
              </el-form-item>
              <el-form-item label="开单时间">
                <span>{{ $timeFormat.leaveTime(props.row.createTime) }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
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
        <el-table-column prop="createTime" label=" 顾客信息" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showClientInfo(scope.row)" plain>查看</el-button>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="编辑" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="showSalesDetailDiolog(scope.row, 'sales')" plain>订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="salesOrderSizeChange"
          @current-change="salesOrderCurrentChange"
          :total="salesOrderDialog.table.total"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="queryForm.page"
          :page-size="queryForm.row"
          layout="total, sizes, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 付款对话框 -->
    <el-dialog title="收款" :visible.sync="payDialog.visible" center width="40%">
      <el-form ref="form" :model="payForm" label-width="90px" size="mini">
        <el-form-item label="操作人">
          <el-input v-model="payForm.payUserName" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款方编号">
          <el-input v-model="payForm.accountObjectId" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款对象">
          <el-input v-model="payForm.accountObjectName" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款方式">
          <el-radio-group v-model="payForm.payType" size="medium">
            <!-- <el-radio border label="1">微信</el-radio>
            <el-radio border label="2">支付宝</el-radio> -->
            <el-radio border label="3">银行卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="银行卡" v-if="payForm.payType == 3">
          <el-button type="primary" @click="showbankCardDialog()">请选择款银行卡</el-button>
          <p>{{ payForm.bankName }}</p>
          <p>{{ payForm.bankCardNo }}</p>
        </el-form-item>
        <el-form-item label="￥应收金额">
          <span style="color:red">
            {{ payForm.accountTotalPrice }}
          </span>
        </el-form-item>
      </el-form>
      <el-dialog width="50%" title="请选择收款银行卡" :visible.sync="bankCardDialog.visible" append-to-body>
        <!-- 银行卡信息表格 -->
        <el-table :data="bankCardDialog.bankCardList" :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column prop="bankCardNo" label="卡号" align="center" width="120px">
            <template slot-scope="scope">
              <el-tag disable-transitions>{{ scope.row.bankCardNo }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="cardholder" label="持卡人" align="center"> </el-table-column>
          <el-table-column prop="accountBalance" label="账户余额" align="center"> </el-table-column>
          <el-table-column prop="bankName" label="银行名称" align="center"></el-table-column>
          <el-table-column prop="bankCardStateStr" label="银行卡状态" align="center">
            <template slot-scope="scope">
              <el-tag disable-transitions effect="plain">{{ scope.row.bankCardStateStr }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="140px" align="center">
            <template slot-scope="scope">
              {{ $timeFormat.leaveTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="编辑" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="warm" size="mini" @click="chooseBankCard(scope.row)">
                选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="accountReceivable()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 付款详情对话框 -->
    <el-dialog title="付款信息" :visible.sync="payDetailDialog.visible" center width="40%">
      <el-descriptions class="margin-top" title="详细信息" :column="1">
        <el-descriptions-item label="付款编号">{{ payDetailDialog.accountId }}</el-descriptions-item>
        <el-descriptions-item label="付款方式" label-class-name="my-label">
          <el-tag size="small">
            {{ payDetailDialog.accountDetail['payTypeStr'] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="业务员">
          <el-tag size="small">{{ payDetailDialog.operationPersonName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="账单对象">
          <el-tag size="small">{{ payDetailDialog.accountObjectName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="银行名称">{{ payDetailDialog.accountDetail['bankName'] }}</el-descriptions-item>
        <el-descriptions-item label="付款账号">{{ payDetailDialog.accountDetail['bankCardNo'] }}</el-descriptions-item>
        <el-descriptions-item label="付款时间">{{ $timeFormat.leaveTime(payDetailDialog['payTime']) }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 添加应收开单对话框 -->
    <el-dialog
      id="applicationSalesDiolog"
      title="应收开单"
      center
      :visible.sync="appAccountsPayDiolog.visible"
      :close-on-click-modal="false"
      :fullscreen="true"
    >
      <el-form ref="accountForm" :model="accountForm" label-width="110px" style="width:50%" :rules="accountRules">
        <el-form-item label="业务员">
          <el-input size="mini" type="text" v-model="accountForm.operationPersonName" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <el-select size="mini" v-model="accountForm.businessType" placeholder="业务类型">
            <!-- <el-option label="物品采购" :value="1"></el-option> -->
            <el-option label="采购退货" :value="2"></el-option>
            <el-option label="销售订单" :value="3"></el-option>
            <!-- <el-option label="售后退换" :value="4"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="业务对象类型" prop="accountObjectType">
          <el-radio-group v-model="accountForm.accountObjectType">
            <el-radio border label="1">供应商</el-radio>
            <el-radio border label="2">客户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="业务对象" prop="operationPersonId">
          <el-select
            v-if="accountForm.accountObjectType == '1'"
            size="mini"
            filterable
            v-model="accountForm.accountObjectId"
            placeholder="请选择供应商"
            @change="supplierChange"
          >
            <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId"></el-option>
          </el-select>
          <el-select v-else size="mini" filterable v-model="accountForm.accountObjectId" placeholder="请选择顾客户" @change="clientOnChange">
            <el-option v-for="item in clientList" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应收金额" prop="accountTotalPrice">
          <el-input size="mini" type="number" v-model.number="accountForm.accountTotalPrice"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model.trim="accountForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="appAccountsPayDiolog.visible = false">取 消</el-button>
        <el-button type="success" @click="addAccount()">确定</el-button>
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
        accountType: 1, //1应收  2，应付
        publicationDates: [], //开单时间区域
        businessType: '', //业务类型
        accountObjectType: '', //对象类型 1 供应商 2.客户
        accountState: '',
        conditions: '',
      },
      table: {
        accountList: [],
        total: 0,
        loading: true,
      },
      salesDetailDialog: {
        editSalesId: '',
        show: false,
        salesDetailItems: [],
      },
      //销售单对话框
      salesOrderDialog: {
        visible: false,
        table: {
          salesOrderList: [],
          total: 0,
          loading: true,
        },
        queryForm: {
          page: 1,
          row: 10,
          publicationDates: [],
          warehouseId: '', //出货仓库
          conditions: '', //综合条件
          salesState: 8, //待结算的销售单
        },
      },
      payDialog: {
        visible: false,
      },
      bankCardDialog: {
        visible: false,
        bankCardList: [],
      },
      payDetailDialog: {
        visible: false,
        accountId: '',
        payTypeStr: '',
        operationPersonName: '',
        accountObjectName: '',
        accountDetail: {},
      },
      payForm: {
        accountId: '', //要支付的订单
        payType: '1',
        accountObjectId: '',
        accountObjectName: '',
        payUserId: '', //支付人
        payUserName: '', //支付人
        accountTotalPrice: '',
        bankCardNo: '', //收款账号
        bankName: '', //收款账号
      },
      appAccountsPayDiolog: {
        visible: false,
      },
      accountForm: {
        accountType: 1,
        businessType: '',
        operationPersonId: '',
        operationPersonName: '',
        accountObjectType: '1',
        accountObjectId: '',
        accountObjectName: '',
        accountTotalPrice: 0,
        remarks: '',
      },
      salesOrderIds: [],
      //仓库列表
      warehouseList: [],
      //供应商列表
      supplierList: [],
      clientList: [],
      accountRules: {
        businessType: [{ required: true, message: '请选择业务类型', trigger: 'blur' }],
        accountObjectType: [{ required: true, message: '请选择业务对象类型', trigger: 'change' }],
        accountTotalPrice: [{ required: true, message: '请输入应付金额', trigger: 'change' }],
      },
      accountObjectId: [{ required: true, message: '请选择业务对象', trigger: 'change' }],
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getAccountList();
    },
    //获取提交应账目列表
    async getAccountList() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.businessType = queryForm.businessType == '' ? 0 : parseInt(queryForm.businessType);
      queryForm.accountObjectType = queryForm.accountObjectType == '' ? 0 : parseInt(queryForm.accountObjectType);
      queryForm.accountState = queryForm.accountState == '' ? 0 : parseInt(queryForm.accountState);
      await this.$api.finance.getAccountList(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.accountList = data.accounts;
        this.table.total = data.count;
        this.table.loading = false;
      });
    },
    //获取已完成销售订单列表
    async getSalesListBySalesState() {
      let queryForm = JSON.parse(JSON.stringify(this.salesOrderDialog.queryForm));
      await this.$api.sales.getSalesListBySalesState(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.salesOrderDialog.table.salesOrderList = data.sales;
        this.salesOrderDialog.table.total = data.count;
      });
    },
    //获取应账目详细项目列表
    async getSalesDatailBySalesId(salesId) {
      await this.$api.sales.getSalesDatailBySalesId(salesId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.salesDetailDialog.salesDetailItems = data;
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
    async getBankCardInfoList() {
      this.bankCardDialog.bankCardList = [];
      await this.$api.finance.getBankCardInfoList().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.bankCardDialog.bankCardList = data;
      });
    },
    //获取客户列表数据
    async getClientList() {
      await this.$api.user.getUsersByRoleId('Client').then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.clientList = data;
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
        this.queryForm.businessType = '';
        this.queryForm.accountState = '';
        this.queryForm.conditions = '';
        this.queryForm.accountObjectType = '';
        this.queryForm.publicationDates = [];
        this.loadData();
      } else {
        this.salesOrderDialog.queryForm.supplierId = '';
        this.salesOrderDialog.queryForm.conditions = '';
        this.salesOrderDialog.queryForm.publicationDates = [];
        this.getSalesListBySalesState();
      }
    },
    //获取应账目选中行的数据
    selectOrderRows(selection) {
      this.salesOrderIds = [];
      selection.forEach((element) => {
        this.salesOrderIds.push(element.salesId);
      });
    },
    //显示销售单子项目
    showSalesDetailDiolog(row, editTableName) {
      if (editTableName == 'sales') {
        //通过付款单获取销售单详情
        this.salesDetailDialog.editSalesId = row.salesId;
        this.getSalesDatailBySalesId(row.salesId);
      } else {
        //通过付款单获取销售单详情
        this.salesDetailDialog.editSalesId = row.projectId;
        this.getSalesDatailBySalesId(row.projectId);
      }
      this.salesDetailDialog.show = true;
    },
    getElTagClass(row) {
      if (row.acountStateStr == '已付款') {
        return 'success';
      } else if (row.acountStateStr == '待付款') {
        return 'warning';
      } else {
        return '';
      }
    },
    //Start-----------------引入销售单--------------
    opensalesOrderDialog() {
      this.salesOrderDialog.visible = true;
      this.getSalesListBySalesState();
    },
    salesOrderSizeChange(row) {
      this.salesOrderDialog.queryForm.row = row;
      this.getSalesListBySalesState();
    },
    salesOrderCurrentChange(page) {
      this.salesOrderDialog.queryForm.page = page;
      this.getSalesListBySalesState();
    },
    //引入销售单生成付款单
    importSaelsOrder() {
      let userInfo = store.getters['userInfo/getUserInfo'];
      this.$api.finance.addAccountBySalesOrder(this.salesOrderIds, userInfo.userId, userInfo.name).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error(message);
        } else {
          this.$message({
            message: message,
            type: 'success',
          });
          this.salesOrderDialog.visible = false;
          this.loadData();
        }
      });
    },
    //end---------------------引入销售单-----------------
    //Start----------------------------付款-----------------
    showPaymentDialog(row) {
      //获取当前登入人信息
      let userInfo = store.getters['userInfo/getUserInfo'];
      this.payDialog.visible = true;
      this.payForm.payUserId = userInfo.userId;
      this.payForm.payUserName = userInfo.name;
      this.payForm.accountId = row.accountId;
      this.payForm.accountObjectId = row.accountObjectId;
      this.payForm.accountObjectName = row.accountObjectName;
      this.payForm.accountTotalPrice = row.accountTotalPrice;
    },
    showbankCardDialog() {
      this.getBankCardInfoList();
      this.bankCardDialog.visible = true;
    },
    //选择银行卡
    chooseBankCard(row) {
      if (this.payForm.accountTotalPrice > row.accountBalance) {
        this.$message({
          message: '银行卡余额不足',
          type: 'warning',
        });
      } else {
        this.payForm.bankCardNo = row.bankCardNo;
        this.payForm.bankName = row.bankName;
        this.bankCardDialog.visible = false;
      }
    },
    //订单收款
    accountReceivable() {
      if (this.payForm.payType == '' || this.payForm.payType == null) {
        this.$message({
          message: '请选择收款方式',
          type: 'warning',
        });
      } else if (this.payForm.payType == '3' && this.payForm.bankCardNo == '') {
        this.$message({
          message: '请选择收款银行卡',
          type: 'warning',
        });
      } else {
        let payForm = JSON.parse(JSON.stringify(this.payForm));
        payForm.payType = payForm.payType == '' ? 0 : parseInt(payForm.payType);
        this.$api.finance.accountReceivable(payForm).then((res) => {
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
    //付款详情
    showPaymentDetailDialog(row) {
      console.log(row);
      this.payDetailDialog.accountId = row.accountId;
      this.payDetailDialog.payTypeStr = row.payTypeStr;
      this.payDetailDialog.operationPersonName = row.operationPersonName;
      this.payDetailDialog.accountObjectName = row.accountObjectName;
      this.payDetailDialog.accountDetail = row.accountDetail;
      this.payDetailDialog.visible = true;
    },
    // ------------------------付款----------------------
    //-------------自主开单-------------
    openAppAccountsPayDiolog() {
      this.appAccountsPayDiolog.visible = true;
      const userInfo = store.getters['userInfo/getUserInfo'];
      this.accountForm.operationPersonId = userInfo.userId || '';
      this.accountForm.operationPersonName = userInfo.name || '';
      this.accountForm.businessType = '';
      this.accountForm.accountObjectType = '1';
      this.accountForm.accountObjectId = '';
      this.accountForm.accountObjectName = '';
      this.accountForm.accountTotalPrice = '';
      this.accountForm.remarks = '';
    },
    clientOnChange(value) {
      this.clientList.forEach((item, index) => {
        if (item.userId == value) {
          this.accountForm.accountObjectId = item['userId'];
          this.accountForm.accountObjectName = item['name'];
          return true;
        }
      });
    },
    supplierChange(value) {
      //根据供应商Id值修改供应商名称的值
      this.supplierList.forEach((item, index) => {
        if (item.supplierId == value) {
          this.accountForm.accountObjectId = item['supplierId'];
          this.accountForm.accountObjectName = item['supplierName'];
          return true;
        }
      });
    },
    addAccount() {
      let accountForm = JSON.parse(JSON.stringify(this.accountForm));
      accountForm.accountObjectType = parseInt(accountForm.accountObjectType);
      accountForm.accountObjectId = accountForm.accountObjectId.toString();
      accountForm.accountTotalPrice = parseInt(accountForm.accountTotalPrice);
      this.$refs['accountForm'].validate((valid) => {
        if (valid) {
          this.$api.finance.addAccount(accountForm).then((res) => {
            const { data, success, message } = res.data;
            if (!success) {
              this.$message.error(message);
            } else {
              this.$message({
                message: message,
                type: 'success',
              });
              this.appAccountsPayDiolog.visible = false;
              this.loadData();
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //end----------自主开单------------
  },
  created() {
    this.loadData();
    this.getSupplierList();
    this.getClientList();
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
    grid-template-columns: 1fr 3fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      grid-gap: 5px;
      justify-content: flex-start; //左对齐lex-end：右对齐 space-between：两端对齐，项目之间的间隔都相等
    }
    .edit_query {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 2fr 1.5fr;
      grid-column-gap: 5px;
      .edit_query_1:last-child {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    }
  }
  .dialogSelectInput {
    display: grid;
    grid-template-columns: 2fr 1fr 0.5fr 0.5fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
