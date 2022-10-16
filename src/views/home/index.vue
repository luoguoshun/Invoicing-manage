<template>
  <div class="home">
    <!-- 基础数据统计-->
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="statistics" style="background:#67C23A">
          <div class="title">
            <p>系统活跃</p>
            <el-tag size="mini" type="warning">实时</el-tag>
          </div>
          <div class="num" id="todayLoginTotal">{{ todayLoginTotal }}</div>
          <div class="tip">今日系统活跃数量</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="statistics" style="background:#409eff">
          <div class="title">
            <p>用户统计</p>
            <el-tag size="mini" type="success">实时</el-tag>
          </div>
          <div class="num" id="userTotal">{{ userTotal }}</div>
          <div class="tip">当前总用户数量</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="statistics" style="background:#E6A23C">
          <div class="title">
            <p>商品统计</p>
            <el-tag size="mini" type="info">实时</el-tag>
          </div>
          <div class="num" id="skuTotal">{{ skuTotal }}</div>
          <div class="tip">当前总商品数量</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="statistics" style="background:#909399">
          <div class="title">
            <p>销售统计</p>
            <el-tag size="mini" type="primary">实时</el-tag>
          </div>
          <div class="num" id="salesTotalPrice">{{ salesTotalPrice }}</div>
          <div class="tip">当前总销售(元)</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="statistics" style="background:#EA7F7F">
          <div class="title">
            <p>采购计划申请统计</p>
            <el-tag size="mini" type="primary">实时</el-tag>
          </div>
          <div class="num" id="todayPlanAppTotal">{{ todayPlanAppTotal }}</div>
          <div class="tip">今日采购计划申请统总数</div>
        </div>
      </el-col>
    </el-row>
    <el-badge value="new" class="item"> <p class="collapseTip">通知列表</p> </el-badge>
    <el-collapse v-model="activeMessageId" @change="readMessage" accordion>
      <el-collapse-item v-for="item in messageList" :key="item.messageId" :name="item.messageId">
        <template slot="title">
          <i class="el-icon-chat-dot-round"></i>{{ item.title }}
          <el-badge v-if="item.messageState == 3 || item.messageState == 2" is-dot class="item" />
        </template>
        <div class="collapseContent">{{ item.content }}</div>
        <div>
          <el-button type="success" size="mini" @click="readMessage(item.messageId, item.messageState)">已读</el-button>
          <el-button type="warning" size="mini">办理</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todayLoginTotal: 0,
      skuTotal: 0,
      userTotal: 0,
      todayPlanAppTotal: 0,
      salesTotalPrice: 0,
      activeMessageId: '',
      messageList: [],
    };
  },
  methods: {
    //数据渲染
    dataStatistics() {
      try {
        this.$signalR.connection.on('SendDataStatistics', function(message) {
          if (document.getElementById('skuTotal') != null) {
            document.getElementById('skuTotal').innerHTML = message.Content.skuTotal;
          }
          if (document.getElementById('todayLoginTotal') != null) {
            document.getElementById('todayLoginTotal').innerHTML = message.Content.todayLoginTotal;
          }
          if (document.getElementById('userTotal') != null) {
            document.getElementById('userTotal').innerHTML = message.Content.userTotal;
          }
          if (document.getElementById('todayPlanAppTotal') != null) {
            document.getElementById('todayPlanAppTotal').innerHTML = message.Content.todayPlanAppTotal;
          }
          if (document.getElementById('salesTotalPrice') != null) {
            document.getElementById('salesTotalPrice').innerHTML = message.Content.salesTotalPrice;
          }
          if (document.getElementById('todayPlanAppTotal') != null) {
            document.getElementById('todayPlanAppTotal').innerHTML = message.Content.todayPlanAppTotal;
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    //获取我的消息列表
    async getMessageListByUserId() {
      await this.$api.message.getMessageListByUserId().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.messageList = data;
      });
    },
    //点开面板 消息被读取
    readMessage(messageId) {
      //展开面板时触发
      if (messageId == '') {
        return;
      }
      //判断是否需要调取接口messageState == 4（已读）则不需要
      for (let i = 0; i < this.messageList.length; i++) {
        let message = this.messageList[i];
        if (message.messageId == messageId && message.messageState == 4) {
          return;
        }
      }
      this.$api.message.readMessage(messageId).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        } else {
          this.messageList.forEach((item) => {
            if (item.messageId == messageId) {
              item.messageState = 4;
              return;
            }
          });
        }
      });
    },
  },
  created() {
    this.dataStatistics();
    this.getMessageListByUserId();
  },
};
</script>

<style lang="less" scoped>
.home {
  .el-row {
    padding: 0 9px;
    margin: 5px 0px 20px 0px;
    .statistics {
      color: white;
      height: 100px;
      border-radius: 4px;
      padding: 0 8px;
      div {
        padding-bottom: 8px;
      }
      .title {
        display: flex; // 弹性布局
        justify-content: space-between; // 两边对齐
        align-items: center; // 垂直居中
      }
      p {
        font-size: 13px;
        font-weight: bold;
      }
      .num {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
      }
      .tip {
        font-size: 12px;
      }
    }
  }
  .collapseTip {
    font-size: 20px;
    margin-left: 10px;
    .item {
      // margin-top: 30px;
      // margin-right: 40px;
    }
  }
  .el-collapse {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 50%;
    height: 400px;
    overflow: auto;
    margin-left: 10px;
    padding-left: 10px;
    .collapseContent {
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
      font-size: 15px;
      margin-bottom: 5px;
    }
  }
}
</style>
