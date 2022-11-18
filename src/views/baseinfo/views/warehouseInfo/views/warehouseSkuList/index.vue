<template>
  <div class="skuList_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="openAddDialog()">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteSkuFromWarehouse()">移除</el-button>
      </div>
      <div class="edit_query">
        <el-select size="mini" v-model.number="queryForm.goodsTypeId" placeholder="请选择类别">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
        </el-select>
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        <el-button type="primary" @click="selectGoods()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="table.skuList" @selection-change="selectWarehouseSkuRows" highlight-current-row border>
      <el-table-column type="selection" width="45" align="center"> </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="名称">
              <span>{{ props.row.spuName }}</span>
            </el-form-item>
            <el-form-item label="名称">
              <span>{{ props.row.spuName }}</span>
            </el-form-item>
            <el-form-item label="品牌">
              <span>{{ props.row.brand }}</span>
            </el-form-item>
            <el-form-item label="货位">
              <span>{{ props.row.area }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="100" align="center">
        <template slot-scope="scope">
          <el-image style="width: 60px; height: 50px" :src="scope.row.skuLogoUrl" :preview-src-list="[scope.row.skuLogoUrl]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
      <el-table-column prop="goodsTypeName" label="类型" align="center"> </el-table-column>
      <el-table-column label="物品名称" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.skuName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center"> </el-table-column>
      <el-table-column prop="area" label="货位" align="center"> 
        <template slot-scope="scope">
          <el-input type="text" size="mini" v-model="scope.row.area"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="center"> </el-table-column>
      <el-table-column prop="specs" label="规格" align="center"> </el-table-column>
      <el-table-column label="供应商进价" align="center">
        <template slot-scope="scope">
          <el-input type="number" size="mini" v-model.number="scope.row.costPrice"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center">
        <template slot-scope="scope">
          <el-input type="number" size="mini" v-model.number="scope.row.count"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="警告库存" align="center">
        <template slot-scope="scope">
          <el-input type="number" size="mini" v-model.number="scope.row.warnCount"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" width="150" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="编辑" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateWarehouseSku(scope.row)" icon="el-icon-edit">保存数据</el-button>
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
    <el-descriptions size="small" :column="4" border>
      <el-descriptions-item label="仓库编号">
        <el-tag type="warning">{{ calculateWarehouseItems.warehouseId }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="仓库名">
        <el-tag type="warning">{{ calculateWarehouseItems.warehouseName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="物品总数量">
        <el-tag type="warning">
          {{ calculateWarehouseItems.goodsCount }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="仓库总成本">
        <el-tag type="warning">{{ calculateWarehouseItems.totalCost }} </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <!-- 添加供应商货品对话框 -->
    <el-dialog title="添加供应商货品信息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="50%">
      <div class="selectInput">
        <el-select size="mini" filterable v-model.number="skuForm.supplierId" placeholder="请选择供应商">
          <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.supplierName" :value="item.supplierId"></el-option>
        </el-select>
        <el-input size="mini" v-model="skuForm.conditions" placeholder="请输入查询条件"></el-input>
        <el-select size="mini" v-model="skuForm.goodsTypeId">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
        </el-select>
        <el-button type="primary" @click="getSKUListBySupplierId()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetDialogQueryForm()" size="mini">重置</el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="table.warehouseSku" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectSupplierSkuRows" border="">
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" align="center"> </el-table-column>
        <el-table-column prop="skuId" label="物品编码" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="price" label="进价" align="center"> </el-table-column>
        <el-table-column prop="goodsTypeName" label="物品类别" align="center"> </el-table-column>
        <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleDialogSizeChange"
          @current-change="handleDialogCurrentChange"
          :total="table.total"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="skuForm.page"
          :page-size="skuForm.row"
          layout="total, sizes, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="addSkuToWarehouse()">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
        goodsTypeId: '',
        warehouseId: '',
      },
      table: {
        skuList: [],
        warehouseSku: [],
        total: 0,
      },
      dialogObject: {
        addVisible: false,
      },
      skuForm: {
        page: 1,
        row: 10,
        goodsTypeId: '',
        conditions: '',
        supplierId: '',
      },
      supplierIdSkuIds: [],
      warehouseSkuIds: [],
      goodsTypes: [],
      supplierList: [],
      calculateWarehouseItems: {},
    };
  },
  methods: {
    loadData() {
      this.getSKUListByWhId();
    },
    //获取物品数据
    async getSKUListByWhId() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.goodsTypeId = queryForm.goodsTypeId == '' ? 0 : parseInt(queryForm.goodsTypeId);
      await this.$api.goods
        .getSKUListByWhId(queryForm.page, queryForm.row, queryForm.warehouseId, queryForm.conditions, queryForm.goodsTypeId)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          this.table.skuList = data.goods;
          this.table.total = data.count;
        });
    },
    //获取物品类型列表
    async getGoodInfoType() {
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
    //获取货品数据选择绑定供应商
    async getSKUListBySupplierId() {
      let skuForm = JSON.parse(JSON.stringify(this.skuForm));
      skuForm.supplierId = skuForm.supplierId == '' ? 0 : parseInt(skuForm.supplierId);
      skuForm.goodsTypeId = skuForm.goodsTypeId == '' ? 0 : parseInt(skuForm.goodsTypeId);
      await this.$api.goods
        .GetSKUListBySupplierId(skuForm.page, skuForm.row, skuForm.goodsTypeId, skuForm.supplierId, skuForm.conditions)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          console.log(data);
          this.table.warehouseSku = data.goods;
        });
    },
    //构造供应商下拉数据
    async getSupplierList() {
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
    // 计算仓库的总成本、物资总和
    async calculateWarehouseItemsById() {
      await this.$api.warehouse.calculateWarehouseItems(this.$route.query.warehouseId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.calculateWarehouseItems = data;
      });
    },
    selectWarehouseSkuRows(selection) {
      this.warehouseSkuIds = [];
      selection.forEach((element) => {
        this.warehouseSkuIds.push({
          warehouseId: element.warehouseId,
          skuId: element.skuId,
        });
      });
    },
    //查找物品
    selectGoods() {
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.goodsTypeId = '';
      this.loadData();
    },
    resetDialogQueryForm() {
      this.skuForm.spuId = '';
      this.skuForm.skuId = '';
      this.skuForm.goodsName = '';
      this.skuForm.goodsTypeId = 0;
      this.getSKUListBySupplierId();
    },
    //外层页面条数改变
    handleSizeChange(row) {
      this.queryForm.row = row;
      this.loadData();
    },
    //外层页数改变
    handleCurrentChange(page) {
      this.queryForm.page = page;
      this.loadData();
    },
    //对话框条数改变
    handleDialogSizeChange(row) {
      this.skuForm.row = row;
      this.getSKUListBySupplierId();
    },
    //对话框页数改变
    handleDialogCurrentChange(page) {
      this.skuForm.page = page;
      this.getSKUListBySupplierId();
    },
    //获取选中行的数据
    selectSupplierSkuRows(selection) {
      this.supplierIdSkuIds = [];
      selection.forEach((element) => {
        this.supplierIdSkuIds.push({
          supplierId: element.supplierId,
          supplierName: element.supplierName,
          skuId: element.skuId,
          price: element.price,
        });
      });
    },
    //添加物品到仓库
    addSkuToWarehouse() {
      if (this.supplierIdSkuIds.length == 0) {
        this.$message({ message: '请选择物资', type: 'warning' });
      } else {
        this.$api.warehouse.addSkuToWarehouse(this.queryForm.warehouseId, this.supplierIdSkuIds).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message({ message: '添加失败！', type: 'error' });
          } else {
            this.$message({ message: '添加成功！', type: 'success' });
            this.dialogObject.addVisible = false;
            this.loadData();
          }
        });
      }
    },
    //打开添加弹窗
    openAddDialog() {
      this.dialogObject.addVisible = true;
      this.getSKUListBySupplierId();
    },
    //修改信息
    updateWarehouseSku(row) {
      this.$api.warehouse.updateWarehouseSku(row).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.dialogObject.addVisible = false;
          this.loadData();
        }
      });
    },
    //从仓库中移除物资
    deleteSkuFromWarehouse() {
      this.$api.warehouse.deleteSkuFromWarehouse(this.warehouseSkuIds).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: message, type: 'error' });
        } else {
          this.$message({ message: message, type: 'success' });
          this.loadData();
        }
      });
    },
  },
  created() {
    this.queryForm.warehouseId = this.$route.query.warehouseId;
    this.loadData();
    this.getGoodInfoType();
    this.getSupplierList();
    this.calculateWarehouseItemsById();
  },
};
</script>

<style lang="less" scoped>
.skuList_container {
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
      // border: 1px solid red;
      grid-template-columns: 2fr 2fr 0.5fr 0.5fr;
      grid-column-gap: 5px;
    }
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .selectInput {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
