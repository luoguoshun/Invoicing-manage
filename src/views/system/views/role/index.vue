<template>
  <div class="role_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" round @click="openCreateDialog()"
          >添加
        </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" round @click="deleteRoleIdById()">
          移除
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.roleList"
      :header-cell-style="{ 'text-align': 'center'}"
      @selection-change="selectRows"
      border="">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="roleId" fixed label="角色编号" width="100" align="center"> </el-table-column>
      <el-table-column prop="name" label="角色名" width="150" align="center" ></el-table-column>
      <el-table-column prop="descripcion" label="角色描述" align="center"></el-table-column>
      
    <!-- 操作 -->
    <el-table-column fixed="right" label="编辑" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateDiolog(scope.row)" icon="el-icon-edit">详细信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 修改角色信息对话框 -->
    <el-dialog title="角色信息" center :visible.sync="dialogObject.updateVisible" :close-on-click-modal="false" width="55%">
      <el-form ref="updateform" :model="RoleForm" label-width="80px">
        <el-form-item label="角色Id">
          <el-input v-model="RoleForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="RoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" :rows="6" v-model="RoleForm.descripcion" hidden="50px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.updateVisible = false">取 消</el-button>
        <el-button type="success" @click="updateRole()">修 改</el-button>
      </div>
    </el-dialog>

   <!-- 添加角色信息对话框 -->
    <el-dialog title="角色信息" center :visible.sync="dialogObject.createVisible" :close-on-click-modal="false" width="30%">
      <el-form ref="createform" :model="RoleForm" label-width="80px">
        <el-form-item label="角色Id">
          <el-input v-model="RoleForm.roleId"></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="RoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" :rows="6" v-model="RoleForm.descripcion" hidden="50px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.createVisible = false">取 消</el-button>
        <el-button type="success" @click="addRole()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RoleForm: {
        roleId: '',
        name: '',
        descripcion: ''
      },
      table:{
        roleList:[],
        total: 0,
      },
      dialogObject:{
        updateVisible:false,
        createVisible:false,
      },
      roleIds: [],
    };
  },
  computed: {
     roleList() {
      return this.RoleForm.roleNames.split('、');
    },
  },
  methods: {
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

    //打开添加弹窗弹窗
    openCreateDialog(){
      this.dialogObject.createVisible = true; //打开添加弹窗
      this.RoleForm.roleId='';
      this.RoleForm.name = '' ;
      this.RoleForm.descripcion = '' ;
    },
    //添加角色数据
    addRole() {
      const role = {
        roleId: this.RoleForm.roleId,
        descripcion: this.RoleForm.descripcion,
        name: this.RoleForm.name,
      };
      this.$api.role.addRole(role).then((res) => {
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

    //打开修改弹窗
    updateDiolog(row) {
      this.RoleForm.roleId =row.roleId ;
      this.RoleForm.name =row.name ;
      this.RoleForm.descripcion =row.descripcion ;
      this.dialogObject.updateVisible = true;
    },
    //修改角色数据
    updateRole() {
      const role = {
        roleId: this.RoleForm.roleId,
        descripcion: this.RoleForm.descripcion,
        name: this.RoleForm.name,
      };
      this.$api.role.updateRole(role).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          this.$message({ message: '修改成功！', type: 'success' });
           this.dialogObject.updateVisible = false;
          this.loadData();
        }
      });
    },

    //获取选中行的数据
    selectRows(selection) {
      console.log(selection)
      this.roleIds = [];
      selection.forEach((element) => {
        this.roleIds.push(element.roleId);
      });
      console.log(this.roleIds);
    },

    //删除角色
    deleteRoleIdById() {
     console.log("asd");
      if (this.roleIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.role.deleteRoleIdById(this.roleIds).then((res) => {
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
