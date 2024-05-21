<template>
<div>
  <div>
    <div class="switchTab">
      <a-button @click.stop="handlethreeD">3D</a-button>
      <a-button @click.stop="handletwoD">2D</a-button>
    </div>
    <div>
      这里是echarts
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "charts",
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
</style>