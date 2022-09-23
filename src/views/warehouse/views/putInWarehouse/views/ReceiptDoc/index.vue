<template>
  <div class="ReceiptDoc_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_query">
        <div class="edit_query_1">
           <label>收货仓库 </label>
          <el-select size="mini"  placeholder="请选择类别">
            <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input  size="mini" label-width="80px" placeholder="请输入单据的关键字"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="GetSKUListBySupplierId()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="" ref="supplierSkuTable">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column label="入库单号" align="center"> </el-table-column>
      <el-table-column label="状态" align="center"> </el-table-column>
      <el-table-column label="入库类型" align="center"> </el-table-column>
      <el-table-column label="入库类型单号" align="center"> </el-table-column>
      <el-table-column label="提交人" align="center"> </el-table-column>
      <el-table-column prop="typeStr" label="仓库名称" align="center"> </el-table-column>
      <el-table-column prop="unit" label="货款总价" align="center"> </el-table-column>
      <el-table-column prop="unit" label="货品成本" align="center"> </el-table-column>
      <el-table-column prop="unit" label="总价" align="center"> </el-table-column>
      <el-table-column prop="unit" label="入库数量" align="center"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'InvoicingManageIndex',
  data() {
    return {};
  },
  methods: {},
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
