### 2024.5.6
- 原项目github地址：https://github.com/crissBrown/Three-layer-topology-network.git
此项目用了three.js与echarts做的3D网络拓扑

- 将项目融合到vue+antd框架中，发现原作者的init.js毫无封装，无法运行起来。

### 2024.5.7
1.将init.js重写为newInit.js，将3D拓扑用netTopology对象表示：
netTopology参数：
- netTopology.container 
- netTopology.camera 
- netTopology.controls
- netTopology.scene
- netTopology.renderer 
- netTopology.raycaster 
- netTopology.nodeObjects 
- netTopology.networkGroup 
- netTopology.nodePos
- netTopology.jsonData
- netTopology.isShowDetail 
- netTopology.mouse 
- netTopology.INTERSECTED 
- netTopology.offset 
- netTopology.which_layer
- netTopology.pointed 
- netTopology.showString 
- netTopology.picPath 
- netTopology.myStats 
- netTopology.timer 
- netTopology.near 
- netTopology.far 
- netTopology.fov
- netTopology提供方法： 详见newInit.js注释

### 2024.5.8
- 由于在canvas中，屏幕坐标无法转成webgl世界坐标，使得渲染出的模型鼠标移动到图标的事件无法触发，无法展示详细信息。使用坐标转换，屏幕坐标转为webgl世界坐标
-   //屏幕坐标转换成世界坐标，偏移量
    var px = netTopology.container.getBoundingClientRect().left;
    var py = netTopology.container.getBoundingClientRect().top;
    netTopology.mouse.x = ((a.clientX - px) / netTopology.container.getBoundingClientRect().width) * 2 - 1;
    netTopology.mouse.y = 2 * -((a.clientY - py) / netTopology.container.getBoundingClientRect().height) + 1;
- 最终鼠标移入移出事件可以触发

### 2024.5.9
- 增加了scrollFunc（）方法，可以使得拓扑通过鼠标滚轮放大缩小
- 但是存在页面也会随着鼠标滚轮滚动的情况，添加禁止页面滚动的方法，要在newInit.js与Analysis.vue同时加上！
