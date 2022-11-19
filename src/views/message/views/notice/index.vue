<template>
  <div class="notice">
    <div class="editbar">
      <div class="edit_btn">
        <el-button type="primary" size="mini" class="el-icon-check" @click="OpenAddMessageDiolog()">新增消息</el-button>
        <el-button type="danger " size="mini" class="el-icon-check" @click="deletetMessage()">删除</el-button>
      </div>
      <div class="edit_query">
        <div></div>
        <el-input size="mini" label-width="80px" placeholder="请输入关键字" v-model="queryForm.conditions"></el-input>
        <el-button type="primary" @click="geMessageList()" size="mini">查找</el-button>
        <el-button type="primary" @click="resetQueryForm()" size="mini">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :header-cell-style="{ 'text-align': 'center' }" @selection-change="selectRows" border="" ref="MessageTable" :data="table.MessageList">
      <el-table-column type="selection" width="50" align="center"> </el-table-column>
      <el-table-column prop="messageId" label="消息编号" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>消息编号: {{ scope.row.messageId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag disable-transitions>{{ scope.row.messageId }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="messageState" label="状态编号" v-if="false"> </el-table-column>
      <el-table-column prop="messageStateStr" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="getElTagClass(scope.row)" effect="plain">{{ scope.row.messageStateStr }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="messageType" label="消息类型" align="center"> </el-table-column>
      <el-table-column prop="receiverId" label="接收人" align="center" width="100px"> </el-table-column>
      <el-table-column prop="sendTime" label="接收时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.sendTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="senderId" label="发送人" align="center" width="100px"> </el-table-column>
      <el-table-column prop="title" label="抬头" align="center"> </el-table-column>
      <el-table-column prop="sendTime" label="发送时间" align="center">
        <template slot-scope="scope">
          {{ $timeFormat.leaveTime(scope.row.sendTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" align="center"> </el-table-column>
      <el-table-column prop="messageParameter" label="消息参数" align="center" v-if="true">
        <template slot-scope="scope">
          <el-tag disable-transitions @click="openMessageParameter(scope.row.messageParameter)">查看详情</el-tag>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog title="新增消息" center :visible.sync="dialogObject.addVisible" :close-on-click-modal="false" width="40%">
      <el-form ref="updateform" :model="addMessageForm" label-width="100px">
        <el-form-item label="发送人">
          <el-input v-model="addMessageForm.senderName" disabled></el-input>
        </el-form-item>
        <el-form-item label="发送人Id" v-if="false">
          <el-input v-model="addMessageForm.senderId" disabled></el-input>
        </el-form-item>
        <el-form-item label="消息类型">
          <el-select size="mini" v-model="addMessageForm.messageType" placeholder="消息类型">
            <el-option value="通知" label="通知"></el-option>
            <el-option value="消息发送" label="消息发送"></el-option>
            <el-option value="数据统计" label="数据统计"></el-option>
            <el-option value="采购计划审批" label="采购计划审批"></el-option>
            <el-option value="采购开单审批" label="采购开单审批"></el-option>
            <el-option value="销售开单审批" label="销售开单审批"></el-option>
            <el-option value="物品入库审批" label="物品入库审批"></el-option>
            <el-option value="物品出库审批" label="物品出库审批"></el-option>
            <el-option value="销售退货审批" label="销售退货审批"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addMessageForm.title"></el-input>
        </el-form-item>
        <el-form-item label="接收人" prop="receiverId">
          <el-select v-model="addMessageForm.receiverId" filterable placeholder="请选择用户">
            <el-option v-for="item in userInfo" :key="item.userId" :label="item.name" :value="item.userId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="addMessageForm.content" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogObject.addVisible = false">取 消</el-button>
        <el-button type="success" @click="addMessage()">新增消息</el-button>
      </div>
    </el-dialog>

    <!-- 消息参数对话框 -->
    <el-dialog title="消息参数" :visible.sync="MessageParameterDialog.visible" center width="40%">
      <el-descriptions class="margin-top" title="详细信息" :column="1">
        <el-descriptions-item label="付款编号">{{ MessageParameterDialog.instanceId }}</el-descriptions-item>
        <el-descriptions-item label="付款编号">{{ MessageParameterDialog.isHandle }}</el-descriptions-item>
        <el-descriptions-item label="付款编号">{{ MessageParameterDialog.targetRouterName }}</el-descriptions-item>
        <el-descriptions-item label="付款编号">{{ MessageParameterDialog.text }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>
  
  <script>
import store from '@/store';
// import sliderVue from '../../../../page/layout/slider.vue';
export default {
  data() {
    return {
      queryForm: {
        page: 1,
        row: 10,
        conditions: '',
      },
      addMessageForm: {
        senderId: '',
        senderName: '', //发送人
        title: '',
        receiverId: '', //接收人
        messageType: '',
        content: '',
      },
      table: {
        MessageList: [],
        total: 0,
      },
      MessageIds: [],
      dialogObject: {
        addVisible: false,
        updateVisible: false,
      },
      userInfo: [{ UserName: [], UserId: [] }],
      MessageParameterDialog: {
        visible: false,
        instanceId: '',
        isHandle: true,
        targetRouterName: '',
        text: '',
      },
    };
  },
  computed: {},
  methods: {
    loadData() {
      this.geMessageList();
    },
    //获取所有消息列表
    async geMessageList() {
      await this.$api.message.getMessageList(this.queryForm).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.table.MessageList = data.message;
        this.table.total = data.count;
        this.table.MessageList.forEach((element) => {
          element.messageParameter = JSON.parse(element.messageParameter);
        });
        //console.log(JSON.parse(data.message[0].messageParameter));
        console.log(this.table);
      });
    },
    //新增消息
    async addMessage() {
      const from = {
        Title: this.addMessageForm.title,
        SenderId: this.addMessageForm.senderId,
        ReceiverId: this.addMessageForm.receiverId,
        Content: this.addMessageForm.content,
        MessageType: this.addMessageForm.messageType,
        MessageParameter: '',
      };
      await this.$api.message.addMessage(from).then((res) => {
        const { success, message } = res.data;
        if (!success) {
          console.log(message);
          this.$message.error('删除失败');
        } else {
          this.$message({ message: '删除成功', type: 'success' });
          this.loadData();
        }
      });
    },
    //删除消息
    async deletetMessage() {
      if (this.MessageIds.length == 0) {
        this.$message({
          message: '请选择要删除的消息信息',
          type: 'warning',
        });
        return false;
      } else {
        await this.$api.message.deleteMessage(this.MessageIds).then((res) => {
          const { success, message } = res.data;
          if (!success) {
            console.log(message);
            this.$message.error('删除失败');
          } else {
            this.$message({ message: '删除成功', type: 'success' });
            this.loadData();
          }
        });
      }
    },
    //获取用户信息
    async getUserList() {
      await this.$api.user.GetUserList(this.queryForm.page, this.queryForm.row, this.queryForm.conditions, this.queryForm.roleId).then((res) => {
        const { data, success, message } = res.data;
        console.log(data);
        if (!success) {
          console.log(message);
          return;
        }
        this.userInfo = data.users;
      });
    },
    openMessageParameter(row)
    {
        this.MessageParameterDialog.instanceId=row.InstanceId;
        this.MessageParameterDialog.isHandle=row.IsHandle;
        this.MessageParameterDialog.targetRouterName=row.TargetRouterName;
        this.MessageParameterDialog.text=row.Text;
        this.MessageParameterDialog.visible=true;
    },
    getElTagClass(row) {
      if (row.orderStateStr == '待编辑') {
        return 'success';
      } else if (row.orderStateStr == '已完成') {
        return 'warning';
      } else {
        return '';
      }
    },

    selectRows(selection) {
      console.log(selection);
      alert(selection[0].messageParameter.InstanceId);
      this.MessageIds = [];
      selection.forEach((element) => {
        this.MessageIds.push(element.messageId);
      });
      //console.log(this.MessageIds);
    },
    //打开修改弹窗
    OpenAddMessageDiolog() {
      this.getUserList();
      this.addMessageForm.senderName = store.getters['userInfo/getUserInfo'].name;
      this.addMessageForm.senderId = store.getters['userInfo/getUserInfo'].userId;
      this.dialogObject.addVisible = true;
    },
    handleSizeChange(row) {
      console.log(row);
      this.queryForm.row = row;
      this.loadData();
    },
    //页数改变
    handleCurrentChange(page) {
      this.queryForm.page = page;
      this.loadData();
    },
    //重置搜索条件
    resetQueryForm() {
      this.queryForm.state = 1;
      this.queryForm.approvalName = '';
      this.queryForm.warehouseId = '';
      this.queryForm.publicationDates = [];
      this.loadData();
    },
  },
  created() {
    this.loadData();
  },
};
</script>
  
  <style lang="less" scoped>
.notice {
  height: 100%;
  width: 100%;
  .editbar {
    width: 100%;
    margin: 5px 0px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    .edit_btn {
      display: flex;
      flex-direction: row;
      grid-gap: 5px;
      justify-content: flex-start; //左对齐lex-end：右对齐 space-between：两端对齐，项目之间的间隔都相等
    }
    .edit_query {
      display: grid;
      grid-template-columns: 4fr 2fr 0.5fr 0.5fr;
      grid-column-gap: 5px;
      .edit_query_1:last-child {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    }
  }
}
</style>