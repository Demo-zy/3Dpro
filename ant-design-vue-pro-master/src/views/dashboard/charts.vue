<template>
<div>
  <div>
    <div class="switchTab">
      <a-button @click.stop="handlethreeD">3D</a-button>
      <a-button @click.stop="handletwoD">2D</a-button>
    </div>
    <div id="main"  style="width: 600px;height:400px;">

    </div>
  </div>
</div>
</template>

<script>
import * as echarts from '@/assets/js/echartsForce';

export default {
  name: "charts",
  mounted() {
    console.log(echarts,'echarts')
var eChart = echarts.init(document.getElementById('main'));
// 绘制图表
    eChart.setOption({
  title: {
    text: 'ECharts 入门示例'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
});
  },
  methods:{
    handlethreeD(){
      this.$router.push({
        path:'/dashboard/analysis'
      })
    },
    handletwoD(){
      this.$router.push({
        path: '/dashboard/charts'
      })
    }
  }

}
</script>

<style scoped>

.switchTab{
  position: absolute;
  right: 5%;
  top: 13%;
  z-index: 1000;
}

#chart-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

</style>