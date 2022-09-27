<template>
  <div class="home">
    <!-- <div id="myChart" :style="{ width: '500px', height: '400px' }"></div> -->
    <div id="columnChart" :style="{ width: '500px', height: '400px' }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
// import signalR from "@/utils/signalR.js";
export default {
  data() {
    return {};
  },
  //实例被挂载后调用
  mounted() {
    // this.startConnection();
    // this.drawLine();
    this.initializeColumnChart();
  },
  methods: {
    //启动连接
    startConnection() {
      try {
        // this.$signalR.connectSignalR();
        this.$signalR.connection.start();
        console.log('signalR is connection');
      } catch (err) {
        console.log(err);
      }
    },
    drawLine() {
      //初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'), 'dark');
      this.$signalR.connection.on('GetStatisticsSubscribe', (res) => {
        myChart.setOption({
          title: {
            text: '异步数据加载示例',
          },
          //鼠标悬停时文本提示
          tooltip: {
            trigger: 'item',
          },
          //图例
          legend: {
            // data: ['销量'],
            top: '2%',
            left: 'center',
          },
          series: [
            {
              // 图标类型
              type: 'pie',
              radius: ['40%', '70%'],
              // 避免标签重叠
              avoidLabelOverlap: true,
              label: {
                show: false,
                position: 'center',
              },
              // 高亮样式。
              emphasis: {
                itemStyle: {
                  //鼠标悬停时高亮时点的颜色。
                  color: 'blue',
                },
                label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold',
                },
              },
              data: res,
            },
          ],
        });
      });
      // 该监听器正在监听一个`echarts 事件`。
      myChart.on('click', function(event) {
        console.log(event);
      });
    },
    initializeColumnChart() {
      var chartDom = document.getElementById('columnChart');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '2015', '2016', '2017'],
            ['Matcha Latte', 43.3, 85.8, 93.7],
            ['Milk Tea', 83.1, 73.4, 55.1],
            ['Cheese Cocoa', 86.4, 65.2, 82.5],
            ['Walnut Brownie', 72.4, 53.9, 39.1],
          ],
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
      };
      option && myChart.setOption(option);
    },
  },
};
</script>

<style>
.home {
  width: 100%;
  height: 100%;
}
</style>
