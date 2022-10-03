<template>
  <div class="log_container">
    <!-- 操作 -->
    <div class="editbar">
      <div class="edit_btn">
        <!-- <el-button type="danger" size="mini" class="el-icon-delete" @click="deleteLogs()">
          移除
        </el-button> -->
        <el-button type="primary" size="mini" @click="exportLog()">
          导出数据
        </el-button>
      </div>
      <div class="edit_query">
        <div class="edit_query_1">
          <el-date-picker v-model="queryForm.publicationDates" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
          </el-date-picker>
        </div>
        <div class="edit_query_1">
          <el-select size="mini" v-model="queryForm.type" placeholder="请选择操作日志等级">
            <!-- <el-option v-for="item in logtypeType" :key="item.type" :label="item.typeName" :value="item.type"></el-option> -->
            <el-option value="1" label="新增"></el-option>
            <el-option value="2" label="修改"></el-option>
            <el-option value="3" label="删除"></el-option>
            <el-option value="4" label="审批"></el-option>
            <el-option value="5" label="驳回"></el-option>
            <el-option value="6" label="申请"></el-option>
            <el-option value="7" label="付款"></el-option>
            <el-option value="8" label="登入"></el-option>
          </el-select>
        </div>
        <div class="edit_query_1">
          <el-input v-model="queryForm.conditions" size="mini" label-width="80px" placeholder="请输入"></el-input>
        </div>
        <div class="edit_query_1">
          <el-button type="primary" @click="selectLog()" size="mini">查找</el-button>
          <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      :data="table.logData"
      @selection-change="selectRows"
      border
    >
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
      <el-table-column prop="operateId" label="编号" width="50" align="center"> </el-table-column>
      <el-table-column prop="userId" label="操作人编号"  align="center"> </el-table-column>
      <el-table-column prop="operateName" label="操作人姓名"  align="center"> </el-table-column>
      <el-table-column prop="tableId" label="表名编号" align="center"> </el-table-column>
      <el-table-column prop="tableName" label="表名" align="center"> </el-table-column>
      <el-table-column prop="remake" label="操作说明" align="center">
        <template slot-scope="scope">
          <el-tag effect="plain">{{ scope.row.remake }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="detail" label="详细信息" align="center"></el-table-column> -->
      <el-table-column label="时间" width="140" align="center" sortable="true" sort-by>
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.LogDate) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="openUpdateDiolog(scope.row)" type="text" size="small">查看</el-button>
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
    <!-- 操作日志详细信息对话框 -->
    <el-dialog title="操作日志信息" center :visible.sync="updateDialog.visible" :close-on-click-modal="false" width="40%">
      <el-form ref="updateform" :model="operateLogForm" label-width="80px">
        <el-form-item label="设备编号">
          <el-input type="text" v-model="operateLogForm.operateId"></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-input type="text" v-model="operateLogForm.origin"></el-input>
        </el-form-item>
        <el-form-item label="路由">
          <el-input type="text" v-model="operateLogForm.routeInfo"></el-input>
        </el-form-item>
        <el-form-item label="详细信息">
          <el-input type="textarea" :rows="6" v-model="operateLogForm.message"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog.visible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //搜索模型
      queryForm: {
        page: 1,
        row: 5,
        conditions: '',
        type: '',
        publicationDates: [],
      },
      //表格数据
      table: {
        logData: [],
        total: 0,
      },
      operateLogIds: [],
      //修改对话框
      updateDialog: {
        visible: false,
      },
      //操作日志模型
      operateLogForm: {
        operateId: '',
        origin: '',
        routeInfo: '',
        message: '',
      },
      //书籍类别集合
      logtypeType: [{ type: 0, typeName: '请选择等级' }],
      fileList: [],
    };
  },
  methods: {
    //导出操作日志数据
    exportLog() {
      if (this.operateLogIds.length == 0) {
        this.$message({
          message: '请选择要导出的数据',
          type: 'warning',
        });
      } else {
        this.$api.log.exportLogs(this.operateLogIds).then((res) => {
          let { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('导出失败！');
          } else {
            this.$message({ message: '导出成功！', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //获取操作日志列表数据
    async getOperateLogLogList() {
      let queryForm = JSON.parse(JSON.stringify(this.queryForm));
      queryForm.type = queryForm.type == '' ? 0 : parseInt(queryForm.type);
      console.log(queryForm);
      await this.$api.log
        .getOperateLogLogList(queryForm.page, queryForm.row, queryForm.conditions, queryForm.type, queryForm.publicationDates)
        .then((res) => {
          const { data, success, message } = res.data;
          if (!success) {
            console.log(message);
            return;
          } else {
            this.table.logData = data.operateLogs;
            this.table.total = data.count;
          }
        });
    },
    //获取操作日志类型列表
    getLogTypeList() {
      this.$api.log.getLogTypeList().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        } else {
          this.logtypeType = data;
        }
      });
    },
    //加载数据
    loadData() {
      this.getOperateLogLogList();
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
    //查找操作日志
    selectLog() {
      this.queryForm.page = 1;
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.conditions = '';
      this.queryForm.type = '';
      this.queryForm.publicationDates = [];
      this.loadData();
    },
    //打开详细信息弹窗
    openUpdateDiolog(row) {
      this.operateLogForm = { ...row };
      this.updateDialog.visible = true;
    },
    //获取选中行的数据
    selectRows(selectRows) {
      this.operateLogIds = [];
      selectRows.forEach((element) => {
        this.operateLogIds.push(element.logId);
      });
    },
    //删除多条操作日志
    deleteLogs() {
      if (this.operateLogIds.length == 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning',
        });
      } else {
        this.$api.log.deleteLogs(this.operateLogIds).then((res) => {
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
    this.getLogTypeList();
  },
};
</script>

<style lang="less" scoped>
.log_container {
  width: 100%;
  height: 100%;
  .editbar {
    width: 100%;
    margin: 20px 0px 10px 0px;
    padding: 2px 0px;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      .upload {
        margin-left: 10px;
      }
    }
    .edit_query {
      width: 100%;
      display: grid;
      grid-template-columns: 2fr 1.5fr 1.5fr 1fr;
      grid-column-gap: 5px;
      .edit_query_1 {
        width: 100%;
        text-align: center;
        div {
          width: 100%;
          color: rgb(0, 153, 255);
        }
      }
    }
  }
}
</style>
