<template>
  <div class="putInWarehouse_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="warning" size="mini" class="el-icon-check" @click="CreatePutinWarehousId()">提交</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="" ref="test" :data="table.salesReturnList">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column label="销售退款单号" align="center" prop="salesReturnId">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>销售退库单号: {{ scope.row.salesReturnId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.salesReturnId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- <el-table-column label="销售退货单号" align="center" prop="salesReturnId" v-if="false"> </el-table-column> -->
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.salesReturnStateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="销售退货单总价" align="center" width="120px">
        <template slot-scope="scope">
          {{ scope.row.returnTotalPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="otherPrice" label="其他费用" align="center"> </el-table-column>
      <el-table-column prop="transportPrice" label="运输费用" align="center"> </el-table-column>
      <el-table-column label="订单总价" align="center">
        <template slot-scope="scope">
          {{ scope.row.returnTotalPrice + scope.row.otherPrice + scope.row.transportPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="goodsTotalCount" label="采购总数" align="center"> </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.remarks || '无' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showplanDetailDiolog(scope.row)" icon="el-icon-edit">详细信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作表格 -->
    <el-drawer class="editPlanItem" :visible.sync="PurchaseDetailDiolog.show" direction="rtl" size="70%">
      <el-divider></el-divider>
      <!-- <el-button size="mini" type="primary" @click="updatePurchaseDetails()" plain>保存</el-button>
      <el-button size="mini" type="primary" @click="editTable.show = false" plain>关闭</el-button> -->
      <el-table :data="salesReturnDetailDialog.salesReturnDetails" :header-cell-style="{ 'text-align': 'center' }" border>
        <el-table-column prop="salesReturnDetailId" label="退货明细编号" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{ scope.row.salesReturnDetailId }}</el-tag>
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
  </div>
</template>

<script>
export default {
  name: 'InvoicingManageIndex',
  data() {
    return {
      queryForm: {
        page: 1,
        row: 10,
        publicationDates: [],
        warehouseId: '', //出货仓库
        conditions: '', //综合条件
        SalesType: '3',
        salesReturnState: '', //销售单状态
      },
      table: {
        salesReturnList: [],
        total: 0,
        loading: true,
      },
      dialogObject: {
        addVisible: false,
      },
      PurchaseDetailDiolog: {
        editPurchaseId: '',
        show: false,
        detailPlanItems: [],
      },
      //新建采购计划对话框
      PurchaseDetDiolog: {
        Visible: false,
        skuQueryForm: {
          page: 1,
          row: 10,
          conditions: '',
          goodsTypeId: '',
        },
        purchaseOrderListDetail: [],
        tatol: 0,
      },
      salesReturnDetailDialog: {
        editSalesId: '',
        show: false,
        salesReturnDetails: [],
      },
      SourceOrderIds: [],
      OrderStates:[],
    };
  },
  methods: {
    loadData() {
      this.getSalesReturnList();
    },
    getElTagClass(row) {
      console.log(row);
      if (row.orderStateStr == '已审核') {
        return 'success';
      } else if (row.orderStateStr == '审核中') {
        return 'warning';
      } else {
        return '';
      }
    },
    //打开添加弹窗
    openAddDialog() {
      this.dialogObject.addVisible = true;
    },
    //获取提交销售订单列表
    async getSalesReturnList() {
      this.IsToBeList = false;
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.salesReturnState = queryForm.salesReturnState == '' ? 0 : parseInt(queryForm.salesReturnState);
      await this.$api.salesReturn.getSalesReturnListByState({Row:100,Page:1,SalesReturnState:3}).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        this.table.salesReturnList = data.salesReturns;
        this.table.total = data.count;
        this.table.loading = false;
      });
    },
    //获取采购订单详细项目列表
    async getDetailPlanListByPurchasId(row) {
      await this.$api.purchase.getDetailPlanListByPurchasId(row).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.PurchaseDetDiolog.purchaseOrderListDetail = data;
        console.log(this.PurchaseDetDiolog.purchaseOrderListDetail);
      });
    },

    selectRows(selection) {
      console.log(selection);
      this.SourceOrderIds = [];
      this.OrderStates=[];
      selection.forEach((element) => {
        this.SourceOrderIds.push(element.salesReturnId);
        this.OrderStates.push(element.salesReturnStateStr)
        //this.purchaseIds.push(element.purchaseId);
      });
    },
    async CreatePutinWarehousId() {
      // console.log(this.OrderStates);
      // for (let i = 0; i < this.OrderStates.length; i++) {
      //   if (this.OrderStates[i] != '已审核') {
      //     this.$message({
      //       message: '只能提交已审核的出库单！',
      //       type: 'warning',
      //     });
      //     this.OrderStates = [];
      //     return false;
      //   }
      // }
      const form = {
        SourceOrderIds: this.SourceOrderIds,
        PutInWarehouseType: 3,
      };
      await this.$api.Putinwarehous.CreatePutinWarehousId(form).then((res) => {
        const { success, message } = res.data;
        if (!success) {
          console.log(message);
          this.$message.error('提交失败！');
        } else {
          this.$message({ message: '提交成功！', type: 'success' });
          this.loadData();
        }
      });
    },
    //获取销售退货单详细项目列表
    async getSalesReturnDatailByReturnId(salesReturnId) {
      console.log(salesReturnId);
      await this.$api.salesReturn.getSalesReturnDatailByReturnId(salesReturnId).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        this.salesReturnDetailDialog.salesReturnDetails = data;
      });
    },
    //显示采购单子项目
    showplanDetailDiolog(row) {
      console.log(row);
      this.PurchaseDetailDiolog.editPurchaseId = row.salesReturnId;
      this.getSalesReturnDatailByReturnId(row.salesReturnId);
      this.PurchaseDetailDiolog.show = true;
    },
  },
  created() {
    this.loadData();
  },
  // },
};
</script>

<style lang="less" scoped>
.putInWarehouse_container {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 5px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 2fr 1.1fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
    }
    .edit_query {
      width: 100%;
      display: grid;
      border: 1px solid red;
      grid-template-columns: 2fr 2fr 1.5fr;
      grid-column-gap: 5px;
    }
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
}
</style>
