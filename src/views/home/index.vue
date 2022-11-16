<template>
  <div class="home"  >
    <div class="left" v-loading="fullscreenLoading">
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
            <div class="tip">今日采购计划申请</div>
          </div>
        </el-col>
      </el-row>
      <el-tabs v-model="left_activeName" @tab-click="leftTabClick()">
        <el-tab-pane label="消息中心" name="message">
          <el-collapse v-model="activeMessageId" @change="readMessage" accordion>
            <el-collapse-item v-for="item in messageList" :key="item.messageId" :name="item.messageId">
              <template slot="title">
                <i class="el-icon-chat-dot-round"></i>{{ item.title }}
                <el-badge v-if="item.messageState != 4" is-dot />
              </template>
              <div class="collapseContent">{{ item.content }}</div>
              <div>
                <!-- <el-button type="success" size="mini" @click="readMessage(item.messageId, item.messageState)">已读</el-button> -->
                <el-button v-if="item.messageParameter" type="warning" size="mini" @click="processEvent(item.messageParameter)">详情 </el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="销售统计" name="sales" class="sales">
          <div>
            <el-radio-group v-model="salesDateType" size="small" @change="salesDateTypeChange">
              <el-radio-button label="year">年</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="day">日</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart">
            <div id="salesStatistics" :style="{ width: '550px', height: '400px' }"></div>
            <div id="salesTotalCount" :style="{ width: '550px', height: '400px' }"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="仓库统计" name="warahouse" class="warehouse">
          <div></div>
          <div class="chart">
            <div id="wHmaterialStatistics" :style="{ width: '550px', height: '400px' }"></div>
            <div id="wHCostStatistics" :style="{ width: '550px', height: '400px' }"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
    <div class="right">
      <el-tabs v-model="right_activeName">
        <el-tab-pane label="常用功能" name="often" class="often">
          <p><el-link :underline="false" type="warning" @click="$router.push({ name: 'applicationPlan' })">采购计划申请</el-link></p>
          <p><el-link :underline="false" type="warning" @click="$router.push({ name: 'applyForBilling' })">采购单申请</el-link></p>
          <p><el-link :underline="false" type="warning" @click="$router.push({ name: 'ReturnReceipt' })">物品入库</el-link></p>
          <p><el-link :underline="false" type="warning" @click="$router.push({ name: 'ExwarehouseReceipt' })">物品出库</el-link></p>
          <p><el-link :underline="false" type="warning" @click="$router.push({ name: 'systemLog' })">系统日志</el-link></p>
        </el-tab-pane>
        <el-tab-pane label="关键数据" name="keyData">
          <p><i class="el-icon-s-data"></i>物资总数:{{goodsCount}}</p>
          <p><i class="el-icon-s-data"></i>仓库总成本:{{totalCost}}</p>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
var salesStatisticsChart; //全局变量:销售额统计
var salesTotalCountChart; //全局变量:销售数量统计
var wHMaterialStatistics; //全局变量:仓库物资统计
var wHCostStatistics; //全局变量:仓库数据数量统计
import * as echarts from 'echarts';
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
      left_activeName: 'message', //激活的标签页
      right_activeName: 'often',
      salesDateType: 'year',
      goodsCount: 0,//物资总数
      totalCost: 0,//仓库总成本
      fullscreenLoading: false
    };
  },
  methods: {
    //数据渲染
    dataStatistics() {
      try {
        this.$signalR.connection.on('SendDataStatistics', function(message) {
          if (document.getElementById('skuTotal') != null) {
            document.getElementById('skuTotal').innerHTML = message.MessageParameter.skuTotal;
          }
          if (document.getElementById('todayLoginTotal') != null) {
            document.getElementById('todayLoginTotal').innerHTML = message.MessageParameter.todayLoginTotal;
          }
          if (document.getElementById('userTotal') != null) {
            document.getElementById('userTotal').innerHTML = message.MessageParameter.userTotal;
          }
          if (document.getElementById('todayPlanAppTotal') != null) {
            document.getElementById('todayPlanAppTotal').innerHTML = message.MessageParameter.todayPlanAppTotal;
          }
          if (document.getElementById('salesTotalPrice') != null) {
            document.getElementById('salesTotalPrice').innerHTML = message.MessageParameter.salesTotalPrice;
          }
          if (document.getElementById('todayPlanAppTotal') != null) {
            document.getElementById('todayPlanAppTotal').innerHTML = message.MessageParameter.todayPlanAppTotal;
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
    //处理事件
    processEvent(messageParameter) {
      if (messageParameter['targetRouterName']) {
        this.$router.push({
          name: messageParameter['targetRouterName'],
          query: {
            IsToBeList: true,
          },
        });
      }
    },
    //左边Tab栏点击触发事件
    leftTabClick(tab) {
      switch (this.left_activeName) {
        case 'message':
          if (salesStatisticsChart != undefined) {
            salesStatisticsChart.dispose(); //销毁销售额数据统计
          }
          if (salesTotalCountChart != undefined) {
            salesTotalCountChart.dispose(); //销毁销售额数据统计
          }
          if (wHMaterialStatistics != undefined) {
            wHMaterialStatistics.dispose(); //销毁销售额数据统计
          }
          if (wHCostStatistics != undefined) {
            wHCostStatistics.dispose(); //销毁销售额数据统计
          }
          break;
        case 'sales':
          if (wHMaterialStatistics != undefined) {
            wHMaterialStatistics.dispose(); //销毁销售额数据统计
          }
          if (wHCostStatistics != undefined) {
            wHCostStatistics.dispose(); //销毁销售额数据统计
          }
          setTimeout(() => {
            this.initSalesStatistics(); //初始化销售额统计数据
          }, 100);
          break;
        case 'warahouse':
          if (salesStatisticsChart != undefined) {
            salesStatisticsChart.dispose(); //销毁销售额数据统计
          }
          if (salesTotalCountChart != undefined) {
            salesTotalCountChart.dispose(); //销毁销售额数据统计
          }
          setTimeout(() => {
            this.initWHStatistics(); //初始化销售额统计数据
          }, 100);
          break;
        default:
          break;
      }
    },
    //---数据统计---start
    //销售年月日改变
    salesDateTypeChange() {
      salesStatisticsChart.dispose(); //销毁
      salesTotalCountChart.dispose(); //销毁
      this.initSalesStatistics(); //初始化数据
    },
    //初始化 销售额统计 销售数量数据
    initSalesStatistics() {
      var chartDom1 = document.getElementById('salesStatistics');
      salesStatisticsChart = echarts.init(chartDom1);
      var chartDom2 = document.getElementById('salesTotalCount');
      salesTotalCountChart = echarts.init(chartDom2);
      this.$api.sales.salesStatistics(this.salesDateType).then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        //数组反转
        let xAxisData = data.timeInterval.reverse();
        salesStatisticsChart.setOption({
          title: {
            text: '销售额统计/元',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: xAxisData,
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '50%',
              color: '#67C23A',
              data: data.salesTotalPriceData.reverse(),
            },
          ],
        });
        salesTotalCountChart.setOption({
          title: {
            text: '销售数量统计',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: xAxisData,
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '50%',
              data: data.goodsTotalCountData.reverse(),
            },
          ],
        });
      });
    },
    //初始化 仓库物资 成本统计
    initWHStatistics() {
      var chartDom1 = document.getElementById('wHmaterialStatistics');
      wHMaterialStatistics = echarts.init(chartDom1);
      var chartDom2 = document.getElementById('wHCostStatistics');
      wHCostStatistics = echarts.init(chartDom2);
      this.$api.warehouse.warehouseStatistics().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        console.log(data);
        wHMaterialStatistics.setOption({
          title: {
            text: '仓库物资统计',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: data.goodsCountStatistics,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        });
        wHCostStatistics.setOption({
          title: {
            text: '仓库成本统计',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: data.totalCostStatistics,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        });
      });
    },
    //---数据统计---end
    //计算所有仓库的总成本、物资总和
    calculateAllWarehouseItems() {
      this.$api.warehouse.calculateAllWarehouseItems().then((res) => {
        const { data, success, message } = res.data;
        if (!success) {
          console.log(message);
          return;
        }
        this.goodsCount = data.goodsCount;
        this.totalCost = data.totalCost;
      });
    },
  },
  created() {
    this.dataStatistics();
    this.getMessageListByUserId();
    this.calculateAllWarehouseItems();
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  // height: 100%;
  display: grid;
  grid-template-columns: 1fr 190px;
  grid-gap: 10px;
  .left {
    .el-row {
      margin: 5px 0px 20px 0px;
      background-color: rgb(251, 251, 251);
      border-radius: 5px 5px 5px 5px;
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
    .el-tabs {
      border: 1px solid rgb(239, 233, 233);
      border-radius: 5px 5px 0px 0px;
      padding-left: 5px;
      .collapseTip {
        font-size: 20px;
        margin-left: 10px;
      }
      .el-collapse {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        width: 50%;
        height: 400px;
        overflow: auto;
        padding-left: 10px;
        .collapseContent {
          font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
          font-size: 15px;
          margin-bottom: 5px;
        }
      }
      .sales {
        > :first-child {
          margin-bottom: 5px;
        }
        > :last-child {
          display: flex;
          flex-direction: row;
          grid-gap: 10px;
        }
      }
      .warehouse {
        > :last-child {
          display: flex;
          flex-direction: row;
          grid-gap: 10px;
        }
      }
    }
  }
  .right {
    border: 1px solid rgb(239, 233, 233);
    border-radius: 5px 5px 0px 0px;
    overflow: hidden;
    .el-tabs {
      padding-left: 10px;
      .often {
        > p {
          margin-bottom: 5px;
          font-size: 20px;
          line-height: 20px;
        }
        > p:hover {
          background-color: rgb(250, 255, 253);
        }
      }
    }
  }
}
</style>
