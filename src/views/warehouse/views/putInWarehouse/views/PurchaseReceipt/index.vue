<template>
  <div class="putInWarehouse_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" round @click="openAddDialog()"> 引用采购单 </el-button>
        <el-button type="warning" size="mini" class="el-icon-edit" round>返回编辑</el-button>
        <el-button type="success" size="mini" class="el-icon-check" round>提交</el-button>
      </div>
    </div>

     <!-- 表格 -->
    <el-table
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
      ref="supplierSkuTable"
    >
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column  label="采购单号" align="center"> </el-table-column>
      <el-table-column  label="状态" align="center"> </el-table-column>
      <el-table-column  label="物品采购总价" align="center" width="120px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.purchasePrice" placeholder="" align="center" />
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="其他费用" align="center"> </el-table-column>
      <el-table-column prop="unit" label="运输费用" align="center"> </el-table-column>
      <el-table-column prop="typeStr" label="订单总价" align="center"> </el-table-column>
      <el-table-column prop="typeStr" label="采购总数" align="center"> </el-table-column>
      <el-table-column prop="typeStr" label="入库总数" align="center"> </el-table-column>
      <el-table-column prop="typeStr" label="备注" align="center"> </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="编辑" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showEditTable(scope.row)" icon="el-icon-edit">详细信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页
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
    </div> -->

    <!-- 操作表格 -->
    <div class="editPlanItem">
      <el-divider></el-divider>
      <el-button size="mini" type="primary" @click="updatePurchaseDetails()" plain>保存</el-button>
      <el-button size="mini" type="primary" @click="editTable.show = false" plain>关闭</el-button>
      <el-table  :header-cell-style="{ 'text-align': 'center' }" border>
        <el-table-column prop="purchaseDetailId" label="采购明细编号" width="120" align="center">
          <template >
            <el-tag disable-transitions></el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
        <el-table-column prop="skuId" label="物品名称" align="center"> </el-table-column>
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
    
    <!-- 引用采购单 -->
    <el-dialog title="退换单据信息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="70%">
      <!-- 搜索条件 -->
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <span>请输入采购单号 </span>
            <el-input v-model="input" placeholder="请输入内容"></el-input></div
        ></el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <span>请输入供应商名称 </span>
            <el-input v-model="input" placeholder="请输入内容"></el-input></div
        ></el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <span>请输入物品编码 </span>
            <el-input v-model="input" placeholder="请输入内容"></el-input></div
        ></el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <span>请选择收货仓库 </span>
            <div class="edit_query_1">
          <el-select size="mini" placeholder="请选择类别">
            <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
          </el-select>
        </div>
            </div
        ></el-col>
      </el-row>
      <div class="edit_query_1">
        <el-button type="primary" @click="GetSKUListBySupplierId()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
      <el-divider></el-divider>     
      <!-- 采购单表格 -->
      <el-table  :header-cell-style="{ 'text-align': 'center' }" border="">
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column label="采购单号" align="center"> </el-table-column>
        <el-table-column label="供应商" align="center"> </el-table-column>
        <el-table-column label="采购状态" align="center"> </el-table-column>
        <el-table-column label="收货仓库" align="center"> </el-table-column>
        <el-table-column label="采购员" align="center"> </el-table-column>
        <el-table-column label="其他费用" align="center"> </el-table-column>
        <el-table-column label="货品价格" align="center"> </el-table-column>
        <el-table-column label="总价" align="center"> </el-table-column>
        <el-table-column label="审批时间" align="center"> </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="GoodsAddtoSupplier()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InvoicingManageIndex',
  data() {
    return {
        dialogObject: {
        addVisible: false,
      },
    };
    
  },
  methods: {
    //打开添加弹窗
    openAddDialog() {
      this.dialogObject.addVisible = true;
    },

  },
};
</script>

<style lang="less" scoped>
.putInWarehouse_container {
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
