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
        <el-button type="primary" @click="getSPUList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据 -->
    <el-table style="width: 100%" :data="tableData.goodsList" @selection-change="selectRows" @row-dblclick="openDialog('edit')">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="spuId" label="货品编码"></el-table-column>
      <el-table-column prop="spuName" label="物品名称"> </el-table-column>
      <el-table-column prop="typeStr" label="物品类型"></el-table-column>
      <el-table-column prop="brand" label="品牌"> </el-table-column>
      <el-table-column label="查看单品详情" align="center">
        <template slot-scope="scope">
          <el-link type="primary" @click="lookSKUList(scope.row.spuId)">查看</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
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

    <!--SPu模态框-->
    <el-dialog :title="dialog=='add'?'新增SPU':'修改SPU'" center :visible.sync="dialogObject.dialogVisible" :close-on-click-modal="false" width="40%">
      <el-form :model="SpuForm" :rules="rules" ref="SpuForm" label-width="80px">
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
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="addSpu()">新 增</el-button>
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
        GoodsTypeId: 0,
        goodsTypes: [{ goodsTypeId: 0, goodsTypeName: '请选择物品类型' }],
      },
      goodsTypes: [{ goodsTypeId: 0, goodsTypeName: '请选择物品类型' }],
      brandTypes: [{ label: '', value: '' }],
      SpuIds: [],
      dialogType:'add',
      dialogObject: {
        dialogVisible: false,
      },
    };
  },
  extends: {},
  methods: {
    loadData() {
      this.getSPUList();
      this.getGoodsType();
      this.checkType();
      this.getbrandType();
    },
    async getSPUList() {
      await this.$api.goods
        .getSPUList(
          this.queryForm.page,
          this.queryForm.row,
          this.queryForm.SpuId,
          this.queryForm.PublicationDates,
          this.queryForm.GoodsName,
          this.queryForm.GoodsTypeId,
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
    },
    openDialog(addType) {
    
      this.dialogObject.dialogVisible = true;
      if(addType='add')
      {
        this.queryForm
      }
      this.SpuForm.GoodsTypeId = '';
    },

    //获取选中行的数据
    selectRows(selection) {
      console.log('asd');
      this.SpuIds = [];
      selection.forEach((element) => {
        this.SpuIds.push(element.spuId);
      });
    },
    addSpu() {
      ///validate()组件化表单验证，在提交前写入判断
      this.$refs['SpuForm'].validate((valid) => {
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
            this.dialogObject.addVisible = false;
            this.loadData();
          });
        } else {
          console.log('errore submit!!');
          return false;
        }
      });
    },
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

    //查看单品列表
    lookSKUList(spuId) {
      this.$router.push({
        name: 'skuList',
        query: {
          spuId: spuId,
        },
      });
    },
  }, //methods----end
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
</style>
