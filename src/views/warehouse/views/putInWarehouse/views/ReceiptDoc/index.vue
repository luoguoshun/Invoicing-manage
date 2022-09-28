<template>
  <div class="ReceiptDoc_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="warning" size="mini" class="el-icon-edit" round>返回编辑</el-button>
        <el-button type="success" size="mini" class="el-icon-check" round @click="submitPutinWarehousApply()">确认入库</el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-select size="mini" placeholder="请选择入库仓库">
            <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input size="mini" label-width="80px" placeholder="请输入关键字"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectGoods()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      @row-click="getPutinWarehouseOrderDetail"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
      ref="supplierSkuTable"
      :data="table.PutinWareOrderList"
    >
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="putinWarehousId" label="入库单号" align="center"> </el-table-column>
      <el-table-column prop="putStateStr" label="状态" align="center"> </el-table-column>
      <el-table-column prop="putTypeStr" label="入库类型" align="center"> </el-table-column>
      <el-table-column prop="sourceOrderId" label="来源单号" align="center"> </el-table-column>
      <el-table-column prop="operationPerson" label="提交人" align="center"> </el-table-column>
      <el-table-column prop="warehouseName" label="仓库名称" align="center"> </el-table-column>
      <el-table-column prop="orderTotalPrice" label="采购总价" align="center"> </el-table-column>
      <el-table-column prop="unit" label="物品总成本" align="center"> </el-table-column>
      <el-table-column prop="otherCost" label="其他费用" align="center"> </el-table-column>
      <el-table-column prop="transportCost" label="运输费用" align="center"> </el-table-column>
      <el-table-column prop="orderTotalPrice" label="订单总价" align="center"> </el-table-column>
      <el-table-column prop="putTotalNum" label="入库总量" align="center"> </el-table-column>
      <el-table-column label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="updatePurchasePlan(scope.row)" plain>修改</el-button>
          <el-button type="info" size="mini" @click="getPutinWarehouseOrderDetail(scope.row)" plain>详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 入库单明细表格 -->
    <div class="editPlanItem">
      <el-divider></el-divider>
      <el-table :header-cell-style="{ 'text-align': 'center' }" border :data="table.PutinWarehousDetailList">
        <el-table-column prop="putinWarehousDetailId" label="入库明细编号" width="120" align="center"> </el-table-column>
        <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="count" label="采购数量" align="center"> </el-table-column>
        <el-table-column prop="putinCount" label="入库数量" align="center"> </el-table-column>
        <el-table-column prop="purchasePrice" label="物品采购价" align="center"> </el-table-column>
        <el-table-column prop="goodsCost" label="物品成本" align="center"> </el-table-column>
        <el-table-column prop="purchaseAmount" label="物品采购总价" align="center"> </el-table-column>
        <el-table-column prop="goodsTotalcost" label="物品总成本" align="center"> </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
        conditions: '',
        WarehouseType: 0,
      },
      table: {
        PutinWareOrderList: [],
        PutinWarehousDetailList: [],
        PutinWareOrdertotal: 0,
        PutinWarehousDetailtotal: 0,
      },
      PutinWarehousIds: [],
      PutinWarehousState: [],
    };
  },
  methods: {
    loadData() {
      this.getPutinWarehouseOrder();
      this.getWarehouseList();
    },

    //获取入库单信息
    async getPutinWarehouseOrder() {
      await this.$api.stock
        .getPutInWarehouseOrder(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.WarehouseType)
        .then((res) => {
          const { data, success, message } = res.data;
          console.log(data);
          if (!success) {
            console.log(message);
            return;
          }
          this.table.PutinWareOrderList = data.data;
          this.table.PutinWareOrdertotal = data.count;
        });
    },

    //获取入库单详情信息
    async getPutinWarehouseOrderDetail(row) {
      await this.$api.stock.GetPutinWarehousDetail(this.queryForm.page, this.queryForm.row, row.putinWarehousId).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        this.table.PutinWarehousDetailList = data.data;
        this.table.PutinWarehousDetailtotal = data.count;
      });
    },

    //提交入库单申请
    async submitPutinWarehousApply() {
      for (let i = 0; i < this.PutinWarehousState.length; i++) {
        debugger;
        if (this.PutinWarehousState[i] == '已完成') {
          this.$message({
            message: '只能提交编辑中的入库单！',
            type: 'warning',
          });
          this.PutinWarehousState = [];
          return false;
        }
      }
      if (this.PutinWarehousIds.length == 0) {
        this.$message({
          message: '请选择提交的入库单',
          type: 'warning',
        });
      } else {
        await this.$api.stock.SubmitPutinWarehousApply(this.PutinWarehousIds).then((res) => {
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
    selectRows(selection) {
      this.PutinWarehousIds = [];
      selection.forEach((element) => {
        this.PutinWarehousIds.push(element.putinWarehousId);
        this.PutinWarehousState.push(element.putStateStr);
      });
      console.log(this.PutinWarehousState);
    },
  },

  created() {
    this.loadData();
    //this.getWarehouseTypeList();
  },
};
</script>

<style lang="less" scoped>
.ReceiptDoc_container {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 20px 0px 10px 0px;
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
}
</style>
