<template>
  <div class="goods_container">
    <!-- 操作 -->
    <div class="editbar">
      <el-button type="primary" size="mini">添加</el-button>
      <el-button type="danger" size="mini">删除</el-button>
    </div>
    <div class="edit_query">
      <div class="edit_queryinfo">
        <el-input
          v-model="queryForm.GoodsId"
          placeholder="请输入物品编号"
          size="mini"
          style="width: 200px; margin-right: 20px"
        ></el-input>

        <el-input
          v-model="queryForm.GoodsName"
          placeholder="请输入物品名称"
          size="mini"
          style="width: 200px; margin-right: 20px"
        ></el-input>
        <!-- <el-select v-model="queryForm.WarehouseId" placeholder="请选择仓库" size="mini">
          <el-option
            v-for="item in Warehouses"
            :key="item.warehouseId"
            :label="item.warehouseName"
            :value="item.warehouseId"
          >
          </el-option>
        </el-select> -->

        <el-select size="mini" v-model="queryForm.GoodsType" style="margin-left: 20px" placeholder="请选择物品类型">
          <el-option
            v-for="item in goodsTypes"
            :key="item.goodsType"
            :label="item.goodsTypeName"
            :value="item.goodsType"
          >
          </el-option>
        </el-select>

        <el-button type="primary" @click="getGoodsList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据 -->
    <el-table style="width: 100%" :data="tableData.goodsList">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="goodsId" label="物品编号" width="180"> </el-table-column>
      <el-table-column prop="goodsName" label="物品名称" width="180"> </el-table-column>
      <el-table-column prop="goodsTypeStr" label="物品类型"></el-table-column>
      <el-table-column prop="unit" label="单位"> </el-table-column>
      <el-table-column prop="specs" label="规格"> </el-table-column>
      <el-table-column prop="price" label="单价"> </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- @size-change="handleSizeChange"
        @current-change="handleCurrentChange" -->
    <div class="block">
      <el-pagination
        :total="tableData.total"
        :page-sizes="[5, 10, 15, 20]"
        :current-page="queryForm.page"
        :page-size="queryForm.row"
        layout="total, sizes, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        page: 1,
        row: 10,
        PublicationDates: [],
        GoodsName: '',
        GoodsType: 0,
        GoodsTypeStr: '',
        WarehouseId: 0,
        GoodsId:'',
      },
      tableData: {
        goodsList: [],
        total: 0,
      },
      goodsTypes: [{ goodsType: 0, goodsTypeName: '请选择物品类型' }],
    };
  },
  extends: {},
  methods: {
    loadData() {
      this.getGoodsList();
      this.getGoodsType();
    },
    async getGoodsList() {
      await this.$api.goods
        .getGoodsList(
          this.queryForm.page,
          this.queryForm.row,
          parseInt(this.queryForm.GoodsId),
          this.queryForm.PublicationDates,
          this.queryForm.GoodsName,
          this.queryForm.GoodsType,
          this.queryForm.WarehouseId,
        )
        //then主要用于一个函数要用到另一个函数返回的值，
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          data.goods.forEach((element) => {
            element.createTime = this.$timeFormat.timeUTCToTime(element.createTime, 'second');
          });
          this.tableData.goodsList = data.goods;
          this.tableData.total = data.count;
        });
    },

    async getGoodsType() {
      await this.$api.goods.getGoodInfoType().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        console.log(data);

        this.goodsTypes = data;
        console.log(this.goodsTypes);
      });
    },
  },
  //created是一个生命周期的钩子函数。在实例创建完成后被立即调用
  created() {
    this.loadData();
  },
};
</script>

<style lang="less">
.goods_container {
  width: auto;
  height: auto;
  .editbar {
    float: left;
  }
  .edit_query {
    .edit_queryinfo {
      float: right;
    }
  }
}
</style>>
