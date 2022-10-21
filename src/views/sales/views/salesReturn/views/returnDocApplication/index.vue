<template>
  <div class="salesInvoicing">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-dropdown>
          <el-button type="primary" size="mini"> 更多菜单<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="getSalesList()"> 引入销售单 </el-dropdown-item>
            <el-button type="primary" size="mini" class="el-icon-edit" @click="openapplicationSalesDiolog()"> 新建申请 </el-button>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" size="mini" class="el-icon-check" @click="submitApplications()"> 提交 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="cancelSalesReturnRequest()"> 撤销 </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
          </el-date-picker>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.salesState" placeholder="订单状态">
            <el-option label="待出库" value="2"></el-option>
            <el-option label="已出库" value="3"></el-option>
            <el-option label="待发货" value="4"></el-option>
            <el-option label="已发货" value="5"></el-option>
            <el-option label="已完成" value="6"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.warehouseId" placeholder="请输入开单仓库">
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入关键字"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectSalesList()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.salesReturnList"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectOrderRows"
      v-loading="table.loading"
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
      <el-table-column prop="salesId" label="销售退货单编号" width="120" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>销售计划编号: {{ scope.row.salesId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.salesId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="salesReturnStateStr" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.salesReturnStateStr }}</el-tag>
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
          <el-button type="warning" size="mini" @click="showClientInfo(scope.row)" plain>查看</el-button>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="编辑" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="showDetailDiolog(scope.row)" plain>订单详情</el-button>
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
    <!-- 销售退货单详情 -->
    <el-drawer id="salesDetailDiolog" title="销售退货单详情" :visible.sync="salesDetailDiolog.show" direction="rtl" size="70%">
      <el-divider></el-divider>
      <el-button size="mini" type="primary" @click="salesDetailDiolog.show = false" plain>关闭</el-button>
      <el-table :data="salesDetailDiolog.salesDetails" :header-cell-style="{ 'text-align': 'center' }" border>
        <el-table-column prop="salesReturnDetailId" label="销售明细编号" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.salesReturnDetailId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skuId" label="物品编号" width="200px" align="center"> </el-table-column>
        <el-table-column label="销售退货单价" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.salesPrice }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="成本价" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.costPrice }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="goodsCount" label="销售数量" align="center"> </el-table-column>
        <el-table-column prop="totalPrice" label="单品总价" align="center">
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
    <!-- 收货人信息对话框 -->
    <el-dialog id="clientDialog" title="客户详情" :visible.sync="clientDialog.visible" center width="60%">
      <el-descriptions class="margin-top" title="带边框列表" :column="3" border>
        <template slot="extra">
          <el-button type="primary" size="small">操作</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            编号
          </template>
          <el-tag size="small">{{ clientDialog.clientId }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          <el-tag size="small">{{ clientDialog.clientName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ clientDialog.clientPhone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            邮编
          </template>
          {{ clientDialog.postalCode }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            收获地址
          </template>
          {{ clientDialog.clientAddress }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            顾客备注
          </template>
          {{ clientDialog.clientRemarks }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 添加销售开单对话框 -->
    <el-dialog
      id="applicationSalesDiolog"
      title="销售开单"
      center
      :visible.sync="applicationSalesDiolog.Visible"
      :close-on-click-modal="false"
      :fullscreen="true"
    >
      <!-- 销售退货单基本信息 -->
      <el-descriptions class="margin-top" :column="5" size="mini" style="width: 90%" :border="true">
        <el-descriptions-item label="出货仓库"
          ><el-select size="mini" v-model="salesOrderForm.warehouseId" @change="warehouseOnChange" filterable>
            <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"> </el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="订单类型">
          <el-select size="mini" v-model="salesOrderForm.salesType" filterable>
            <el-option value="线上销售" label="线上销售"></el-option>
            <el-option value="线下销售" label="线下销售"></el-option>
            <el-option value="批发销售" label="批发销售"></el-option>
            <el-option value="其他" label="其他"></el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="业务员">
          <el-input size="mini" type="text" v-model="salesOrderForm.applicantName" disabled></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="物流公司">
          <el-select size="mini" v-model="salesOrderForm.logisticsCompany">
            <el-option value="韵达" label="韵达"></el-option>
            <el-option value="圆通" label="圆通"></el-option>
            <el-option value="中通" label="中通"></el-option>
            <el-option value="顺风" label="顺风"></el-option>
            <el-option value="极兔" label="极兔"></el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="订单备注">
          <el-input size="mini" type="text" v-model="salesOrderForm.remarks"></el-input>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 客户信息 -->
      <el-divider></el-divider>
      <el-descriptions class="margin-top" :column="4" size="mini" style="width: 90%" :border="true">
        <el-descriptions-item label="顾客">
          <el-select size="mini" filterable v-model="salesOrderForm.clientId" placeholder="请选择顾客户" @change="clientOnChange">
            <el-option v-for="item in clientList" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="手机号码">
          <el-input size="mini" type="text" v-model="salesOrderForm.clientPhone" clearable></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="顾客备注">
          <el-input size="mini" type="text" v-model="salesOrderForm.clientRemarks" clearable></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="邮编">
          <el-input size="mini" type="text" v-model="salesOrderForm.postalCode" clearable></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="收获地址" :span="1">
          <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange"> </el-cascader>
        </el-descriptions-item>
        <el-descriptions-item label="详细地址" :span="1">
          <el-input size="mini" type="textarea" v-model="salesOrderForm.clientAddress" clearable></el-input>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 费用信息 -->
      <el-divider></el-divider>
      <el-descriptions class="margin-top" :column="4" size="mini" style="width: 90%" :border="true">
        <el-descriptions-item label="支付方式">
          <el-select size="mini" v-model="salesOrderForm.payType" filterable>
            <el-option value="微信" label="微信"></el-option>
            <el-option value="支付宝" label="支付宝"></el-option>
            <el-option value="银行卡转账" label="银行卡转账"></el-option>
            <el-option value="现结" label="现结"></el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="运输费用">
          <el-input size="mini" type="number" v-model="salesOrderForm.transportPrice" @change="ransportOrotherPriceChange"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="其他费用">
          <el-input size="mini" type="number" v-model="salesOrderForm.otherPrice" @change="ransportOrotherPriceChange"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="物品总数">
          <el-input size="mini" type="number" v-model="salesOrderForm.goodsTotalCount" disabled></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="订单总价">
          <el-input size="mini" type="number" v-model="salesOrderForm.salesTotalPrice" disabled></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="订单利润">
          <el-input size="mini" type="number" v-model="salesOrderForm.salesProfit" disabled></el-input>
        </el-descriptions-item>
        <el-descriptions-item> </el-descriptions-item>
      </el-descriptions>
      <el-divider></el-divider>
      <div class="dialogSelectInput">
        <div></div>
        <el-input size="mini" v-model="applicationSalesDiolog.skuQueryForm.goodsName" placeholder="请输入物品名称"></el-input>
        <el-select size="mini" v-model="applicationSalesDiolog.skuQueryForm.goodsTypeId" placeholder="物品类型">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
        </el-select>
        <el-button type="primary" @click="getSKUListByWhId()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetDialogQueryForm()" size="mini">重置</el-button>
      </div>
      <el-divider></el-divider>
      <el-table
        :data="applicationSalesDiolog.skuTabledata"
        :header-cell-style="{ 'text-align': 'center' }"
        @selection-change="selectSKURows"
        border=""
      >
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column prop="skuId" label="物品编码" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="brand" label="品牌" align="center"> </el-table-column>
        <el-table-column prop="typeStr" label="类别" align="center"> </el-table-column>
        <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
        <el-table-column prop="price" label="销售数量" align="center">
          <template slot-scope="scope">
            <el-input-number
              type="number"
              size="mini"
              v-model.number="scope.row.exWarehouseCount"
              @change="goodsCountOrsalesPriceChange(scope.$index, scope.row)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="销售退货单价" align="center">
          <template slot-scope="scope">
            <el-input-number
              type="number"
              size="mini"
              v-model.number="scope.row.salesPrice"
              @change="goodsCountOrsalesPriceChange(scope.$index, scope.row)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单品进价" align="center"> </el-table-column>
        <el-table-column prop="count" label="库存" align="center"> </el-table-column>
        <el-table-column prop="warnCount" label="警告库存" align="center"> </el-table-column>
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
        <el-button @click="applicationSalesDiolog.Visible = false">取 消</el-button>
        <el-button type="success" @click="addSalesOrder()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store';
import { regionDataPlus } from 'element-china-area-data';
import provinceAndCity from '@/assets/js/province';
export default {
  data() {
    return {
      queryForm: {
        page: 1,
        row: 10,
        publicationDates: [],
        warehouseId: '', //出货仓库
        conditions: '', //综合条件
        salesType: '', //销售类型
        salesState: '', //销售退货单状态
      },
      //新建销售退货单表
      salesOrderForm: {
        warehouseId: '',
        warehouseName: '',
        applicantId: '', //申请人
        applicantName: '',
        salesType: '', //销售类型
        payType: '', //支付方式
        logisticsCompany: '', //物流公司
        remarks: '',
        clientId: '',
        clientName: '',
        postalCode: '', //邮编
        clientAddress: '',
        clientPhone: '',
        areadata: '',
        clientRemarks: '', //顾客备注
        otherPrice: 0,
        transportPrice: 0,
        goodsTotalCount: 0, //物品总数
        arrivalCount: 0,
        salesTotalPrice: 0, //订单总价
        salesProfit: 0, //利润
        salesDetails: [], //销售退货单详情
      },
      table: {
        salesReturnList: [],
        total: 0,
        loading: true,
      },
      salesDetailDiolog: {
        editSalesId: '',
        show: false,
        salesDetails: [],
      },
      clientDialog: {
        visible: false,
        clientId: '',
        clientName: '',
        clientAddress: '',
        clientPhone: '',
        postalCode: '',
        clientRemarks: '',
      },
      //新建采购计划对话框
      applicationSalesDiolog: {
        Visible: false,
        skuQueryForm: {
          page: 1,
          row: 10,
          conditions: '',
          goodsTypeId: '',
          goodsName: '',
          warehouseId: '',
        },
        skuTabledata: [],
        total: 0,
      },
      salesReturnIds: [],
      //仓库列表
      warehouseList: [],
      //物品类型列表
      goodsTypes: [],
      clientList: [], //客户列表
      options: regionDataPlus,
      selectedOptions: [],
      provinceAndCity,
      search: { current: 1, size: 6 },
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getUnsubmittedSalesReturnList();
    },
    handleChange(value) {
      this.search.province = '';
      this.search.city = '';
      this.search.district = '';
      for (var k = 0, lengthk = provinceAndCity.length; k < lengthk; k++) {
        //确定省
        if (provinceAndCity[k].code == value[0]) {
          this.search.province = provinceAndCity[k].name;
          if (provinceAndCity[k].cityList && value.length >= 2 && value[1] != '') {
            for (var i = 0, lengthi = provinceAndCity[k].cityList.length; i < lengthi; i++) {
              //确定市
              if (provinceAndCity[k].cityList[i].code == value[1] || provinceAndCity[k].cityList.length == 1) {
                this.search.city = provinceAndCity[k].cityList[i].name;
                //确定区
                if (provinceAndCity[k].cityList[i].areaList && value.length == 3 && value[2] != '') {
                  for (var j = 0, lengthj = provinceAndCity[k].cityList[i].areaList.length; j < lengthj; j++) {
                    if (provinceAndCity[k].cityList[i].areaList[j].code == value[2]) {
                      this.search.district = provinceAndCity[k].cityList[i].areaList[j].name;
                      break;
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        }
      }
      this.salesOrderForm.areadata = this.search.province + this.search.city + this.search.district;
      console.log(this.salesOrderForm.areadata);
    },
    //获取未提交销售退货单列表
    async getUnsubmittedSalesReturnList() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.salesState = queryForm.salesState == '' ? 0 : parseInt(queryForm.salesState);
      await this.$api.salesReturn.getUnsubmittedSalesReturnList(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.salesReturnList = data.salesReturns;
        this.table.total = data.count;
        this.table.loading = false;
      });
    },
    //获取销售退货单详细项目列表
    async getSalesReturnDatailByReturnId(salesReturnId) {
      await this.$api.sales.getSalesReturnDatailByReturnId(salesReturnId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.salesDetailDiolog.salesDetails = data;
      });
    },
    //获取物品类型列表
    async getGoodInfoType() {
      this.goodsTypes = [];
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
    //获取供应商物品数据
    async getSKUListByWhId() {
      let queryForm = JSON.parse(JSON.stringify(this.applicationSalesDiolog.skuQueryForm));
      queryForm.goodsTypeId = queryForm.goodsTypeId == '' ? 0 : parseInt(queryForm.goodsTypeId);
      await this.$api.goods
        .getSKUListByWhId(queryForm.page, queryForm.row, this.salesOrderForm.warehouseId, queryForm.goodsName, queryForm.goodsTypeId)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          this.applicationSalesDiolog.skuTabledata = data.goods;
          this.applicationSalesDiolog.total = data.count;
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
    //展示客户信息
    showClientInfo(row) {
      this.clientDialog.visible = true;
      this.clientDialog.clientId = row.clientId;
      this.clientDialog.clientName = row.clientName;
      this.clientDialog.clientAddress = row.clientAddress;
      this.clientDialog.clientPhone = row.clientPhone;
      this.clientDialog.postalCode = row.postalCode;
      this.clientDialog.clientRemarks = row.clientRemarks;
    },
    //显示销售退货单子项目
    showDetailDiolog(row) {
      this.getSalesReturnDatailByReturnId(row.salesReturnId);
      this.salesDetailDiolog.show = true;
    },
    getElTagClass(row) {
      if (row.salesStateStr == '已审核') {
        return 'success';
      } else if (row.salesStateStr == '审核中') {
        return 'warning';
      } else {
        return '';
      }
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
    //查找数据
    selectSalesList() {
      this.queryForm.page = 1;
      this.queryForm.row = 10;
      this.getSalesList();
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
      this.queryForm.conditions = '';
      this.queryForm.salesState = '';
      this.queryForm.warehouseId = '';
      this.queryForm.publicationDates = [];
      this.loadData();
    },
    //获取销售退货单选中行的数据
    selectOrderRows(selection) {
      this.salesReturnIds = [];
      selection.forEach((element) => {
        this.salesReturnIds.push(element.salesId);
      });
    },
    //-----------------销售开单---------------------
    //打开申请表模态框
    openapplicationSalesDiolog() {
      this.applicationSalesDiolog.Visible = true;
      const userInfo = store.getters['userInfo/getUserInfo'];
      this.salesOrderForm.applicantId = userInfo.userId || '';
      this.salesOrderForm.applicantName = userInfo.name || '';
      // 加载数据
      this.getWarehouseList();
      this.getGoodInfoType();
      this.getClientList();
    },
    //对话框表格条数改变
    dialogSizeChange(row) {
      this.applicationSalesDiolog.skuQueryForm.row = row;
      this.getSKUListByWhId();
    },
    //对话框表格页数改变
    dialogCurrentChange(page) {
      this.applicationSalesDiolog.skuQueryForm = page;
      this.getSKUListByWhId();
    },
    //重置申请采购计划模态框搜索条件
    resetDialogQueryForm() {
      this.applicationSalesDiolog.skuQueryForm.conditions = '';
      this.applicationSalesDiolog.skuQueryForm.goodsTypeId = 0;
      this.getSKUListByWhId();
    },
    //仓库下拉框改变
    warehouseOnChange(warehouseId) {
      //根据供应商Id值修改供应商名称的值
      this.warehouseList.forEach((item, index) => {
        if (item.warehouseId == warehouseId) {
          this.salesOrderForm.warehouseName = item['warehouseName'];
          return true;
        }
      });
      this.getSKUListByWhId();
    },
    clientOnChange(value) {
      //根据供应商Id值修改供应商名称的值
      this.clientList.forEach((item, index) => {
        if (item.userId == value) {
          this.salesOrderForm.clientName = item['name'];
          return true;
        }
      });
    },
    //获取采购计划选中行的数据
    selectSKURows(selection) {
      let salesDetailTotalPrice = 0; //销售详情单总价之和
      let salesDetailProfit = 0; //销售退货单利润之和
      let salesDetailgoodsCount = 0;
      this.salesOrderForm.salesDetails = [];
      selection.forEach((element) => {
        const salesDetail = {
          skuId: element.skuId,
          salesPrice: element.salesPrice,
          costPrice: element.price,
          goodsCount: element['exWarehouseCount'],
          exWarehouseCount: element['exWarehouseCount'],
          totalPrice: element['exWarehouseCount'] * element['salesPrice'],
          salesDetailProfit: element['exWarehouseCount'] * (element['salesPrice'] - element['price']), //利润
          remarks: '',
        };
        salesDetailTotalPrice += salesDetail['totalPrice'];
        salesDetailProfit += salesDetail['salesDetailProfit'];
        salesDetailgoodsCount += salesDetail['goodsCount'];
        this.salesOrderForm.salesDetails.push(salesDetail);
      });
      //销售退货单总价=每个销售详情单单的总价之和+（运输费用+其他费用）
      this.salesOrderForm.salesTotalPrice =
        salesDetailTotalPrice + parseInt(this.salesOrderForm.transportPrice) + parseInt(this.salesOrderForm.otherPrice);
      //销售退货单利润=每个销售详情单单的利润之和-（运输费用+其他费用）
      this.salesOrderForm.salesProfit = salesDetailProfit - (parseInt(this.salesOrderForm.transportPrice) + parseInt(this.salesOrderForm.otherPrice));
      this.salesOrderForm.goodsTotalCount = salesDetailgoodsCount;
    },
    //销售退货单价改变 index 当前操作行的下标 row 当前行
    goodsCountOrsalesPriceChange(index, row) {
      if (row['exWarehouseCount'] > row['count']) {
        this.$message({
          message: '出库数量不应大于库存',
          type: 'warning',
        });
        row['exWarehouseCount'] = 1;
      }
      if (row['salesPrice'] < 0 || row['salesPrice'] == null || row['salesPrice'] == '') {
        row['salesPrice'] = 0;
      }
      if (row['exWarehouseCount'] < 0 || row['exWarehouseCount'] == null || row['exWarehouseCount'] == '') {
        row['exWarehouseCount'] = 0;
      }
      let salesDetailTotalPrice = 0; //销售退货单总价
      let salesDetailProfit = 0; //销售退货单利润
      let salesDetailgoodsCount = 0;
      //1.获取当前行的数据进行赋值
      this.salesOrderForm.salesDetails.forEach((item, i) => {
        if (index == i) {
          item['totalPrice'] = row['exWarehouseCount'] * row['salesPrice'];
          item['salesDetailProfit'] = row['exWarehouseCount'] * (row['salesPrice'] - row['price']);
          item['goodsCount'] = row['exWarehouseCount'];
          item['salesPrice'] = row['salesPrice'];
        }
        //2.计算每个订单的总价 利润 数量
        salesDetailTotalPrice += item['totalPrice'];
        salesDetailProfit += item['salesDetailProfit'];
        salesDetailgoodsCount += item['goodsCount'];
      });
      //计算总数 总利润 总价格
      //销售退货单总价=每个销售详情单单的总价之和+运输费用+其他费用
      this.salesOrderForm.salesTotalPrice =
        salesDetailTotalPrice + parseInt(this.salesOrderForm.transportPrice) + parseInt(this.salesOrderForm.otherPrice);
      //销售退货单利润=每个销售详情单单的利润之和-（运输费用+其他费用）
      this.salesOrderForm.salesProfit = salesDetailProfit - (parseInt(this.salesOrderForm.transportPrice) + parseInt(this.salesOrderForm.otherPrice));
      this.salesOrderForm.goodsTotalCount = salesDetailgoodsCount;
    },
    //运输费用或其他费用改变
    ransportOrotherPriceChange() {
      if (this.salesOrderForm.transportPrice == '' || this.salesOrderForm.transportPrice < 0 || this.salesOrderForm.transportPrice == null) {
        this.salesOrderForm.transportPrice = 0;
      }
      if (this.salesOrderForm.otherPrice == '' || this.salesOrderForm.otherPrice < 0 || this.salesOrderForm.otherPrice == null) {
        this.salesOrderForm.otherPrice = 0;
      }
      //1.先获取原本的（运输费用+其他费用）
      let ransportOrotherPrice = 0;
      let salesDetailTotalPrice = 0; //销售详情单总价
      //2. 计算销售详情单单的总价之和
      this.salesOrderForm.salesDetails.forEach((item, i) => {
        salesDetailTotalPrice += item['totalPrice'];
      });
      ransportOrotherPrice = this.salesOrderForm.salesTotalPrice - salesDetailTotalPrice;
      //3.减掉原本的(运输费用+其他费用） 再加上新的(运输费用+其他费用）
      //销售退货单总价=每个销售详情单单的总价之和+（运输费用+其他费用）
      this.salesOrderForm.salesTotalPrice +=
        parseInt(this.salesOrderForm.transportPrice) + parseInt(this.salesOrderForm.otherPrice) - ransportOrotherPrice;
      //销售退货单利润=每个销售详情单单的利润之和-（运输费用+其他费用）
      this.salesOrderForm.salesProfit -=
        parseInt(this.salesOrderForm.transportPrice) + parseInt(this.salesOrderForm.otherPrice) - ransportOrotherPrice;
    },
    //申请
    addSalesOrder() {
      if (this.salesOrderForm.salesDetails.length == 0) {
        this.$message({
          message: '请选择单品',
          type: 'warning',
        });
      } else if (this.salesOrderForm.clientAddress == '' || this.salesOrderForm.clientAddress == null) {
        this.$message({
          message: '请选择收获地址',
          type: 'warning',
        });
      } else if (this.salesOrderForm.clientId == '' || this.salesOrderForm.clientId == null) {
        this.$message({
          message: '请选择客户',
          type: 'warning',
        });
      } else if (this.salesOrderForm.payType == '' || this.salesOrderForm.payType == null) {
        this.$message({
          message: '请选择收获收款方式',
          type: 'warning',
        });
      } else {
        let success = true;
        //判断采购计划是否含有采购数量为空的数据
        for (let i = 0; i < this.salesOrderForm.salesDetails.length; i++) {
          const item = this.salesOrderForm.salesDetails[i];
          if (item.goodsCount == 0 || item.goodsCount == NaN) {
            this.$message({ message: '销售退货单中含有数量为0的数据', type: 'warning' });
            success = false;
            break; //终止所有for循环
          }
        }
        if (success) {
          let tempaddress = this.salesOrderForm.clientAddress;
          this.salesOrderForm.clientAddress = '';
          this.salesOrderForm.clientAddress = this.salesOrderForm.areadata + tempaddress;
          this.$api.sales.addSalesOrder([this.salesOrderForm]).then((res) => {
            const { data, success, message } = res.data;
            if (!success) {
              this.$message.error(message);
            } else {
              this.$message({
                message: message,
                type: 'success',
              });
              this.loadData();
              this.applicationSalesDiolog.Visible = false;
            }
          });
        }
      }
    },
    //-----------------销售开单---------------------
    //撤销
    async cancelSalesReturnRequest() {
      if (this.salesReturnIds.length == 0) {
        this.$message({
          message: '请选择数据',
          type: 'warning',
        });
      } else {
        await this.$api.salesReturn.cancelSalesReturnRequest(this.salesReturnIds).then((res) => {
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
    //提交
    async submitApplications() {
      if (this.salesReturnIds.length == 0) {
        this.$message({
          message: '请选择数据',
          type: 'warning',
        });
      } else {
        await this.$api.salesReturn.submitApplications(this.salesReturnIds).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message.error(message);
          } else {
            this.$message({
              message: message,
              type: 'success',
            });
            this.loadData();
            this.applicationSalesDiolog.Visible = false;
          }
        });
      }
    },
  },
  created() {
    this.loadData();
    this.getWarehouseList();
  },
};
</script>

<style lang="less" scoped>
.salesInvoicing {
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
  .demo-table-expand {
    font-size: 10px;
    .label {
      width: 90px;
      color: #012558;
      margin-left: 20px;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 20%;
    }
  }
  #applicationSalesDiolog {
    .add_1 {
      > div {
        display: grid;
        grid-template-columns: 3fr 10fr;
        border: 1px solid red;
      }
    }
    .dialogSelectInput {
      display: grid;
      grid-template-columns: 4fr 1fr 1fr 0.3fr 0.3fr;
      grid-column-gap: 3px;
    }
  }
}
</style>
