<template>
  <div class="accountsPayable">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-dropdown>
          <el-button size="mini" type="primary"> 引入原始单<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="openPurchaseOrderDialog()">采购单</el-dropdown-item>
            <el-dropdown-item @click.native="openSalesReturnDialog()">退货单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" size="mini" @click="openAppAccountsPayDiolog()">自主开单</el-button>
      </div>
      <div class="edit_query">
        <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
        </el-date-picker>
        <el-select size="mini" filterable v-model="queryForm.businessType" placeholder="业务类型">
          <el-option label="物品采购" :value="1"></el-option>
          <el-option label="采购退货" :value="2"></el-option>
          <el-option label="销售订单" :value="3"></el-option>
          <el-option label="售后退换" :value="4"></el-option>
        </el-select>
        <el-select size="mini" filterable v-model="queryForm.accountObjectType" placeholder="业务对象">
          <el-option label="供应商" :value="1"></el-option>
          <el-option label="客户" :value="2"></el-option>
        </el-select>
        <el-select size="mini" v-model="queryForm.accountState" placeholder="账目状态">
          <el-option label="待付款" :value="1"></el-option>
          <el-option label="已付款" :value="2"></el-option>
        </el-select>
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入查询内容"></el-input>
        <el-button type="primary" @click="getAccountList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm(1)" size="mini">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.accountList"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectOrderRows"
      @row-dbclick="showOrderDetailDialog()"
      v-loading="table.loading"
      show-summary
      border
    >
      <el-table-column type="expand" label="详情" width="50px">
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
            <p>采购单编号: {{ scope.row.projectId }}</p>
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
      <el-table-column prop="accountTotalPrice" label="应收金额" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
      <el-table-column prop="completeTime" label="完成时间" width="140px" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.completeTime) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="订单详情" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="showOrderDetailDialog(scope.row)" plain>订单详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="付款" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="showPayDialog(scope.row)" plain v-if="scope.row.accountStateStr == '待付款'">
            点击付款
          </el-button>
          <el-button
            v-else-if="scope.row.accountStateStr == '已付款'"
            type="warning"
            size="mini"
            @click="showPayDetailDialog(scope.row, 'accountInfo')"
            plain
            >付款详情</el-button
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
    <!-- 采购单详情 -->
    <el-drawer title="采购单详情" :visible.sync="orderDetailDialog.show" center size="70%" direction="rtl">
      <el-button size="mini" type="primary" @click="orderDetailDialog.show = false" plain>关闭</el-button>
      <el-table :data="orderDetailDialog.detailPlanItems" :header-cell-style="{ 'text-align': 'center' }" border>
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
    </el-drawer>
    <!-- 引入采购单对话框 -->
    <el-dialog id="purchaseOrderDialog" title="引入采购单" :visible.sync="purchaseOrderDialog.visible" center :fullscreen="true">
      <el-divider></el-divider>
      <!-- 操作 -->
      <div class="dialogSelectInput">
        <div>
          <el-button type="primary" size="mini" class="el-icon-check" @click="importPurchaseOrder()">
            引入
          </el-button>
        </div>
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
        <el-button type="primary" @click="getNoExecuteOrderList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm(2)" size="mini">重置</el-button>
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
            <el-button type="info" size="mini" @click="showOrderDetailDialog(scope.row, 'purchaseOrder')" plain>订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="purchaseOrderSizeChange"
          @current-change="purchaseOrderCurrentChange"
          :total="purchaseOrderDialog.table.total"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="purchaseOrderDialog.queryForm.page"
          :page-size="purchaseOrderDialog.queryForm.row"
          layout="total, sizes, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 引入退货单对话框 -->
    <el-dialog id="saleReturnDialog" title="引入退货单" :visible.sync="salesReturnDialog.visible" center :fullscreen="true">
      <el-divider></el-divider>
      <!-- 操作 -->
      <div class="returnDialogSelectInput">
        <div>
          <el-button type="primary" size="mini" class="el-icon-check" @click="importSalesReturn()">
            引入
          </el-button>
        </div>
        <el-date-picker
          v-model="salesReturnDialog.queryForm.publicationDates"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </el-date-picker>
        <el-select size="mini" v-model="salesReturnDialog.queryForm.warehouseId" placeholder="请输入开单仓库">
          <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
        </el-select>
        <el-input v-model="salesReturnDialog.queryForm.conditions" size="mini" label-width="80px" placeholder="请输入关键字"></el-input>
        <el-button type="primary" @click="getSalesReturnListByState()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetReturnQueryForm()" size="mini">重置</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        :data="salesReturnDialog.table.salesReturnList"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="selectSalesReturnRows"
        v-loading="salesReturnDialog.table.loading"
        show-summary
      >
        <el-table-column type="selection" width="80" align="center"> </el-table-column>
        <el-table-column type="expand" label="展开查看">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="运输费用">
                <span>{{ props.row.transportPrice }}</span>
              </el-form-item>
              <el-form-item label="其他费用">
                <span>{{ props.row.otherPrice }}</span>
              </el-form-item>
              <el-form-item label="销售退货单总价">
                <span>{{ props.row.returnTotalPrice }}</span>
              </el-form-item>
              <el-form-item label="实际退款金额">
                <span>{{ props.row.actualRefundPrice }}</span>
              </el-form-item>
              <el-form-item label="开单时间">
                <span>{{ $timeFormat.leaveTime(props.row.createTime) }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="salesReturnId" label="销售退货单编号" width="120" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>原销售单号: {{ scope.row.projectId }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag disable-transitions>{{ scope.row.salesReturnId }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="salesReturnStateStr" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.salesReturnStateStr }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" align="center"> </el-table-column>
        <el-table-column prop="logisticsCompany" label="物流公司" align="center"></el-table-column>
        <el-table-column prop="logisticsNo" label="物流编号" align="center"></el-table-column>
        <el-table-column prop="applicantName" label="业务员" align="center"></el-table-column>
        <el-table-column prop="goodsTotalCount" label="物品总数" align="center"></el-table-column>
        <el-table-column prop="warehouseName" label="出货仓库" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
        <el-table-column prop="createTime" label=" 顾客信息" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="showClientInfo(scope.row)" plain>查看</el-button>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column width="200px" label="编辑" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openApprovalDetails(scope.row.salesReturnId)" plain>审核详情</el-button>
            <el-button type="primary" size="mini" @click="showSalesReturnDetailDialog(scope.row)" plain>订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="salesaReturnSizeChange"
          @current-change="salesaReturnCurrentChange"
          :total="salesReturnDialog.table.total"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="salesReturnDialog.queryForm.page"
          :page-size="salesReturnDialog.queryForm.row"
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
          <el-input v-model="payForm.payUserName" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款方编号">
          <el-input v-model="payForm.accountObjectId" disabled></el-input>
        </el-form-item>
        <el-form-item label="收款方">
          <el-input v-model="payForm.accountObjectName" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
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
        <el-form-item label="￥应付金额">
          <span style="color:red">
            {{ payForm.accountTotalPrice }}
          </span>
        </el-form-item>
      </el-form>
      <el-dialog width="50%" title="请选择付款银行卡" :visible.sync="bankCardDialog.visible" append-to-body>
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
        <el-button type="primary" @click="paymentOrder()">确 定</el-button>
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
    <!-- 添加应付开单对话框 -->
    <el-dialog
      id="applicationSalesDiolog"
      title="应付开单"
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
            <el-option label="物品采购" :value="1"></el-option>
            <!-- <el-option label="采购退货" :value="2"></el-option>
            <el-option label="销售订单" :value="3"></el-option> -->
            <el-option label="售后退换" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务对象类型" prop="accountObjectType">
          <el-radio-group v-model="accountForm.accountObjectType">
            <el-radio border label="1">供应商</el-radio>
            <el-radio border label="2">客户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="业务对象" prop="accountObjectId">
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
        <el-form-item label="应付金额" prop="accountTotalPrice">
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
        accountType: 2, //1应收  2，应付
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
      orderDetailDialog: {
        editPurchaseOrderId: '',
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
          conditions: '',
        },
      },
      salesReturnDialog: {
        visible: false,
        table: {
          salesReturnList: [],
          total: 0,
          loading: true,
        },
        queryForm: {
          page: 1,
          row: 10,
          publicationDates: [],
          warehouseId: '', //出货仓库
          conditions: '', //综合条件
          salesReturnState: 6, //退货单状态（待结算）
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
        accountType: 2,
        businessType: '',
        operationPersonId: '',
        operationPersonName: '',
        accountObjectType: '1',
        accountObjectId: '',
        accountObjectName: '',
        accountTotalPrice: 0,
        remarks: '',
      },
      purchaseOrderIds: [],
      //仓库列表
      warehouseList: [],
      //供应商列表
      supplierList: [],
      clientList: [],
      accountRules: {
        businessType: [{ required: true, message: '请选择业务类型', trigger: 'blur' }],
        accountObjectType: [{ required: true, message: '请选择业务对象', trigger: 'change' }],
        accountTotalPrice: [{ required: true, message: '请输入应付金额', trigger: 'change' }],
        accountObjectId: [{ required: true, message: '请选择业务对象', trigger: 'change' }],
      },
      salesReturnIds: [],
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
    //获取已完成采购订单列表
    async getNoExecuteOrderList() {
      let queryForm = JSON.parse(JSON.stringify(this.purchaseOrderDialog.queryForm));
      queryForm.supplierId = queryForm.supplierId == '' ? 0 : parseInt(queryForm.supplierId);
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
    //通过销售退货单状态获取退货单
    async getSalesReturnListByState() {
      await this.$api.salesReturn.getSalesReturnListByState(this.salesReturnDialog.queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.salesReturnDialog.table.salesReturnList = data.salesReturns;
        this.salesReturnDialog.table.total = data.count;
        this.salesReturnDialog.table.loading = false;
      });
    },
    //获取应账目详细项目列表
    async getOrderDetailByPurchaseOrderId(purchaseOrderId) {
      await this.$api.purchaseOrder.getOrderDetailByPurchaseOrderId(purchaseOrderId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.orderDetailDialog.detailPlanItems = data;
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
        this.purchaseOrderDialog.queryForm.supplierId = '';
        this.purchaseOrderDialog.queryForm.conditions = '';
        this.purchaseOrderDialog.queryForm.publicationDates = [];
        this.getNoExecuteOrderList();
      }
    },
    //获取应账目选中行的数据
    selectOrderRows(selection) {
      this.purchaseOrderIds = [];
      selection.forEach((element) => {
        this.purchaseOrderIds.push(element.purchaseOrderId);
      });
    },
    //显示采购单子项目
    showOrderDetailDialog(row, editTableName) {
      if (row.projectId == null) {
        return;
      }
      if (editTableName == 'purchaseOrder') {
        //通过付款单获取采购单详情
        this.orderDetailDialog.editPurchaseOrderId = row.purchaseOrderId;
        this.getOrderDetailByPurchaseOrderId(row.purchaseOrderId);
      } else {
        //通过付款单获取采购单详情
        this.orderDetailDialog.editPurchaseOrderId = row.projectId;
        this.getOrderDetailByPurchaseOrderId(row.projectId);
      }

      this.orderDetailDialog.show = true;
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
    //------------引入采购单-----
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
      if (this.purchaseOrderIds.length == 0) {
        this.$message({
          message: '请选择要引用的采购单',
          type: 'warning',
        });
      } else {
        let userInfo = store.getters['userInfo/getUserInfo'];
        this.$api.finance.addAccountByPurchaseOrder(this.purchaseOrderIds, userInfo.userId, userInfo.name).then((res) => {
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
      }
    },
    //end----------引入采购单-------

    //------------引入退货单--------
    openSalesReturnDialog() {
      this.salesReturnDialog.visible = true;
      this.getSalesReturnListByState();
    },
    resetReturnQueryForm() {
      this.salesReturnDialog.queryForm.conditions = '';
      this.salesReturnDialog.queryForm.salesReturnState = '';
      this.salesReturnDialog.queryForm.warehouseId = '';
      this.salesReturnDialog.queryForm.publicationDates = [];
      this.getSalesReturnListByState();
    },
    salesaReturnSizeChange(row) {
      this.salesReturnDialog.queryForm.row = row;
      this.getNoExecuteOrderList();
    },
    salesaReturnCurrentChange(page) {
      this.salesReturnDialog.queryForm.page = page;
      this.getNoExecuteOrderList();
    },
    selectSalesReturnRows(selection) {
      this.salesReturnIds = [];
      selection.forEach((element) => {
        this.salesReturnIds.push(element.salesReturnId);
      });
    },
    //引入退货单
    importSalesReturn() {
      if (this.salesReturnIds.length == 0) {
        this.$message({
          message: '请选择要引用的采销售退货单',
          type: 'warning',
        });
      } else {
        let userInfo = store.getters['userInfo/getUserInfo'];
        this.$api.finance.addAccountBySalesReturn(this.salesReturnIds, userInfo.userId, userInfo.name).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message.error(message);
          } else {
            this.$message({
              message: message,
              type: 'success',
            });
            this.salesReturnDialog.visible = false;
            this.loadData();
          }
        });
      }
    },
    //end----------引入退货单--------------

    //start----------付款---------------
    showPayDialog(row) {
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
    //支付订单
    paymentOrder() {
      if (this.payForm.payType == '' || this.payForm.payType == null) {
        this.$message({
          message: '请选择支付方式',
          type: 'warning',
        });
      } else if (this.payForm.payType == '3' && this.payForm.bankCardNo == '') {
        this.$message({
          message: '请选择付款银行卡',
          type: 'warning',
        });
      } else {
        let payForm = JSON.parse(JSON.stringify(this.payForm));
        payForm.payType = payForm.payType == '' ? 0 : parseInt(payForm.payType);
        this.$api.finance.paymentOrder(payForm).then((res) => {
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
    showPayDetailDialog(row) {
      this.payDetailDialog.accountId = row.accountId;
      this.payDetailDialog.payTypeStr = row.payTypeStr;
      this.payDetailDialog.operationPersonName = row.operationPersonName;
      this.payDetailDialog.accountObjectName = row.accountObjectName;
      this.payDetailDialog.accountDetail = row.accountDetail;
      this.payDetailDialog.visible = true;
    },
    // end-----------付款----------------------

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
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
      grid-column-gap: 5px;
      .edit_query_1:last-child {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    }
  }
  #purchaseOrderDialog {
    .dialogSelectInput {
      display: grid;
      grid-template-columns: 4fr 1fr 1fr 0.3fr 0.3fr;
      grid-column-gap: 3px;
    }
  }
  #saleReturnDialog {
    .returnDialogSelectInput {
      display: grid;
      grid-template-columns: 4fr 1fr 1fr 1fr 0.3fr 0.3fr;
      grid-column-gap: 3px;
    }
  }
}
</style>
