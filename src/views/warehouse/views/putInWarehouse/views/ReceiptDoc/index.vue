<template>
  <div class="ReceiptDoc_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="warning" size="mini" class="el-icon-edit" round>返回编辑</el-button>
        <el-button type="success" size="mini" class="el-icon-check" round>确认入库</el-button>
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
    :data="table.PutinWareOrderList">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="putinWarehousId" label="入库单号" align="center"> </el-table-column>
      <el-table-column prop="putStateStr" label="状态" align="center"> </el-table-column>
      <el-table-column prop="putTypeStr" label="入库类型" align="center"> </el-table-column>
      <el-table-column prop="sourceOrderId" label="来源单号" align="center"> </el-table-column>
      <el-table-column prop="operationPerson" label="提交人" align="center"> </el-table-column>
      <el-table-column prop="warehouseName" label="仓库名称" align="center"> </el-table-column>
      <el-table-column prop="unit" label="货款总价" align="center"> </el-table-column>
      <el-table-column prop="unit" label="货品成本" align="center"> </el-table-column>
      <el-table-column prop="totalPrice" label="总价" align="center"> </el-table-column>
      <el-table-column prop="putTotalNum" label="入库数量" align="center"> </el-table-column>
    </el-table>


        <!-- 操作表格 -->
    <div class="editPlanItem">
      <el-divider></el-divider>
      <el-table  :header-cell-style="{ 'text-align': 'center' }" border 
      :data="table.PutinWarehousDetailList">
        <el-table-column prop="putinWarehousDetailId" label="入库明细编号" width="120" align="center">
        </el-table-column>
        <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="count" label="采购数量" align="center">
          <template >
            <el-input type="number" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="入库数量" align="center">
          <template >
            <el-input type="number" size="mini" ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="物品采购价" align="center">
          <template >
            <el-tag type="success"></el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="物品总价" align="center">
          <template >
            <el-tag type="success"></el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template >
            <el-button size="mini" type="danger" >删除</el-button>
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
        PutinWarehousDetailList:[],
        PutinWareOrdertotal: 0,
        PutinWarehousDetailtotal:0,
      },
    };
  },
  methods: {
    loadData() {
      this.getPutinWarehouseOrder();
    },

    async getPutinWarehouseOrder() {
      await this.$api.stock.getPutInWarehouseOrder(
        this.queryForm.page, 
        this.queryForm.row, 
        this.queryForm.conditions, 
        this.queryForm.WarehouseType).then((res) => {
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

    async getPutinWarehouseOrderDetail(row){
      await this.$api.stock.GetPutinWarehousDetail(
        this.queryForm.page, 
        this.queryForm.row, 
        row.putinWarehousId).then((res) => {
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
