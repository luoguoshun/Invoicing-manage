<template>
  <div class="role_container">
    <!-- 表格 -->
    <el-table
      :data="table.roleList"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border="">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column v-model="RoleForm.RoleId" prop="roleId" fixed label="角色编号" width="100" align="center"> </el-table-column>
      <el-table-column v-model="RoleForm.name" prop="name" label="角色名" width="150" align="center" ></el-table-column>
      <el-table-column v-model="RoleForm.descripcion" prop="descripcion" label="角色描述" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RoleForm: {
        roleId: '',
        name: '',
        descripcion: '',
      },
      table:{
        roleList:[],
        total: 0,
      }
    };
  },
  computed: {
     roleList() {
      return this.RoleForm.roleNames.split('、');
    },
  },
  methods: {
    
    selectRows() {
      console.log(selectRows);
    },
    loadData() {
      this.getRoleList();
    },
    //获取角色数据
    async getRoleList() {
      await this.$api.role.getRoleList().then((res) => {
        console.log(res)
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.roleList = data;
        console.log(this.table.roleList)
      });
    },
  },
    created() {
    this.loadData();
  },
};
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
</style>
