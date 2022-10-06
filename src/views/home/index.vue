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
          <div class="num">7</div>
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
    };
  },
  methods: {
    dataStatistics() {
      try {
        this.$signalR.connection.start();
        this.$signalR.connection.on('SendMessageToGroup', function(message) {
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
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  created() {
    this.dataStatistics();
  },
};
</script>

<style lang="less" scoped>
.home {
  .el-row {
    padding: 0 9px;
    margin: 5px 0px 10px 0px;
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
}
</style>
