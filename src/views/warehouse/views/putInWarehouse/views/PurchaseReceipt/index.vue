<template>
  <div class="putInWarehouse_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="warning" size="mini" class="el-icon-check" @click="CreatePutinWarehousId()">提交</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="" ref="test" :data="table.purchaseOrderList">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column label="采购单号" align="center" prop="purchaseOrderId">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>采购计划编号: {{ scope.row.purchaseId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.purchaseOrderId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="采购单号" align="center" prop="purchaseId" v-if="false"> </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.orderStateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="物品采购总价" align="center" width="120px">
        <template slot-scope="scope">
          {{ scope.row.orderTotalPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="otherPrice" label="其他费用" align="center"> </el-table-column>
      <el-table-column prop="transportPrice" label="运输费用" align="center"> </el-table-column>
      <el-table-column label="订单总价" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderTotalPrice + scope.row.otherPrice + scope.row.transportPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="totalCount" label="采购总数" align="center"> </el-table-column>
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
          <el-button type="text" size="small" @click="showorderDetailDialog(scope.row.purchaseOrderId)" icon="el-icon-edit">详细信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 操作表格 -->
    <el-drawer class="editPlanItem" :visible.sync="orderDetailDialog.show" direction="rtl" size="70%">
      <el-divider></el-divider>
      <!-- <el-button size="mini" type="primary" @click="updatePurchaseDetails()" plain>保存</el-button>
      <el-button size="mini" type="primary" @click="editTable.show = false" plain>关闭</el-button> -->
      <el-table :header-cell-style="{ 'text-align': 'center' }" border :data="orderDetailDialog.orderDetailItems">
        <el-table-column prop="purchaseOrderDetailId" label="采购明细编号" width="120" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>采购计划编号: {{ scope.row.purchaseOrderId }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag disable-transitions>{{ scope.row.purchaseOrderDetailId }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
        <el-table-column prop="count" label="采购数量" align="center"> </el-table-column>
        <el-table-column prop="totalPrice" label="物品采购价" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.totalPrice / scope.row.count }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="物品总价" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
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
        warehouseId: '',
        supplierId: '',
        drawerName: '',
        orderState: 3,
      },
      table: {
        purchaseOrderList: [],
        total: 0,
      },
      orderDetailDialog: {
        editPurchaseId: '',
        show: false,
        orderDetailItems: [],
      },
      SourceOrderIds: [],
    };
  },
  methods: {
    loadData() {
      this.getPurchaseOrder();
    },

    getElTagClass(row) {
      if (row.orderStateStr == '已审核') {
        return 'success';
      } else if (row.orderStateStr == '审核中') {
        return 'warning';
      } else {
        return '';
      }
    },

    //获取引用采购单数据
    async getPurchaseOrder() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      if (queryForm.orderState == '') {
        queryForm.orderState = '0';
      }
      if (queryForm.supplierId == '') {
        queryForm.supplierId = '0';
      }
      queryForm.orderState = parseInt(queryForm.orderState);
      queryForm.supplierId = parseInt(queryForm.supplierId);
      await this.$api.purchaseOrder.getSubmitOrderList(queryForm).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        this.table.purchaseOrderList = data.purchaseOrders;
        this.table.total = data.count;
        this.table.loading = false;
      });
    },

    async CreatePutinWarehousId() {
      if (this.SourceOrderIds.length == 0) {
        this.$message({
          message: '请选择提交的采购入库单',
          type: 'warning',
        });
      } else {
        const form = {
          SourceOrderIds: this.SourceOrderIds,
          PutInWarehouseType: 1,
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
      }
    },

    selectRows(selection) {
      this.SourceOrderIds = [];
      selection.forEach((element) => {
        this.SourceOrderIds.push(element.purchaseOrderId);
        //this.purchaseIds.push(element.purchaseId);
      });
    },
    //显示采购单子项目
    showorderDetailDialog(purchaseOrderId) {
      this.getOrderDetailByPurchaseOrderId(purchaseOrderId);
      this.orderDetailDialog.show = true;
    },
    //获取采购订单详细项目列表
    async getOrderDetailByPurchaseOrderId(purchaseOrderId) {
      console.log(purchaseOrderId);
      await this.$api.purchaseOrder.getOrderDetailByPurchaseOrderId(purchaseOrderId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.orderDetailDialog.orderDetailItems = data;
      });
    },
  },
  created() {
    this.loadData();
  },
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
      div {
        margin-left: 10px;
      }
    }
    .edit_query {
      width: 100%;
      display: grid;
      // border: 1px solid red;
      grid-template-columns: 2fr 2fr 1.5fr;
      grid-column-gap: 5px;
      .edit_query_1 {
        width: 100%;
        text-align: center;
      }
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
