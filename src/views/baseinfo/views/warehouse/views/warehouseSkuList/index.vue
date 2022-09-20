<template>
  <div class="skuList_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="openAddDialog()">添加 </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.goodsTypeId" placeholder="请选择类别">
            <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectGoods()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="table.skuList" @selection-change="selectRows" border="">
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
            <el-form-item label="位置">
              <span>{{ props.row.Area }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="skuId" label="物品编号" align="center"> </el-table-column>
      <el-table-column prop="typeStr" label="类型" align="center"> </el-table-column>
      <el-table-column width="300" label="物品名称" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.skuName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="center"> </el-table-column>
      <el-table-column prop="specs" label="规格" align="center"> </el-table-column>
      <el-table-column label="库存" align="center">
        <template scope="scope">
          <el-input type="number" size="mini" v-model.number="scope.row.count"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="警告库存" align="center">
        <template scope="scope">
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
    <!-- 添加供应商货品对话框 -->
    <el-dialog title="添加供应商货品信息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="50%">
      <div class="selectInput">
        <el-input size="mini" v-model="skuForm.spuId" placeholder="请输入SPU编号"></el-input>
        <el-input size="mini" v-model="skuForm.skuId" placeholder="请输入SKU编号"></el-input>
        <el-input size="mini" v-model="skuForm.goodsName" placeholder="请输入物品名称"></el-input>
        <el-select size="mini" v-model="skuForm.goodsTypeId">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"></el-option>
        </el-select>
        <el-button type="primary" @click="selectsupplier()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="table.supplierSku" :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="">
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column prop="spuId" label="物品编码" align="center"> </el-table-column>
        <el-table-column prop="spuName" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="typeStr" label="物品名称" align="center"> </el-table-column>
        <el-table-column prop="unit" label="物品规格" align="center"> </el-table-column>
      </el-table>
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
        goodsName: '',
        goodsTypeId: 0,
        warehouseId: '',
      },
      table: {
        skuList: [],
        supplierSku: [],
        total: 0,
      },
      dialogObject: {
        addVisible: false,
      },
      skuForm: {
        page: 1,
        row: 10,
        spuId: '',
        skuId: '',
        goodsName: '',
        goodsTypeId: 0,
      },
      skuIds: [],
      goodsTypes: [{ goodsTypeId: 0, goodsTypeName: '请选择类型' }],
    };
  },
  methods: {
    loadData() {
      this.getSKUListByWhId();
    },
    //获取物品数据
    async getSKUListByWhId() {
      await this.$api.goods
        .getSKUListByWhId(this.queryForm.page, this.queryForm.row, this.queryForm.warehouseId, this.queryForm.goodsName, this.queryForm.goodsTypeId)
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
        console.log(data);
        // this.goodsType = data;
      });
    },
    //获取货品数据选择绑定供应商
    async getAllSKUList() {
      await this.$api.goods
        .GetSKUList(this.skuForm.page, this.skuForm.row, this.skuForm.spuId, this.skuForm.skuId, this.skuForm.goodsName, this.skuForm.goodsType)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          console.log(data.goods);
          this.table.supplierSku = data.goods;
        });
    },
    //查找物品
    selectGoods() {
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.goodsType = 0;
      this.loadData();
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
    //获取选中行的数据
    selectRows(selection) {
      this.skuIds = [];
      selection.forEach((element) => {
        this.skuIds.push(element.skuId);
      });
    },
    //添加物品到仓库
    addSkuToWarehouse() {
      this.$api.warehouse.addSkuToWarehouse(this.queryForm.warehouseId, this.skuIds).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '添加失败！', type: 'error' });
        } else {
          this.$message({ message: '添加成功！', type: 'success' });
          this.dialogObject.addVisible = false;
          this.loadData();
        }
      });
    },
    //打开添加弹窗
    openAddDialog() {
      this.dialogObject.addVisible = true;
      this.getAllSKUList();
    },
    //修改信息
    updateWarehouseSku(row) {
      this.$api.warehouse.updateWarehouseSku(this.queryForm.warehouseId, row.skuId, row.count, row.warnCount).then((res) => {
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
  },
  created() {
    this.queryForm.warehouseId = this.$route.query.warehouseId;
    this.loadData();
    this.getGoodInfoType();
  },
};
</script>

<style lang="less" scoped>
.skuList_container {
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
    grid-template-columns: 1fr 1fr 1fr 1fr 0.3fr 0.3fr;
    grid-column-gap: 3px;
  }
}
</style>
