<template>
  <div class="charts">
    <div>
      <div class="switchTab">
        <a-button @click.stop="handlethreeD">3D</a-button>
        <a-button @click.stop="handletwoD">2D</a-button>
      </div>


    </div>

    <div id="mainCanvas"></div>
    <div class="btn_list">

      <button id="upper" @click.stop="handleYewu">业务层</button>
      <button id="middle" @click.stop="handleWangluo">网络层</button>
      <button id="bottom" @click.stop="handleWuli">物理层</button>

    </div>
  </div>
</template>

<script>
import * as echarts from '@/assets/js/echarts.min';
import Json from "@/assets/data/newData.json";

export default {
  name: "charts",
  data() {
    return {
      node: [],
      links: [],
      myChart: null
    }
  },
  mounted() {

    this.getData();
    setTimeout(() => {
      this.handleYewu()
    })


  },
  methods: {
    initCharts(link, node) {
      console.log(link, node, 'linknode')

// 绘制图表
      var chartDom = document.getElementById('mainCanvas');
      this.myChart = echarts.init(chartDom);
      var option;


      option = {
        title: {
          text: 'Basic Graph'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            roam: true,
            label: {
              show: true
            },
            edgeSymbol: ['circle', 'line'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            data: node,
            links: link,
            lineStyle: {
              opacity: 0.9,
              width: 4,
              curveness: 0,
              color:'#fff'
            }
          }
        ]
      };

      option && this.myChart.setOption(option);
    },

    handlethreeD() {
      this.$router.push({
        path: '/dashboard/analysis'
      })
    },
    handletwoD() {
      this.$router.push({
        path: '/dashboard/charts'
      })
    },
    getData() {
      var jsonData = Json;
      this.links = this.splitArrayByLayer(jsonData.links)
      this.node = this.splitArrayByLayer(jsonData.nodes)
      console.log(this.links, this.node, 'this.links,this.node')

    },

    splitArrayByLayer(dataArray) {
      // 创建一个对象来存储按layer分类的数组
      let layers = {};

      // 遍历数组
      dataArray.forEach(item => {
        // 获取当前项的layer
        let layer = item.layer;

        // 如果layers对象中还没有这个layer的数组，就创建一个
        if (!layers[layer]) {
          layers[layer] = [];
        }

        // 将当前项添加到对应layer的数组中
        layers[layer].push(item);
      });

      // 返回按layer分类的对象
      return layers;
    },

    deepClone(arr) {
      const clone = [];
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          clone[i] = this.deepClone(arr[i]);
        } else if (typeof arr[i] === 'object' && arr[i] !== null) {
          clone[i] = this.deepCloneObject(arr[i]);
        } else {
          clone[i] = arr[i];
        }
      }
      return clone;
    },
    deepCloneObject(obj) {
      const cloneObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (Array.isArray(obj[key])) {
            cloneObj[key] = this.deepClone(obj[key]);
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            cloneObj[key] = this.deepCloneObject(obj[key]);
          } else {
            cloneObj[key] = obj[key];
          }
        }
      }
      return cloneObj;
    },

    handleYewu() {
      if (this.myChart) {

        this.myChart.dispose();
      }

      let linksFinall = this.idToname(this.deepClone(this.links[2]), this.deepClone(this.node[2]))

      setTimeout(() => {
        this.initCharts(linksFinall, this.node[2])
      })


    },
    handleWangluo() {
      if (this.myChart) {

        this.myChart.dispose();
      }
      let linksFinall = this.idToname(this.deepClone(this.links[1]), this.deepClone(this.node[1]))

      this.initCharts(linksFinall, this.node[1])
    },
    handleWuli() {
      if (this.myChart) {

        this.myChart.dispose();
      }
      let linksFinall = this.idToname(this.deepClone(this.links[3]), this.deepClone(this.node[3]))
      this.initCharts(linksFinall, this.node[3])
    },
    idToname(json1, json2) {

      const idToNameMap = {};
      for (let i = 0; i < json2.length; i++) {
        idToNameMap[json2[i].id] = json2[i].name;
      }

// 遍历第一个JSON对象数组，替换source和target
      for (let i = 0; i < json1.length; i++) {

        json1[i].source = idToNameMap[json1[i].source];
        json1[i].target = idToNameMap[json1[i].target];

      }


      return json1;

    }
  }

}
</script>

<style scoped>

.charts {
  height: 100%;
  width: 100%;
  background: #000000;
}

.switchTab {
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

#mainCanvas {
  width: 1200px;
  height: 1000px;

}

.btn_list {
  position: absolute;
  bottom: 40px;
  left: 35%;
}

#main {
  color: rgba(166, 238, 244, 0.7);
  background: transparent;
  border: 1px solid rgb(166, 238, 244);
  box-shadow: 0 0 2px rgba(166, 238, 244, 0.2), inset 0 0 5px rgb(166, 238, 244), 0 2px 0 #000;
  padding: 5px 20px;
  cursor: pointer;
  margin: 5px;
  font-size: 20px;

}

#upper {
  color: rgba(240, 134, 82, 0.7);
  background: transparent;
  border: 1px solid rgb(240, 134, 82);
  box-shadow: 0 0 2px rgba(240, 134, 82, 0.2), inset 0 0 5px rgb(240, 134, 82), 0 2px 0 #000;
  padding: 5px 20px;
  cursor: pointer;
  margin: 5px;
  font-size: 20px
}

#middle {
  color: rgba(0, 255, 255, 0.7);
  background: transparent;
  border: 1px solid rgb(0, 255, 255);
  box-shadow: 0 0 2px rgba(0, 255, 255, 0.8), inset 0 0 5px rgb(0, 255, 255), 0 20px 0 #000;
  padding: 5px 20px;
  cursor: pointer;
  margin: 5px;
  font-size: 20px
}

#bottom {
  color: rgba(122, 225, 116, 0.7);
  background: transparent;
  border: 1px solid rgb(122, 225, 116);
  box-shadow: 0 0 2px rgba(122, 225, 116, 0.8), inset 0 0 5px rgb(122, 225, 116), 0 2px 0 #000;
  padding: 5px 20px;
  cursor: pointer;
  margin: 5px;
  font-size: 20px
}

#browse {
  color: rgba(166, 238, 244, 0.7);
  background: transparent;
  border: 1px solid rgb(166, 238, 244);
  box-shadow: 0 0 2px rgba(166, 238, 244, 0.2), inset 0 0 5px rgb(166, 238, 244), 0 2px 0 #000;
  padding: 5px 20px;
  cursor: pointer;
  margin: 5px;
  font-size: 20px
}

#main:hover {
  background-color: rgba(166, 238, 244, 0.4)
}

#upper:hover {
  background-color: rgba(240, 134, 82, 0.4)
}

#middle:hover {
  background-color: rgba(30, 160, 230, 0.4)
}

#bottom:hover {
  background-color: rgba(122, 225, 116, 0.4)
}

#browse:hover {
  background-color: rgba(166, 238, 244, 0.4)
}

</style>