<template>
  <div>
    <!-- 表格 -->
    <el-table
      :data="table.supplierList"
      :header-cell-style="{ 'text-align': 'center'}"
      @selection-change="selectRows"
      border="">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="supplierId" fixed label="供应商编号" width="100" align="center"> </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" width="150" align="center" ></el-table-column>
      <el-table-column prop="supplierAddr" label="供应商地址" align="center"></el-table-column>
      <el-table-column prop="leadCadre" label="负责人" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
      <el-table-column prop="supplierType" label="供应商等级" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      
    <!-- 操作 -->
    <el-table-column fixed="right" label="操作" width="100" align="center">
        <template >
          <el-button type="text" size="small">查看</el-button>
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
        SupplierType: 0,
      },
      table:{
        supplierList:[],
        total: 0,
      },

    };
  },
  methods: {
    selectRows() {
      console.log(selectRows);
    },

    loadData() {
      this.getSupplierList();
    },

    //获取供应商数据
    async getSupplierList() {
      console.log("21");
      await this.$api.supplier.getSupplierList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.SupplierType)
      .then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        console.log(data);
        this.table.supplierList = data.suppliers;
        this.table.total=data.count;
      });
    },
    handleSizeChange(){

    },
    handleCurrentChange(){

    },
  },
    //created是一个生命周期的钩子函数。在实例创建完成后被立即调用
    created() {
      this.loadData();
  },
}
</script>

<style lang="less" scoped>
.role_container {
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
}