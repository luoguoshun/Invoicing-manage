<template>
  <div class="goodsType_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="openCreateDialog()">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteGoodsTypeById()">
          移除
        </el-button>
      </div>
      <div class="edit_query">
        <el-input v-model="queryForm.goodsTypeName" placeholder="请输入物品名称" size="mini"></el-input>
        <el-button type="primary" @click="getgoodsTypeList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="table.goodsTypeList" @selection-change="selectRows">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="goodsTypeId" fixed label="物品类型编号" width="120" align="center"> </el-table-column>
      <el-table-column label="物品类型名称" width="150" align="center">
        <template slot-scope="scope">
          <el-input type="text" size="mini" v-model="scope.row.goodsTypeName"></el-input>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateGoodsType(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加物品信息信息对话框 -->
    <el-dialog title="物品信息信息" center :visible.sync="dialogObject.createVisible" :close-on-click-modal="false" width="30%">
      <el-form ref="createform" :model="goodsTypeForm" label-width="100px">
        <el-form-item label="物品类型名称">
          <el-input v-model="goodsTypeForm.goodsTypeName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.createVisible = false">取 消</el-button>
        <el-button type="success" @click="addGoodsType()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        goodsTypeName: '',
      },
      goodsTypeForm: {
        goodsTypeId: '',
        goodsTypeName: '',
      },
      table: {
        goodsTypeList: [],
      },
      dialogObject: {
        createVisible: false,
      },
      goodsTypeIds: [],
    };
  },
  methods: {
    loadData() {
      this.getgoodsTypeList();
    },
    //获取物品信息数据
    async getgoodsTypeList() {
      await this.$api.goodsType.getGoodsTypeList(this.queryForm.goodsTypeName).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.goodsTypeList = data;
      });
    },
    //打开添加弹窗弹窗
    openCreateDialog() {
      this.dialogObject.createVisible = true; //打开添加弹窗
      this.goodsTypeForm.goodsTypeName = '';
    },
    //添加物品信息数据
    addGoodsType() {
      this.$api.goodsType.addGoodsType(this.goodsTypeForm.goodsTypeName).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '添加失败！', type: 'error' });
        } else {
          this.$message({ message: '添加成功！', type: 'success' });
          this.dialogObject.createVisible = false;
          this.loadData();
        }
      });
    },
    //添加物品信息数据
    updateGoodsType(row) {
      this.$api.goodsType.updateGoodsType(row.goodsTypeId, row.goodsTypeName).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
          this.loadData();
        }
      });
    },
    //获取选中行的数据
    selectRows(selection) {
      console.log(selection);
      this.goodsTypeIds = [];
      selection.forEach((element) => {
        this.goodsTypeIds.push(element.goodsTypeId);
      });
    },
    //删除物品信息
    deleteGoodsTypeById() {
      console.log('asd');
      if (this.goodsTypeIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.goodsType.deleteGoodsTypeById(this.goodsTypeIds).then((res) => {
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

    resetQueryForm() {
      this.queryForm.goodsTypeName = '';
      this.loadData();
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.goodsType_container {
  width: 100%;
  height: 100%;
  .editbar {
    width: 40%;
    margin: 5px 0px;
    display: grid;
    grid-template-columns: 1fr 8fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
    }
    .edit_query {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 0.5fr 0.5fr;
      grid-column-gap: 5px;
    }
  }
}
</style>
