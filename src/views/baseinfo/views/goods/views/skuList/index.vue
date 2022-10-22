<template>
  <div class="goods_container">
    <!-- 操作 -->
    <div class="editbar">
      <el-button type="primary" size="mini" @click="openDialog('add')">添加</el-button>
      <el-button type="danger" size="mini" @click="deleteSKUListById()">删除</el-button>
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
          <el-image style="width: 60px; height: 50px" :src="scope.row.skuLogoUrl" :preview-src-list="[scope.row.skuLogoUrl]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="skuId" label="单品编码"></el-table-column>
      <el-table-column prop="skuName" label="物品名称"> </el-table-column>
      <el-table-column prop="typeStr" label="物品类型"></el-table-column>
      <el-table-column prop="unit" label="单位"> </el-table-column>
      <el-table-column prop="specs" label="规格"></el-table-column>
      <el-table-column prop="price" label="单价"></el-table-column>
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
    <!--Sku模态框-->
    <el-dialog
      :title="this.dialogType == 'add' ? '新增SKU' : '修改SKU'"
      center
      :visible.sync="dialogObject.dialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form :model="SkuForm" ref="SkuFormModel" label-width="80px">
        <el-form-item label="头像" v-if="dialogType == 'edit'">
          <img :src="SkuForm.LogoSrc" width="100" height="100" />
          <el-upload ref="upload" action="" :http-request="uploadSKULogoImg" :auto-upload="false" :limit="1">
            <el-button slot="trigger" size="small" type="primary">
              选取文件
            </el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="$refs.upload.submit()">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="货品编码" prop="SpuId">
          <el-input v-model="SkuForm.SpuId" disabled></el-input>
        </el-form-item>
        <el-form-item label="单品编码" prop="SpuId">
          <el-input v-model="SkuForm.SkuId"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="SkuForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="Unit">
          <el-input v-model="SkuForm.Unit"></el-input>
        </el-form-item>
        <el-form-item label="单品售价" prop="Price">
          <el-input type="number" v-model="SkuForm.Price"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="Specs">
          <el-input v-model="SkuForm.Specs"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="dianlogButton.label == '新增' ? addSku() : updateSKUById()">{{ dianlogButton.label }}</el-button>
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
        SpuId: '',
        SkuId: '',
        GoodsName: '',
        GoodsTypeId: 0,
      },
      tableData: {
        goodsList: [],
        total: 0,
      },
      SkuForm: {
        SpuId: '',
        SkuId: '',
        Name: '',
        Brand: '',
        GoodsTypeId: '',
        Unit: '',
        Price: 0,
        Specs: '',
        LogoSrc: '',
        goodsTypes: [{ goodsTypeId: 0, goodsTypeName: '请选择物品类型' }],
      },
      goodsTypes: [{ goodsTypeId: 0, goodsTypeName: '请选择物品类型' }],
      brandTypes: [{ label: '', value: '' }],
      skuIds: [],
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
        this.SkuForm.goodsTypes = data;
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
      if (this.SkuForm.GoodsTypeId == 0) this.SkuForm.GoodsTypeId == '';
    },
    //打开复用模态框
    openDialog(addType, row) {
      if (addType == 'add') {
        this.dianlogButton.label = '新增';
        this.dialogType = 'add';
        this.SkuForm.Name = '';
        this.SkuForm.Brand = '';
        this.SkuForm.GoodsTypeId = '';
      } else {
        this.dialogType = 'edit';
        this.SkuForm.SpuId = row.spuId;
        this.SkuForm.SkuId = row.skuId;
        this.SkuForm.Name = row.skuName;
        this.SkuForm.Unit = row.unit;
        this.SkuForm.Specs = row.specs;
        this.SkuForm.GoodsTypeId = row.type;
        this.SkuForm.Price=row.price;
        this.SkuForm.LogoSrc=row.skuLogoUrl;
        this.dianlogButton.label = '修改';
      }
      this.dialogObject.dialogVisible = true;
    },
    selectRows(selection) {
      console.log('asd');
      this.skuIds = [];
      selection.forEach((element) => {
        this.skuIds.push(element.skuId);
      });
    },
    //添加
    addSku() {
      ///validate()组件化表单验证，在提交前写入判断
      this.$refs['SkuFormModel'].validate((valid) => {
        if (valid) {
          const spu = {
            SpuId: this.SkuForm.SpuId,
            Name: this.SkuForm.Name,
            SkuId: this.SkuForm.SkuId,
            Unit: this.SkuForm.Unit,
            Price: this.SkuForm.Price,
            Specs: this.SkuForm.Specs,
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
    updateSKUById() {
      this.$api.goods.updateSKUById(this.SkuForm).then((res) => {
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
    deleteSKUListById() {
      if (this.skuIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.goods.deleteSKUListById(this.skuIds).then((res) => {
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
    //上传sku图片
    uploadSKULogoImg(param) {
      if (param.file.type != 'image/png' && param.file.type != 'image/gif' && param.file.type != 'image/jpg' && param.file.type != 'image/jpeg') {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为.png .gif .jpg .jpeg的图片',
        });
      } else if (param.file.size / 1024 / 1024 / 2 > 2) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于2M',
        });
      } else {
        //创建FormData对象(键值对集合) 将模型存在FormData中
        const formdata = new FormData();
        formdata.append('file', param.file);
        formdata.append('skuId', this.SkuForm.SkuId);
        this.$api.goods.uploadSKULogoImg(formdata).then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            this.$message({ message: message, type: 'error' });
            return;
          } else {
            this.dialogObject.dialogVisible = false;
            this.$message({ message: '上传成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
  }, 
  created() {
    this.SkuForm.SpuId = this.$route.query.spuId;
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
      margin: 5px 0px;
    }
  }
}
</style>
