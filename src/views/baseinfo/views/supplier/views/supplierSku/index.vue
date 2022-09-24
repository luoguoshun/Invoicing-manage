<template>
  <div class="supplier_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" round @click="openAddDialog()">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="DeleteSupplierSKU()" round> 移除 </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.GoodsType" placeholder="请选择类别">
            <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="GetSKUListBySupplierId()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.supplierList"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
      ref="supplierSkuTable"
    >
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="spuId" label="物品编码" align="center"> </el-table-column>
      <el-table-column prop="skuId" label="物品编码" align="center"> </el-table-column>
      <el-table-column prop="spuName" label="物品名称" align="center"> </el-table-column>
      <el-table-column prop="purchasePrice" label="物品采购价" align="center" width="120px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.purchasePrice" placeholder="" align="center" />
        </template>
      </el-table-column>
      <el-table-column prop="goodsTypeName" label="物品分类" align="center"> </el-table-column>
      <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
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
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-check" circle @click="editSupplierSkuGoodsPrice(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChangeByOut"
        @current-change="handleCurrentChangeByOut"
        :total="table.totalBySupplier"
        :page-sizes="[5, 10, 15, 20]"
        :current-page="queryForm.page"
        :page-size="queryForm.row"
        layout="total, sizes, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </div>
    <!-- 添加供应商货品对话框 -->
    <el-dialog title="添加供应商货品信息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="70%">
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <span>请输入物品编号 </span>
            <el-input v-model="SkuForm.skuId" placeholder="请输入内容"></el-input></div
        ></el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <span>请输入货品编号 </span>
            <el-input v-model="SkuForm.spuId" placeholder="请输入内容"></el-input></div
        ></el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <span>请输入物品名称 </span>
            <el-input v-model="SkuForm.goodsName" placeholder="请输入内容"></el-input></div
        ></el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <span>请选择类别 </span>
            <div class="edit_query_1">
              <el-select size="mini" v-model="SkuForm.goodsType" placeholder="请选择类别">
                <el-option v-for="item in SkuForm.goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
              </el-select>
            </div></div
        ></el-col>
      </el-row>
      <div class="edit_query_1">
        <el-button type="primary" @click="GetSKUList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetStuForm()" size="mini">重置</el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="table.supplierSku" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRowsGoods" border="">
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column prop="skuId" label="物品编码" align="center"> </el-table-column>
        <el-table-column prop="spuId" label="货品编码" align="center"> </el-table-column>
        <el-table-column prop="skuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="typeStr" label="物品分类" align="center"> </el-table-column>
        <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChangeDialog"
          @current-change="handleCurrentChangeDialog"
          :total="table.totalByDialog"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="SkuForm.page"
          :page-size="SkuForm.row"
          layout="total, sizes, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="GoodsAddtoSupplier()">添 加</el-button>
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
        row: 5,
        GoodsName: '',
        goodsTypes: [{ typeId: 0, typeName: '请选择类型' }],
        WarehouseId: '',
        SupplierId: '',
        conditions: '',
      },
      SkuForm: {
        page: 1,
        row: 5,
        spuId: '',
        skuId: '',
        goodsName: '',
        goodsType: 0,
        warehouseId: '',
        goodsTypes: [{ typeId: 0, typeName: '请选择类型' }],
        supplierId: 0,
        conditions: '',
      },
      table: {
        supplierList: [],
        supplierSku: [],
        totalBySupplier: 0,
        totalByDialog: 0,
        selectiongood: [],
      },
      dialogObject: {
        updateVisible: false,
        addVisible: false,
      },
      supplierForm: {
        GoodsName: '',
        GoodsType: 0,
        WarehouseId: '',
        SupplierId: 0,
        goodsTypes: [{ typeId: 0, typeName: '请选择类型' }],
        price: 0,
      },
      supplierGoods: [],
      skuIds: [],
      goodsTypes: [{ goodsTypeId: 0, goodsTypeName: '请选择类型' }],
    };
  },
  methods: {
    loadData() {
      this.GetSKUListBySupplierId();
      this.GetSKUList();
      this.getGoodsType();
    },
    //获取选中行的数据--模态框
    selectRowsGoods(selection) {
      this.supplierGoods = [];
      selection.forEach((element) => {
        this.supplierGoods.push(element.skuId);
      });
      console.log(this.supplierGoods);

    },

    //获取选中行的数据--外面
    selectRows(selection) {
      //if (editType == 'edit')
      //this.editSupplierSkuGoodsPrice(selection.purchasePrice);
      this.skuIds = [];
      selection.forEach((element) => {
        this.skuIds.push(element.skuId);
      });
      console.log(this.skuIds);
    },
    editSupplierSkuGoodsPrice(row) {
      console.log(row)
      this.$api.supplier.EditSupplierPurchasePrice(this.$route.query.supplierId, row.purchasePrice, row.skuId).then((res) => {
        console.log();
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.$message({ message: '删除成功！', type: 'success' });
        this.dialogObject.addVisible = false;
        this.loadData();
      });
    },
    //修改供应商货品采购价
    GoodsAddtoSupplier() {
      console.log(this.supplierGoods);
      const supplier = {
        SkuIds: this.supplierGoods,
        supplierId: this.$route.query.supplierId,
      };
      console.log(supplier);
      this.$api.supplier.GoodsAddtoSupplier(supplier).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.$message({ message: '修改成功！', type: 'success' });
        this.dialogObject.addVisible = false;
        this.loadData();
      });
    },
    //获取货品数据选择绑定供应商
    async GetSKUList() {
      console.log(this.SkuForm.goodsType);
      await this.$api.goods
        .getSKUList(this.SkuForm.page, this.SkuForm.row,this.SkuForm.skuId, this.SkuForm.spuId, this.SkuForm.goodsName, this.SkuForm.goodsType)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          console.log(data);
          this.table.supplierSku = data.goods;
          this.table.totalByDialog = data.count;
        });
    },

    //获取供应商货品分类
    async getGoodsType() {
      await this.$api.goods.getGoodInfoType().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        data.forEach((element) => {
          this.goodsTypes.push({ goodsTypeId: element.goodsTypeId, goodsTypeName: element.goodsTypeName });
          this.SkuForm.goodsTypes.push({ goodsTypeId: element.goodsTypeId, goodsTypeName: element.goodsTypeName });
        });
        // console.log(data);
        // this.goodsTypes = data;
        this.SkuForm.goodsTypes=data;
        this.supplierForm.goodsTypes = data;
      });
    },

    //根据供应商id获取供应商货品数据
    async GetSKUListBySupplierId() {
      await this.$api.goods
        .GetSKUListBySupplierId(
          this.queryForm.page,
          this.queryForm.row,
          this.queryForm.GoodsName,
          this.queryForm.GoodsType,
          this.queryForm.WarehouseId,
          this.$route.query.supplierId,
          this.queryForm.conditions,
        )
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          //console.log(data);
          this.table.supplierList = data.goods;
          this.table.totalBySupplier = data.count;
        });
    },

    //查找供应商货品
    selectsupplier() {
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.GoodsName = '';
      this.queryForm.GoodsType = 0;
      (this.queryForm.conditions = '')
      this.loadData();
    },

    //重置供应商添加货品界面搜索条件
    resetStuForm() {
      this.SkuForm.goodsName = '';
      this.SkuForm.GoodsType = 0;
      this.SkuForm.spuId='',
      this.SkuForm.skuId = '';
    },

    //条数改变--外面
    handleSizeChangeByOut(row) {
      this.queryForm.row = row;
      this.loadData();
    },
    //页数改变--外面
    handleCurrentChangeByOut(page) {
      this.queryForm.page = page;
      this.loadData();
    },

    //条数改变--模态框
    handleSizeChangeDialog(row) {
      this.SkuForm.row = row;
      this.loadData();
    },
    //页数改变--模态框
    handleCurrentChangeDialog(page) {
      console.log(page)
      this.SkuForm.page = page;
      this.loadData();
    },
    //删除供应商货品
    DeleteSupplierSKU() {
      console.log(this.skuIds);
      if (this.skuIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.supplier.DeleteSupplierSKU(this.skuIds, this.$route.query.supplierId).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('删除失败！');
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },

    //打开添加弹窗
    openAddDialog() {
      this.dialogObject.addVisible = true;
      this.supplierForm.supplierType = '';
      this.supplierForm.supplierId = '';
      this.supplierForm.supplierAddr = '';
      this.supplierForm.supplierName = '';
      this.supplierForm.leadCadre = '';
      this.supplierForm.phone = '';
      this.GetSKUList();
    },
    addSupplierSku() {
      this.$refs['supplierForm'].validate((valid) => {
        if (valid) {
          const supplier = {
            supplierName: this.supplierForm.supplierName,
            supplierAddr: this.supplierForm.supplierAddr,
            phone: this.supplierForm.phone,
            leadCadre: this.supplierForm.leadCadre,
            supplierType: 0,
          };
          this.$api.supplier.addSupplierSku(supplier).then((res) => {
            console.log();
            const { data, success, message } = res.data;
            if (!success) {
              console.log(message);
              return;
            }
            this.$message({ message: '添加成功！', type: 'success' });
            this.dialogObject.addVisible = false;
            this.loadData();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.supplier_container {
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
