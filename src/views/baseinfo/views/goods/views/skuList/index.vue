<template>
  <div class="goods_container">
    <!-- 操作 -->
    <div class="editbar">
      <el-button type="primary" round size="mini" @click="openDialog('add')">添加</el-button>
      <el-button type="danger" size="mini" @click="deleteSpu()">删除</el-button>
    </div>
    <div class="edit_query">
      <div class="edit_queryinfo">
        <el-input v-model="queryForm.SpuId" placeholder="请输入物品编号" size="mini" style="width: 200px; margin-right: 20px"></el-input>
        <el-input v-model="queryForm.GoodsName" placeholder="请输入物品名称" size="mini" style="width: 200px; margin-right: 20px"></el-input>
        <el-select size="mini" v-model="queryForm.GoodsTypeId" placeholder="请选择" @change="checkType()">
          <el-option v-for="item in goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"> </el-option>
        </el-select>
        <el-button type="primary" @click="getSKUList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据 -->
    <el-table style="width: 100%" :data="tableData.goodsList" @selection-change="selectRows" @row-dblclick="openDialog('edit', scope.row)">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="图片" width="100" align="center">
        <template slot-scope="scope">
          <el-image style="width: 60px; height: 50px" :src="scope.row.SKULogoUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="spuId" label="货品编码"></el-table-column>
      <el-table-column prop="skuName" label="物品名称"> </el-table-column>
      <el-table-column prop="typeStr" label="物品类型"></el-table-column>
      <el-table-column prop="Specs" label="规格"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="updateTime" label="修改时间"> </el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDialog('edit', scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="tableData.total"
        :page-sizes="[5, 10, 15, 20]"
        :current-page="queryForm.page"
        :page-size="queryForm.row"
        layout="total, sizes, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </div>

    <!--SPu模态框-->
    <el-dialog
      :title="this.dialogType == 'add' ? '新增SPU' : '修改SPU'"
      center
      :visible.sync="dialogObject.dialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form :model="SpuForm" ref="SpuFormModel" label-width="80px">
        <el-form-item label="货品编码" prop="SpuId">
          <el-input v-model="SpuForm.SpuId"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="SpuForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="Brand">
          <el-select size="mini" v-model="SpuForm.Brand" placeholder="请选择" @change="checkType()">
            <el-option v-for="item in brandTypes" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品类型">
          <el-select size="mini" v-model="SpuForm.GoodsTypeId" placeholder="请选择" @change="checkType()">
            <el-option v-for="item in SpuForm.goodsTypes" :key="item.goodsTypeId" :label="item.goodsTypeName" :value="item.goodsTypeId"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="dianlogButton.label == '新增' ? addSpu() : updateSpu()">{{ dianlogButton.label }}</el-button>
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
        PublicationDates: [],
        SkuId: '',
        GoodsName: '',
        GoodsTypeId: 0,
        WarehouseId: '',
        SpuId: '',
      },
      tableData: {
        goodsList: [],
        total: 0,
      },
      SpuForm: {
        SpuId: '',
        Name: '',
        Brand: '',
        GoodsTypeId: '',
        goodsTypes: [{ goodsTypeId: 0, goodsTypeName: '请选择物品类型' }],
      },
      goodsTypes: [{ goodsTypeId: 0, goodsTypeName: '请选择物品类型' }],
      brandTypes: [{ label: '', value: '' }],
      SpuIds: [],
      dialogType: 'add',
      dialogObject: {
        dialogVisible: false,
      },
      dianlogButton: { label: '新增' },
    };
  },
  extends: {},
  methods: {
    loadData() {
      this.getSKUList();
      this.getGoodsType();
      this.checkType();
      this.getbrandType();
    },
    async getSKUList() {
      console.log(this.queryForm.SpuId);
      await this.$api.goods
        .getSKUList(
          this.queryForm.page,
          this.queryForm.row,
          this.queryForm.SpuId,
          this.queryForm.SkuId,
          this.queryForm.GoodsName,
          this.queryForm.GoodsTypeId,
        )
        //then主要用于一个函数要用到另一个函数返回的值，
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          }
          console.log(data);
          data.goods.forEach((element) => {
            element.createTime = this.$timeFormat.timeUTCToTime(element.createTime, 'second');
            element.updateTime = this.$timeFormat.timeUTCToTime(element.updateTime, 'second');
          });
          console.log(data.goods);
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
        this.goodsTypes = data;
        this.SpuForm.goodsTypes = data;
      });
    },
    async getbrandType() {
      await this.$api.goods.getBrandType().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.brandTypes = data;
      });
    },
    checkType() {
      if (this.queryForm.GoodsTypeId == '') this.queryForm.GoodsTypeId == 0;
      if (this.SpuForm.GoodsTypeId == 0) this.SpuForm.GoodsTypeId == '';
    },
    //打开复用模态框
    openDialog(addType, row) {
      if (addType == 'add') {
        this.dianlogButton.label = '新增';
        this.dialogType = 'add';
        this.SpuForm.SpuId = '';
        this.SpuForm.Name = '';
        this.SpuForm.Brand = '';
        this.SpuForm.GoodsTypeId = '';
        this.dialogObject.dialogVisible = true;
      } else {
        this.dialogType = 'edit';
        this.dialogObject.dialogVisible = true;
        this.SpuForm.SpuId = row.spuId;
        this.SpuForm.Name = row.spuName;
        this.SpuForm.Brand = row.brand;
        this.SpuForm.GoodsTypeId = row.type;
        this.dianlogButton.label = '修改';
      }
    },

    selectRows(selection) {
      console.log('asd');
      this.SpuIds = [];
      selection.forEach((element) => {
        this.SpuIds.push(element.spuId);
      });
    },
    //添加Spu
    addSpu() {
      ///validate()组件化表单验证，在提交前写入判断
      this.$refs['SpuFormModel'].validate((valid) => {
        console.log(valid);
        if (valid) {
          const spu = {
            SpuId: this.SpuForm.SpuId,
            Name: this.SpuForm.Name,
            Brand: this.SpuForm.Brand,
            Type: this.SpuForm.GoodsTypeId,
          };
          this.$api.goods.addSpu(spu).then((res) => {
            const { data, success, message } = res.data;
            if (!success) {
              console.log(message);
              return;
            }
            this.$message({ message: '新增成功', type: 'success' });
            this.dialogObject.dialogVisible = false;
            this.loadData();
          });
        } else {
          console.log('errore submit!!');
          return false;
        }
      });
    },
    updateSpu() {
      console.log(this.SpuForm.GoodsTypeId);
      const spu = {
        SpuId: this.SpuForm.SpuId,
        Name: this.SpuForm.Name,
        Brand: this.SpuForm.Brand,
        Type: this.SpuForm.GoodsTypeId,
      };
      this.$api.goods.updateSpu(spu).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.dialogObject.dialogVisible = false;
          this.loadData();
        }
      });
    },
    //删除Spu
    deleteSpu() {
      if (this.SpuIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.goods.deleteSpuById(this.SpuIds).then((res) => {
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
    //重置条件
    resetQueryForm() {
      this.queryForm.GoodsName = '';
      this.queryForm.GoodsTypeId = 0;
      this.queryForm.WarehouseId = '';
      this.queryForm.SpuId = '';
    },

    handleSizeChange(row) {
      this.queryForm.row = row;
      this.loadData();
    },
    //页数改变
    handleCurrentChange(page) {
      this.queryForm.page = page;
      this.loadData();
    },
  }, //methods----end
  //created是一个生命周期的钩子函数。在实例创建完成后被立即调用
  created() {
    this.queryForm.SpuId = this.$route.query.spuId;
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
</style>
