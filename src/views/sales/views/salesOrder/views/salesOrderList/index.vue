<template>
  <div class="purchasOrder">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-dropdown>
          <el-button type="primary" size="mini"> 更多菜单<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="getSalesList()"> 历史记录 </el-dropdown-item>
            <el-dropdown-item @click.native="getNeedRreviewSalesByUserId()">待办事项</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" size="mini" class="el-icon-check" @click="adoptSalesOrderRequest()" v-show="IsToBeList == true">
          审核
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="rejectOrderRequest()" v-show="IsToBeList == true">
          驳回
        </el-button>
      </div>
      <div class="edit_query">
        <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
        </el-date-picker>
        <el-select size="mini" v-model="queryForm.salesState" placeholder="订单状态" v-show="IsToBeList == false">
          <el-option label="审核中" value="2"></el-option>
          <el-option label="已审核" value="4"></el-option>
          <el-option label="待收货" value="5"></el-option>
          <el-option label="待结算" value="6"></el-option>
          <el-option label="结算中" value="7"></el-option>
          <el-option label="已完成" value="8"></el-option>
          <el-option label="已取消" value="9"></el-option>
        </el-select>
        <el-select size="mini" v-model="queryForm.warehouseId" placeholder="开单仓库">
          <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
        </el-select>
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入关键字"></el-input>
        <el-button type="primary" @click="selectSalesList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.salesOrderList"
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
      <el-table-column prop="warehouseName" label="出货仓库" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"> </el-table-column>
      <el-table-column label=" 顾客信息" width="120px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showClientInfo(scope.row)" plain>查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="销售单据" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.salesNoteSrc == '' || scope.row.salesNoteSrc == null"
            type="primary"
            size="mini"
            @click="createSalesNoteBysalesId(scope.row)"
            plain
            >点击生成
          </el-button>
          <el-button v-else type="success" size="mini" @click="lookCreateSalesNote(scope.row)" plain>查看</el-button>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="编辑" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openApprovalDetails(scope.row.salesId)" plain>审核详情</el-button>
          <el-button type="primary" size="mini" @click="showSalesDetailDiolog(scope.row)" plain>订单详情</el-button>
          <el-button v-show="scope.row.salesStateStr == '已出库'" type="success" size="mini" @click="finishSales(scope.row.salesId)" plain>
            完成
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
    <!-- 销售单详情 -->
    <el-drawer title="销售单详情" :visible.sync="salesDetailDiolog.show" direction="rtl" size="70%">
      <el-divider></el-divider>
      <el-button size="mini" type="primary" @click="salesDetailDiolog.show = false" plain>关闭</el-button>
      <el-table :data="salesDetailDiolog.salesDetails" :header-cell-style="{ 'text-align': 'center' }" border>
        <el-table-column prop="salesDetailId" label="销售明细编号" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.salesDetailId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skuId" label="物品编号" width="200px" align="center"> </el-table-column>
        <el-table-column label="销售单价" align="center">
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
    <el-dialog title="客户详情" :visible.sync="clientDialog.visible" center width="60%">
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
    <!-- 审核记录对话框 -->
    <el-dialog title="审批记录" center :visible.sync="approvalDetaildialog.visible" width="30%">
      <el-timeline>
        <el-timeline-item :timestamp="approvalDetaildialog.approvalDetails.createTime" type="primary" icon="el-icon-more">
          <p>提交人</p>
          {{ approvalDetaildialog.approvalDetails.applicantName }}
        </el-timeline-item>
        <el-timeline-item
          v-for="(Step, index) in approvalDetaildialog.approvalDetails.workFlowSteps"
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
        <el-button @click="approvalDetaildialog.visible = false"> 关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 销售出库单据对话框 -->
    <el-dialog title="销售出库单据" center :visible.sync="salesNotedialog.visible" fullscreen>
      <el-button type="primary" size="mini" class="el-icon-download" @click="downloadsalesNote()">
        点击下载
      </el-button>
      <div ref="file"></div>
    </el-dialog>
  </div>
</template>

<script>
let docx = require('docx-preview');
import axios from 'axios';
import { baseUrl } from '@/config/defaultString.js';
import store from '@/store';
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
        salesState: '', //销售单状态
      },
      //新建销售订单表
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
        salesOrderList: [],
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
      }, //客服信息对话框
      approvalDetaildialog: {
        visible: false,
        approvalDetails: {},
      }, //审核详情对话框
      salesNotedialog: {
        visible: false,
      },
      salesId: [],
      warehouseList: [], //仓库列表
      salesNoteSrc: '',
      IsToBeList: false, //是否为待办事项
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.getSalesList();
    },
    //获取提交销售订单列表
    async getSalesList() {
      this.IsToBeList = false;
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.salesState = queryForm.salesState == '' ? 0 : parseInt(queryForm.salesState);
      await this.$api.sales.getSalesList(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.salesOrderList = data.sales;
        this.table.total = data.count;
        this.table.loading = false;
      });
    },
    //获取提交销售订单列表
    async getNeedRreviewSalesByUserId() {
      this.IsToBeList = true;
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.salesState = queryForm.salesState == '' ? 0 : parseInt(queryForm.salesState);
      await this.$api.sales.getNeedRreviewSalesByUserId(queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.salesOrderList = data.sales;
        this.table.total = data.count;
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
    //显示销售单子项目
    showSalesDetailDiolog(row) {
      this.salesDetailDiolog.editSalesId = row.salesId;
      this.getSalesDatailBySalesId(row.salesId);
      this.salesDetailDiolog.show = true;
    },
    getElTagClass(row) {
      if (row.salesStateStr == '待结算') {
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
    //获取销售订单选中行的数据
    selectOrderRows(selection) {
      this.salesId = [];
      selection.forEach((element) => {
        this.salesId.push(element.salesId);
      });
    },
    //审核
    adoptSalesOrderRequest() {
      let adopt = true;
      if (this.salesId.length == 0) {
        this.$message({
          message: '请选择要审核的销售单',
          type: 'warning',
        });
        return false;
      } else {
        //找出在 销售数据列表ID包含在 salesOrderList 里的数据 判断stateStr的值 是否全部是待审核
        this.table.salesOrderList.forEach((plan, index) => {
          //adopt = false 说明找到符合的数据 函数返回
          if (adopt == false) {
            return false;
          }
          this.salesId.forEach((purchaseOrderId) => {
            if (plan.purchaseOrderId == purchaseOrderId) {
              //找到不符合的数据 返回 并设置adopt = false
              if (this.table.salesOrderList[index]['salesStateStr'] !== '审核中') {
                this.$message({
                  message: '请选择审核中的销售单',
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
        this.$api.sales.adoptSalesOrderRequest(this.salesId).then((res) => {
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
      this.$prompt('驳回原因', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: '',
        inputErrorMessage: '请输入驳回原因',
      }).then(({ value }) => {
        let adopt = true;
        if (this.salesId.length == 0) {
          this.$message({
            message: '请选择要审核的销售单',
            type: 'warning',
          });
          return false;
        } else {
          //找出在 销售数据列表ID包含在 salesOrderList 里的数据 判断stateStr的值 是否全部是待审核
          this.table.salesOrderList.forEach((plan, index) => {
            //adopt = false 说明找到符合的数据 函数返回
            if (adopt == false) {
              return false;
            }
            this.salesId.forEach((purchaseOrderId) => {
              if (plan.purchaseOrderId == purchaseOrderId) {
                //找到不符合的数据 返回 并设置adopt = false
                if (this.table.salesOrderList[index]['salesStateStr'] !== '审核中') {
                  this.$message({
                    message: '请选择审核中的销售单',
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
          this.$api.sales.rejectSalesOrderRequest(this.salesId, value).then((res) => {
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
        console.log(data);
        this.approvalDetaildialog.approvalDetails = data;
      });
    },
    //查看审批详情
    openApprovalDetails(salesId) {
      this.approvalDetaildialog.visible = true;
      this.getApprovalDetails(salesId);
    },
    //新建销售单据
    createSalesNoteBysalesId(row) {
      this.$api.sales.createSalesNoteBysalesId(row.salesId).then((res) => {
        let { success, message } = res.data;
        if (!success) {
          console.log(message);
          this.$message.error(message);
        } else {
          this.$message({ message: message, type: 'success' });
          this.loadData();
        }
      });
    },
    lookCreateSalesNote(row) {
      this.salesNoteSrc = row.salesNoteSrc;
      const accessToken = store.getters['token/accessToken'];
      if (accessToken !== null) {
        axios({
          method: 'get',
          responseType: 'blob', // 因为是流文件，所以要指定blob类型
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
          url: baseUrl + '/api/Background/Sales/GetSalesNoteFileBysalesId?salesId=' + row.salesId + '',
        }).then((res) => {
          if (res.data.size == 0) {
            this.$message({
              message: '警告哦，这是一条警告消息',
              type: 'warning',
            });
          } else {
            this.salesNotedialog.visible = true;
            docx.renderAsync(res.data, this.$refs.file); //渲染到页面
          }
        });
      }
    },
    init(file) {
      var reader = new FileReader();
      reader.onload = (e) => {
        let arr = e.target.result.split(',');
        let data = window.atob(arr[1]);
        let mime = arr[0].match(/:(.*?);/)[1];
        let ia = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
          ia[i] = data.charCodeAt(i);
        }
        const blob = new Blob([ia], { type: mime });
        docx.renderAsync(blob, this.$refs.file).then((x) => {
          this.salesNotedialog.visible = true;
        }); // 渲染到页面
      };
      // 传入一个参数对象即可得到基于该参数对象的文本内容
      reader.readAsDataURL(file);
    },
    //下载文件
    downloadsalesNote() {
      window.open(baseUrl + this.salesNoteSrc, '_self');
    },
    //销售单完成
    finishSales(salesId) {
      this.$api.sales.finishSalesById(salesId).then((res) => {
        let { success, message } = res.data;
        if (!success) {
          console.log(message);
          this.$message.error(message);
        } else {
          this.$message({ message: message, type: 'success' });
          this.loadData();
        }
      });
    },
    //销售退货
    salesOrderReturnRequest() {
      let adopt = true;
      if (this.salesId.length == 0) {
        this.$message({
          message: '请选择要审核的销售单',
          type: 'warning',
        });
        return false;
      } else {
        //找出在 销售数据列表ID包含在 salesOrderList 里的数据 判断stateStr的值 是否全部是已完成或者已出库
        this.table.salesOrderList.forEach((plan, index) => {
          //adopt = false 说明找到符合的数据 函数返回
          if (adopt == false) {
            return false;
          }
          this.salesId.forEach((purchaseOrderId) => {
            if (plan.purchaseOrderId == purchaseOrderId) {
              //找到不符合的数据 返回 并设置adopt = false
              if (this.table.salesOrderList[index]['salesStateStr'] !== '已完成' || this.table.salesOrderList[index]['salesStateStr'] !== '已出库') {
                this.$message({
                  message: '请选择已完成或者已出库的销售单',
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
        this.$api.sales.salesOrderReturnRequest(this.salesId).then((res) => {
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
  },
  created() {
    this.loadData();
    this.getWarehouseList();
    if (this.$route.query.IsToBeList) {
      this.IsToBeList = true;
    }
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
      grid-template-columns: 1fr 2fr 2fr 2fr 0.5fr 0.5fr;
      grid-column-gap: 5px;
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
  .dialogSelectInput {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
