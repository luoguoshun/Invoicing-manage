<template>
  <div class="home">
    <div id="myChart" :style="{ width: '500px', height: '400px' }"></div>
    home
  </div>
</template>

<script>
import * as echarts from 'echarts';
// import signalR from "@/utils/signalR.js";
export default {
  data() {
    return {
      chartValue: [
        { value: 1048, name: '文学' },
        { value: 735, name: '励志' },
        { value: 580, name: '小说' },
        { value: 484, name: '故事' },
        { value: 300, name: '言情' },
      ],
      num: 1,
    };
  },
  //实例被挂载后调用
  mounted() {
    // this.startConnection();
    // this.drawLine();
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
  },
};
</script>

<style>
.home {
  width: 100%;
  height: 100%;
}
</style>
