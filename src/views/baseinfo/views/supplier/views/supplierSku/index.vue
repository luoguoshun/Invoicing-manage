<template>
  <div class="supplier_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="openAddDialog()">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="DeleteSupplierSKU()"> 移除 </el-button>
      </div>
      <div class="edit_query">
        <el-select size="mini" v-model="queryForm.goodsTypeId" placeholder="请选择类别">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
        </el-select>
        <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        <el-button type="primary" @click="getSKUListBySupplierId()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="table.supplierList" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border ref="supplierSkuTable">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column label="图片" width="100" align="center">
        <template slot-scope="scope">
          <el-image style="width: 60px; height: 50px" :src="scope.row.skuLogoUrl" :preview-src-list="[scope.row.skuLogoUrl]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="spuId" label="物品编码" align="center"> </el-table-column>
      <el-table-column prop="skuId" label="物品编码" align="center"> </el-table-column>
      <el-table-column prop="spuName" label="物品名称" align="center"> </el-table-column>
      <el-table-column prop="purchasePrice" label="物品采购价" align="center" width="120px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.purchasePrice" size="mini" align="center" />
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
          <el-button size="mini" type="success" icon="el-icon-check" circle @click="editSupplierSkuGoodsPrice(scope.row)"></el-button>
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
    <el-dialog title="添加供应商货品信息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="70%" :fullscreen="true">
      <div class="selectInput">
        <div></div>
        <el-input size="mini" v-model="skuForm.spuId" placeholder="请输入SPU编号"></el-input>
        <el-input size="mini" v-model="skuForm.skuId" placeholder="请输入SKU编号"></el-input>
        <el-input size="mini" v-model="skuForm.goodsName" placeholder="请输入物品名称"></el-input>
        <el-select size="mini" v-model="skuForm.goodsTypeId">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
        </el-select>
        <el-button type="primary" @click="selectSkulist()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetSkuForm()" size="mini">重置</el-button>
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
          :current-page="skuForm.page"
          :page-size="skuForm.row"
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
        goodsName: '',
        goodsTypeId: '',
        SupplierId: '',
        conditions: '',
      },
      skuForm: {
        page: 1,
        row: 5,
        spuId: '',
        skuId: '',
        goodsName: '',
        goodsTypeId: '',
        supplierId: 0,
        conditions: '',
      },
      table: {
        supplierList: [],
        supplierSku: [],
        selectiongood: [],
        totalBySupplier: 0,
        totalByDialog: 0,
      },
      dialogObject: {
        updateVisible: false,
        addVisible: false,
      },
      supplierForm: {
        goodsName: '',
        GoodsType: 0,
        SupplierId: 0,
        price: 0,
      },
      supplierGoods: [],
      skuIds: [],
      goodsTypes: [],
    };
  },
  methods: {
    loadData() {
      this.getSKUListBySupplierId();
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
    //修改供应商货品采购价
    editSupplierSkuGoodsPrice(row) {
      console.log(row);
      this.$api.supplier.EditSupplierPurchasePrice(this.$route.query.supplierId, row.purchasePrice, row.skuId).then((res) => {
        console.log();
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
    //绑定物品到指定供应商
    GoodsAddtoSupplier() {
      if (this.supplierGoods.length == 0) {
        this.$message({ message: '请选择单品', type: 'warning' });
        return false;
      }
      const supplier = {
        SkuIds: this.supplierGoods,
        supplierId: this.$route.query.supplierId,
      };
      console.log(supplier);
      this.$api.supplier.GoodsAddtoSupplier(supplier).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message.error('错了哦，请联系管理员');
        } else {
          this.$message({ message: '绑定成功！', type: 'success' });
          this.dialogObject.addVisible = false;
          this.loadData();
        }
      });
    },
    //获取货品数据选择绑定供应商
    async getSKUList() {
      let skuForm = JSON.parse(JSON.stringify(this.skuForm));
      skuForm.goodsTypeId = skuForm.goodsTypeId == '' ? 0 : parseInt(skuForm.goodsTypeId);
      await this.$api.goods
        .getSKUList(skuForm.page, skuForm.row, skuForm.spuId, skuForm.skuId, skuForm.goodsName, skuForm.goodsTypeId)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          this.table.supplierSku = data.goods;
          this.table.totalByDialog = data.count;
        });
    },
    //获取供应商货品分类
    async getGoodsType() {
      this.goodsTypes = [];
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
    //根据供应商id获取供应商货品数据
    async getSKUListBySupplierId() {
      let goodsTypeId = this.queryForm.goodsTypeId == '' ? 0 : parseInt(this.queryForm.goodsTypeId);
      await this.$api.goods
        .GetSKUListBySupplierId(this.queryForm.page, this.queryForm.row, goodsTypeId, this.$route.query.supplierId, this.queryForm.conditions)
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
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.goodsTypeId = '';
      this.queryForm.conditions = '';
      this.loadData();
    },
    //重置供应商添加货品界面搜索条件
    resetSkuForm() {
      this.skuForm.goodsName = '';
      this.skuForm.goodsTypeId = '';
      this.skuForm.spuId = '';
      this.skuForm.skuId = '';
      this.getSKUList();
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
      this.skuForm.row = row;
      this.getSKUList();
    },
    //页数改变--模态框
    handleCurrentChangeDialog(page) {
      this.skuForm.page = page;
      this.getSKUList();
    },
    selectSkulist(){
      this.skuForm.page =1;
      this.skuForm.row =5;
      this.getSKUList();
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
      this.getSKUList();
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
  .selectInput {
    display: grid;
    grid-template-columns:2fr 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
