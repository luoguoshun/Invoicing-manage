<template>
  <div class="setting_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-folder-add" @click="openEditDialog('add')">添加 </el-button>
        <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteRoutersById()">
          移除
        </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectrouter()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="table.routerList"
      @row-dblclick="openEditDialog"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="selectRows"
      border=""
    >
      <el-table-column type="selection" width="45" align="center"> </el-table-column>
      <el-table-column fixed label="标题" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>图标样式: {{ scope.row.mate.icon }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.mate.title }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed prop="routerId" label="路由Id" align="center"> </el-table-column>
      <el-table-column fixed prop="parentId" label="父级Id" align="center"> </el-table-column>
      <el-table-column fixed prop="path" label="路径(path)" align="left"> </el-table-column>
      <el-table-column label="路由名(name)" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="组件路径(component)" width="400px" align="left"> </el-table-column>
      <el-table-column prop="description" label="说明" align="center"> </el-table-column>
      <!-- <el-table-column prop="state" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            class="switch"
            :inactive-value="0"
            :active-value="1"
            active-color="rgb(0, 255, 149)"
            inactive-color="rgb(151, 148, 148)"
            v-model="scope.row.state"
            @change="updateRouterState(scope.row)"
          />
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openEditDialog('add')">添加子路由</el-button>
          <el-button type="text" size="small" @click="openEditDialog('update', scope.row)">查看</el-button>
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
    <!-- 添加路由信息对话框 -->
    <el-dialog title="路由信息" center :visible.sync="dialogObject.EditVisible" :close-on-click-modal="false" width="40%">
      <el-form :model="routerForm" :rules="rules" ref="routerForm" label-width="120px">
        <el-form-item label="父级路由" prop="parentId">
          <el-cascader
            v-model="routerForm.parentIdArray"
            :options="routerOptions"
            :props="{ checkStrictly: true }"
            @change="routerHandleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="routerForm.title"></el-input>
        </el-form-item>
        <el-form-item label="路由Id" prop="routerId">
          <el-input v-model="routerForm.routerId"></el-input>
        </el-form-item>
        <el-form-item label="路由名" prop="name">
          <el-input v-model="routerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="访问路径(path)" prop="path">
          <el-input v-model="routerForm.path"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input type="text" v-model="routerForm.component"></el-input>
        </el-form-item>
        <el-form-item label="权限设置">
          <el-select v-model="routerForm.isAuth" placeholder="请选择">
            <el-option label="是" value="1"> </el-option>
            <el-option label="否" value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标样式">
          <el-input type="text" v-model="routerForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="6" v-model="routerForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.EditVisible = false">取 消</el-button>
        <el-button type="success" @click="submitEvent()">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { findParents } from '@/utils/util.js';
export default {
  data() {
    //检查路由编号是否存在
    const cheackrouterId = (rule, value, callback) => {
      return callback();
      // const regrouterId = /^[A-Za-z0-9]+$/;
      // if (!regrouterId.test(value)) {
      //   return callback(new Error('路由id由英文和数字组成!'));
      // } else {
      //   this.$api.vueRouter.checkrouterExists(value).then((res) => {
      //     const { data, success, message } = res.data;
      //     if (success) {
      //       return callback();
      //     }
      //     callback(new Error('路由Id重复!'));
      //   });
      // }
    };
    //检查路由名称是否存在
    const cheackrouterName = (rule, value, callback) => {
      const regrouterId = /^[A-Za-z0-9]+$/;
      if (!regrouterId.test(value)) {
        return callback(new Error('路由id由英文和数字组成!'));
      } else {
        this.$api.vueRouter.checkrouterIdExists(value).then((res) => {
          const { data, success, message } = res.data;
          if (success) {
            return callback();
          }
          callback(new Error('路由Id重复!'));
        });
      }
    };
    //检查路由名称是否存在
    const cheackParentId = (rule, value, callback) => {
      if (this.routerForm.parentIdArray.length == 0) {
        callback(new Error('请选择父级路由!'));
      }
      callback();
    };
    return {
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
        roleId: 0,
      },
      table: {
        routerList: [],
        total: 0,
      },
      dialogObject: {
        EditVisible: false,
      },
      routerForm: {
        title: '',
        routerId: '',
        parentId: '',
        name: '',
        path: '',
        component: '',
        isAuth: '1',
        icon: '',
        description: '',
        parentIdArray: [],
      },
      routerIds: [],
      roleTypes: [{ roleId: 0, name: '请选择类型' }],
      rules: {
        parentId: [
          // { required: true, message: '请选择父级路由', trigger: 'blur' },
          { validator: cheackParentId, trigger: 'blur' },
        ],
        routerId: [
          { required: true, message: '路由Id不能为空', trigger: 'change' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          { validator: cheackrouterId, trigger: 'blur' },
        ],
        path: [{ required: true, message: '请选择访问路径', trigger: 'blur' }],
        name: [
          { required: true, message: '路由名称不能为空', trigger: 'change' },
          { validator: cheackrouterId, trigger: 'blur' },
        ],
        title: [{ required: true, message: '请设置标题', trigger: 'blur' }],
        component: [{ required: true, message: '请设置组件路径', trigger: 'blur' }],
      },
      routerOptions: [],
      editName: '',
    };
  },
  computed: {
    parentId: function() {
      const index = this.routerForm.parentIdArray.length;
      return this.routerForm.parentIdArray[index - 1];
    },
  },
  methods: {
    ...mapMutations({ setRouters: 'routers/setRouters' }),
    //获取动态路由表
    setDynamicRouter() {
      this.$api.vueRouter.getDynamicRouter().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return false;
        }
        console.log(data);
        this.setRouters(data);
      });
    },
    routerHandleChange(value) {
      console.log(value);
    },
    //获取路由数据
    async getAllRouterInfo() {
      await this.$api.vueRouter.getAllRouterInfo(this.queryForm.page, this.queryForm.row, this.queryForm.conditions).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.routerList = data.routers;
        this.table.total = data.count;
      });
    },
    //构造路由级联数据
    async constructRouteCascadeData() {
      await this.$api.vueRouter.constructRouteCascadeData().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.routerOptions = data;
      });
    },
    loadData() {
      this.getAllRouterInfo();
    },
    //查找路由
    selectrouter() {
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.roleId = 0;
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
      this.routerIds = [];
      selection.forEach((element) => {
        this.routerIds.push(element.routerId);
      });
    },
    //删除路由
    deleteRoutersById() {
      if (this.routerIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.vueRouter.deleteRoutersById(this.routerIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('删除失败！');
          } else {
            this.$message({ message: '删除成功！', type: 'success' });
            this.setDynamicRouter();
            this.loadData();
          }
        });
      }
    },
    //打开弹窗(添加 修改)
    openEditDialog(editName, row) {
      if (editName == 'add') {
        this.editName = 'add';
        this.routerForm.parentIdArray = [];
        this.routerForm.routerId = '';
        this.routerForm.name = '';
        this.routerForm.path = '';
        this.routerForm.component = '';
        this.routerForm.title = '';
        this.routerForm.description = '';
        this.routerForm.icon = '';
      } else {
        this.editName = 'update';
        //当前结点的所有父节点Id
        let parentIds = findParents(this.routerOptions, row.routerId);
        parentIds.splice(0, 1);
        this.routerForm.parentIdArray = parentIds;
        this.routerForm.routerId = row.routerId;
        this.routerForm.name = row.name;
        this.routerForm.path = row.path;
        this.routerForm.component = row.component;
        this.routerForm.description = row.description;
        this.routerForm.title = row.mate.title;
        this.routerForm.icon = row.mate.icon;
      }
      this.dialogObject.EditVisible = true;
    },
    //提交表单
    submitEvent() {
      if (this.editName == 'add') {
        this.addRouter();
      } else {
        this.updateRouter();
      }
    },
    //添加路由
    addRouter() {
      this.$refs['routerForm'].validate((valid) => {
        if (valid) {
          const router = {
            routerId: this.routerForm.routerId,
            parentId: this.parentId,
            name: this.routerForm.name,
            path: this.routerForm.path,
            component: this.routerForm.component,
            title: this.routerForm.title,
            description: this.routerForm.description,
            icon: this.routerForm.icon,
            isAuth: this.routerForm.isAuth == '1' ? true : false,
          };
          this.$api.vueRouter.addRouter(router).then((res) => {
            const { data, success, message } = res.data;
            if (!success) {
              this.$message({ message: '添加失败！', type: 'error' });
            } else {
              this.$message({ message: '添加成功！', type: 'success' });
              this.dialogObject.EditVisible = false;
              this.setDynamicRouter();
              this.loadData(); //加载数据
            }
          });
        } else {
          console.log('error submit!!');
        }
      });
    },
    //修改路由
    updateRouter() {
      this.$refs['routerForm'].validate((valid) => {
        if (valid) {
          const router = {
            routerId: this.routerForm.routerId,
            parentId: this.parentId,
            name: this.routerForm.name,
            path: this.routerForm.path,
            component: this.routerForm.component,
            title: this.routerForm.title,
            description: this.routerForm.description,
            icon: this.routerForm.icon,
            isAuth: this.routerForm.isAuth == '1' ? true : false,
          };
          this.$api.vueRouter.updateRouter(router).then((res) => {
            const { data, success, message } = res.data;
            if (!success) {
              this.$message({ message: '修改失败！', type: 'error' });
            } else {
              this.$message({ message: '修改成功！', type: 'success' });
              this.dialogObject.EditVisible = false;
              this.setDynamicRouter();
              this.loadData(); //加载数据
            }
          });
        } else {
          this.$message({ message: '请修正数据格式', type: 'error' });
        }
      });
    },
    //修改路由状态
    updateRouterState(row) {
      this.$api.vueRouter.updateRouterState(row.routerId, row.state).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          this.$message({ message: '修改失败！', type: 'error' });
        } else {
          if (row.state == 1) {
            this.$message({ message: '开启成功！', type: 'success' });
          } else {
            this.$message({ message: '禁用成功！', type: 'success' });
          }
          this.loadData();
        }
      });
    },
  },
  created() {
    this.loadData();
    this.constructRouteCascadeData();
  },
};
</script>

<style lang="less" scoped>
.setting_container {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 20px 0px 10px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
    }
    .edit_query {
      // border: 1px solid red;
      width: 100%;
      display: grid;
      grid-template-columns: 2fr 1fr;
      overflow: hidden;
      grid-column-gap: 5px;
      text-align: center;
    }
  }
}
</style>
