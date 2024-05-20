<template>
  <div class="body">

    <div class="info">
      网络空间态势监视
    </div>
    <!--three渲染容器 -->
    <div id="container" style="cursor: pointer"></div>

    <!--背景 -->
    <div id="background" style="cursor: pointer"></div>
    <!-- 名称框 -->
    <p id="abstract">文字文字</p>
    <!-- 详情框 -->
    <div id="detail">
      <textarea></textarea>
    </div>
    <!-- 图片框 -->
    <div id="picture">

    </div>
    <!--按钮组-->
    <div class="btn_list">
      <button id="main" @click.stop="handleThrid">三层展示</button>
      <button id="upper" @click.stop="handleYewu">业务层</button>
      <button id="middle" @click.stop="handleWangluo">网络层</button>
      <button id="bottom" @click.stop="hanleWuli">物理层</button>
      <button id="browse" @click.stop="handleRote">自动旋转</button>
    </div>

<!--    <a-button type="primary" @click.stop="showModal" >Open Modal</a-button>-->
    <a-modal v-model:open="open" title="Basic Modal" @ok.stop="handleOk" style="z-index: 100000">
      <p>{{abstract}}}</p>

    </a-modal>


  </div>
</template>

<script>
import moment from 'moment'
import {netTopology} from "./newInit"
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
import Json from "@/assets/data/data.json";
import { ref } from 'vue';



export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data () {
    return {
      loading: true,
      show:false,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      abstract:'',
      open:false,
      showMap:{},
      showMapAni:{},
      showObj:{
        container:'test',
        camera:null,
        controls:null,
        scene:null,
        renderer:null,
        raycaster:null,
        nodeObjects:[],
        nodePos:[],
        jsonData:null,
        isShowDetail:!1,
        INTERSECTED:null,
      },
      newNetTopo:null
    }
  },
  computed: {
    searchTableColumns () {
        return [
      {
        dataIndex: 'index',
        title: this.$t('dashboard.analysis.table.rank'),
        width: 90
      },
      {
        dataIndex: 'keyword',
        title: this.$t('dashboard.analysis.table.search-keyword')
      },
      {
        dataIndex: 'count',
        title: this.$t('dashboard.analysis.table.users')
      },
      {
        dataIndex: 'range',
        title: this.$t('dashboard.analysis.table.weekly-range'),
        align: 'right',
        sorter: (a, b) => a.range - b.range,
        scopedSlots: { customRender: 'range' }
      }
      ]
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading

    }, 1000)
  },
  mounted() {
    var jsonData = Json;
    var that=this;
    this.newNetTopo=new netTopology(this.showObj);
    this.newNetTopo.init(jsonData);
    this.newNetTopo.animate();
    this.newNetTopo.rotate();
    document.addEventListener("click",this.click , !1);



    this.stopMove()

    // document.getElementById("container").addEventListener("mousemove", this.zoom);

  },
  methods:{
    zoom(){
      console.log("scrolll");
    },
    //停止页面滚动
    stopMove(){
      let m = function(e){e.preventDefault();};
      document.body.style.overflow='hidden';
      document.addEventListener("touchmove",m,{ passive:false });//禁止页面滑动
    },
    //开启页面滚动
    Move(){
      let m =function(e){e.preventDefault();};
      document.body.style.overflow='';//出现滚动条
      document.removeEventListener("touchmove",m,{ passive:true });
    },
    handleOk(e) {
      console.log(e);
      this.open = false;
    },
    click(){
      let detail=this.newNetTopo.onMouseClick();
      console.log(detail,'detail')
      if(detail.userData){
        this.abstract=detail.userData.abstract?detail.userData.abstract:detail.userData;
        this.open = true;
      }

    },
    handleThrid(){
      this.newNetTopo.homeAnimation();
    },
    handleYewu(){
      this.newNetTopo.networkAnimation();

    },
    handleWangluo(){
      this.newNetTopo.serviceAnimation();
    },
    hanleWuli(){
      this.newNetTopo.virtualUser();
    },
    handleRote(){
      this.newNetTopo.rotate()
    }

  },
  beforeDestroy() {
    this.newNetTopo.destroy();
  }
}
</script>
<style lang="less" >
.body {
  font-family: Monospace;
  margin: 0px;
  overflow: hidden;
  height: 100%;
  background: #000000;
}

</style>

<style lang="less" >
::-webkit-scrollbar {
  display: none
}


.info {
  position: absolute;
  opacity: 0.8;
  color: white;
  font-family: "黑体";
  text-shadow: rgb(0, 255, 255) 0px 0px 0.2em;
  text-align: center;
  font-size: 38px;
  top: 20px;
  width: 100%;
  z-index: 1
}

#background {
  top: 2.5%;
  width:100%;
  height: 105%;
  position: absolute;
  background-image: url(~@/views/dashboard/pic/背景.png);
  background-size: 100% 100%;
  z-index: 0;

}

.btn_list {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 10px;
  z-index: 10000
}

#main {
  color: rgba(166, 238, 244, 0.7);
  background: transparent;
  border: 1px solid rgb(166, 238, 244);
  box-shadow: 0 0 2px rgba(166, 238, 244, 0.2), inset 0 0 5px rgb(166, 238, 244), 0 2px 0 #000;
  padding: 5px 20px;
  cursor: pointer;
  margin: 5px;
  font-size: 20px
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

#abstract {
  display:none;
  position: absolute;
  top: 0px;
  left: 0px;
  line-height: 26px;
  z-index: 3;
  font-family: "黑体";
  background-color: transparent;
  width: 126px;
  height: 37px;
  text-align: center;
  padding: 18px 20px 11px 20px;
  font-size: 16px;
  vertical-align: middle;
  background-size: 152px 56px;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  background-image: url(~@/views/dashboard/pic/tooltip.png)
}

#detail textarea {
  background-color: rgba(50, 50, 50, 0.8);
  color: white;
  height: 98%;
  width: 98%;
  margin: 0;
  padding: 5px 5px 5px 5px;
  opacity: 0.7;
  border: 0;
  resize: none;
  font-size: 23px
}

#detail {
  display: none;
  position: absolute;
  top: 18%;
  right: 5%;
  z-index: 4;
  background-color: transparent;
  width: 420px;
  height: 560px;
  background-image: url(~@/views/dashboard/pic/框.png);
  background-repeat: no-repeat;
  background-position: top;
  background-size: 100% 100%;
  padding: 18px
}

#picture {
  display: none;
  position: absolute;
  top: 321px;
  color: white;
  left: 121px;
  z-index: 4;
  background-color: transparent;
  width: 244px;
  height: 227px;
  background-image: url(~@/views/dashboard/pic/图片框.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  padding: 23px 21px 20px 17px;
  overflow: hidden
}

#picture img {
  width: 224px;
  height: 217px;
  opacity: 0.7;
  padding: 3px 10px 13px 9px
}
</style>
