<template>
  <div class="ReceiptDoc_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-check" @click="submitPutinWarehousApply()">一键入库</el-button>
        <el-button type="danger " size="mini" class="el-icon-check" @click="deletetPutinWarehousApply()">删除</el-button>
      </div>
      <div class="edit_query">
        <el-select size="mini" placeholder="请选择入库仓库" v-model="queryForm.warehouseId">
          <el-option v-for="item in warehouseList" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
        </el-select>
        <el-input size="mini" label-width="80px" placeholder="请输入关键字"></el-input>
        <el-button type="primary" @click="getPutinWarehouseOrder()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
     <!-- @row-click="getPutinWarehouseOrderDetail" -->
    <el-table
     
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
      ref="supplierSkuTable"
      :data="table.PutinWareOrderList"
    >
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="putinWarehousId" label="入库单号" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>入库单号: {{ scope.row.putinWarehousId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.putinWarehousId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="putStateStr" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.putStateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="putTypeStr" label="入库类型" align="center"> </el-table-column>
      <el-table-column prop="sourceOrderId" label="来源单号" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>来源单号: {{ scope.row.sourceOrderId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.sourceOrderId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="operationPerson" label="提交人" align="center"> </el-table-column>
      <el-table-column prop="warehouseName" label="仓库名称" align="center"> </el-table-column>
      <el-table-column prop="goodsCost" label="物品总成本" align="center"> </el-table-column>
      <el-table-column prop="otherCost" label="其他费用" align="center"> </el-table-column>
      <el-table-column prop="transportCost" label="运输费用" align="center"> </el-table-column>
      <el-table-column prop="orderTotalPrice" label="订单总价" align="center"> </el-table-column>
      <el-table-column prop="putTotalNum" label="入库总量" align="center"> </el-table-column>
      <el-table-column prop="actualWarehousing" label="实际入库" align="center"> </el-table-column>
      <el-table-column label="编辑" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="showplanDetailDiolog(scope.row)" plain>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="table.PutinWareOrdertotal"
        :page-sizes="[10, 15, 20, 25]"
        :current-page="queryForm.page"
        :page-size="queryForm.row"
        layout="total, sizes, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </div>

    <!-- 入库单明细表格 -->
    <el-drawer class="editPlanItem" :visible.sync="PurchaseDetailDiolog.show" direction="rtl" size="80%">
      <el-divider></el-divider>
      <!-- <el-button size="mini" type="primary" @click="updatePutinWarehousOrder()" plain>部分入库</el-button> -->
      <!-- <el-button size="mini" type="primary" @click="editTable.show = false" plain>关闭</el-button> -->
      <el-table :header-cell-style="{ 'text-align': 'center' }" border :data="table.PutinWarehousDetailList">
        <el-table-column prop="putinWarehousDetailId" label="入库明细编号" width="120" align="center"> </el-table-column>
        <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="supplierName" label="物品供应商" align="center"> </el-table-column>
        <el-table-column prop="purchaseCount" label="采购数量" align="center"> </el-table-column>
        <el-table-column label="入库数量" align="center">
          <template slot-scope="scope">
            <el-input-number type="number" size="mini" v-model.number="scope.row.putinCount"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" label="物品采购价" align="center"> </el-table-column>
        <el-table-column prop="goodsCost" label="物品成本" align="center"> </el-table-column>
        <el-table-column prop="purchaseAmount" label="物品采购总价" align="center"> </el-table-column>
        <el-table-column prop="goodsTotalcost" label="物品总成本" align="center"> </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
          <template slot-scope="scope">
            <el-input type="textare" rows="2" size="mini" v-model="scope.row.remarks"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template>
            <el-button size="mini" type="danger">删除</el-button>
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
        row: 5,
        conditions: '',
        warehouseId: '',
      },
      updateForm: {
        putTotalNum: 0,
        goodsTotalcost: 0,
      },
      table: {
        PutinWareOrderList: [],
        PutinWarehousDetailList: [],
        PutinWareOrdertotal: 0,
        PutinWarehousDetailtotal: 0,
      },
      PutinWarehousIds: [],
      PutinWarehousState: [],
      warehouseList: [],
      PurchaseDetailDiolog: {
        editPurchaseId: '',
        show: false,
        detailPlanItems: [],
      },
    };
  },
  methods: {
    loadData() {
      this.getPutinWarehouseOrder();
      this.getWarehouseList();
    },
    getElTagClass(row) {
      console.log(row);
      if (row.orderStateStr == '待编辑') {
        return 'success';
      } else if (row.orderStateStr == '已完成') {
        return 'warning';
      } else {
        return '';
      }
    },

    //获取入库单信息
    async getPutinWarehouseOrder() {
      await this.$api.Putinwarehous.getPutInWarehouseOrder(
        this.queryForm.page,
        this.queryForm.row,
        this.queryForm.conditions,
        this.queryForm.warehouseId,
      ).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        console.log(data);
        this.table.PutinWareOrderList = data.data;
        this.table.PutinWareOrdertotal = data.count;
        console.log(this.table.PutinWareOrdertotal);
      });
    },
    //获取入库单详情信息
    async getPutinWarehouseOrderDetail(row) {
      console.log(row);
      this.table.PutinWarehousDetailList=[];
      await this.$api.Putinwarehous.GetPutinWarehousDetail(1, 100, row).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        this.table.PutinWarehousDetailList = data.data;
        this.PurchaseDetailDiolog.detailPlanItems = data.data;
      });
    },
    //提交入库单申请
    async submitPutinWarehousApply() {
      for (let i = 0; i < this.PutinWarehousState.length; i++) {
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
        await this.$api.Putinwarehous.SubmitPutinWarehousApply(this.PutinWarehousIds).then((res) => {
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
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        data.warehouses.forEach((item) => {
          this.warehouseList.push({ warehouseId: item.warehouseId, warehouseName: item.warehouseName });
        });
      });
    },
    //删除入库单编号
    async deletetPutinWarehousApply() {
      if (this.PutinWarehousIds.length == 0) {
        this.$message({
          message: '请选择要删除的入库单',
          type: 'warning',
        });
        return false;
      } else {
        await this.$api.Putinwarehous.DeletetPutinWarehousApply(this.PutinWarehousIds).then((res) => {
          const { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('提交失败！');
          } else {
            this.$message({ message: '提交成功！', type: 'success' });
            this.table.PutinWarehousDetailList = [];
            this.table.PutinWarehousDetailtotal = [];
            this.loadData();
          }
        });
      }
    },
    //更新入库详情
    async updatePutinWarehousOrder() {
      console.log(this.PurchaseDetailDiolog.detailPlanItems);
      this.$api.Putinwarehous.EditPutinWarhouseOrder(this.PurchaseDetailDiolog.editPurchaseId, this.PurchaseDetailDiolog.detailPlanItems).then(
        (res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message.error(success);
          } else {
            this.$message({ message: '修改成功！', type: 'success' });
            this.loadData();
          }
        },
      );
    },
    //显示采购单子项目
    showplanDetailDiolog(row) {
      this.PurchaseDetailDiolog.editPurchaseId = row.putinWarehousId;
      this.getPutinWarehouseOrderDetail(row.putinWarehousId);
      this.PurchaseDetailDiolog.show = true;
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
    margin: 5px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 2fr 1.5fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
    }
    .edit_query {
      width: 100%;
      display: grid;
      grid-template-columns: 2fr 2fr 0.5fr 0.5fr;
      grid-column-gap: 5px;
    }
  }
}
</style>
