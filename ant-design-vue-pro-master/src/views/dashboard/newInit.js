import echarts, {encodeHTML} from "@/assets/js/echartsForce"
import "../../assets/js/typetype.js"
import "../../assets/js/OrbitControls.js"
import TWEEN from "../../assets/js/tween.min.js"
import Stats from "../../assets/js/stats.min.js"
import {MeshLine, MeshLineMaterial, MeshLineRaycast} from 'three.meshline'
import {render} from "@/views/dashboard/init";
import {OBJLoader} from "three/addons";

var myChart


// // added by zy
var FORCE = {};
FORCE.force_layout_nodes = {};
FORCE.force_layout_edges = {};
FORCE.forceLayout = function (nodes, edges) {
  FORCE.force_layout_nodes = nodes;
  FORCE.force_layout_edges = edges;
}
FORCE.getForceLayout = function (layoutData, callback) {
  // console.log(layoutData,'layoutData')
  var div = document.createElement("div");
  div.style.width = 1000 + "px";
  div.style.height = 1000 + "px";
  // div.style.margin = "auto";
  // div.style.marginTop = "10%";
  div.style.display = "block";
  div.setAttribute("id", "tuopu");
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(div)
  myChart = echarts.init(document.getElementById('tuopu'));
  let option = {
    series: [{
      name: "tuopu",                  //系列列表
      type: 'graph',
      layout: 'force',                  //力引导布局，依据circular
      force: {
        gravity: 0.01,                  //往中心靠拢的程度
        edgeLength: 200,              //节点距离
        repulsion: 250,                //节点间斥力因子
        layoutAnimation: false
      },
      data: layoutData.nodes,
      links: layoutData.links              //连线
    }]

  };
  myChart.setOption(option);
  body.removeChild(div);
  // console.log(myChart.getZr(),'myChart.getZr().')
  myChart.getZr().on('click', function (params) {
    // console.log(params,'params')
  })
  console.log(myChart.getEnode(), myChart.getEeage(),'myChart.getEnode(), myChart.getEeage()')
  callback(myChart.getEnode(), myChart.getEeage());
}


export function netTopology(obj) {
  netTopology.container = obj.container;
  netTopology.camera = obj.camera;
  netTopology.controls = obj.controls;
  netTopology.scene = obj.scene;
  netTopology.renderer = obj.renderer;
  netTopology.raycaster = obj.renderer;
  netTopology.nodeObjects = [];
  netTopology.lineObjects = [];
  netTopology.networkGroup = new THREE.Group;
  netTopology.nodePos = obj.nodePos;
  netTopology.jsonData = obj.jsonData;
  netTopology.isShowDetail = obj.isShowDetail;
  netTopology.mouse = new THREE.Vector2;
  netTopology.INTERSECTED = obj.INTERSECTED;
  netTopology.offset = new THREE.Vector3(10, 10, 10);
  netTopology.which_layer = "home";
  netTopology.pointed = null;
  netTopology.showString = null;
  netTopology.picPath = null;
  netTopology.myStats = null;
  netTopology.timer = null;
  netTopology.near = 1;
  netTopology.far = 4E3;
  netTopology.fov = 70;
  netTopology.nodeGroup = new THREE.Group;
  netTopology.gridHelper = new THREE.Group;
  netTopology.topoMesh = new THREE.Group;
  netTopology.topoMeshNodeArr = [];
  netTopology.testLine=[];
  netTopology.testLineGroup=new THREE.Group;


}

//初始化函数
netTopology.prototype.init = function (data) {
  netTopology.jsonData = data;
  // console.log(netTopology.jsonData,netTopology.container)
  // console.log(jsonData,"jsonData")
  netTopology.container = document.getElementById("container");
  // console.log(netTopology.container.clientWidth ,netTopology.container.getBoundingClientRect().left,'xy')
  netTopology.camera = new THREE.PerspectiveCamera(netTopology.fov, window.innerWidth / window.innerHeight, netTopology.near, netTopology.far);

  netTopology.camera.position.set(1300, 300, 400);
  netTopology.controls = new THREE.OrbitControls(netTopology.camera);
  netTopology.controls.rotateSpeed = 1;
  netTopology.controls.zoomSpeed = 1.2;
  netTopology.controls.panSpeed = .8;
  netTopology.controls.enableZoom = !1;
  netTopology.controls.enablePan = !1;
  netTopology.controls.autoRotate = !0;
  netTopology.controls.autoRotateSpeed = .5;
  netTopology.scene = new THREE.Scene;
  netTopology.scene.background = new THREE.Color(0);
  netTopology.scene.add(new THREE.AmbientLight(16777215));
  //初始化平面
  netTopology.prototype.initGroud();
  //初始化点线
  netTopology.prototype.initLine();
  // netTopology.prototype.initMeshLine();
  //添加点图层
  // netTopology.prototype.addPointLayer();
  //添加模型
  // netTopology.prototype.createObj()
  netTopology.renderer = new THREE.WebGLRenderer({antialias: !0});
  netTopology.renderer.setPixelRatio(window.devicePixelRatio);
  netTopology.renderer.setSize(window.innerWidth,
    window.innerHeight);
  netTopology.renderer.domElement.style.height = "100%";
  netTopology.renderer.domElement.style.width = "100%";
  netTopology.container.appendChild(netTopology.renderer.domElement);
  //创建一个射线投射器`Raycaster`
  netTopology.raycaster = new THREE.Raycaster;
  netTopology.myStats = new Stats;
  // console.log(netTopology.container.addEventListener("mousemove"))
  document.addEventListener("mousemove", netTopology.prototype.onDocumentMouseMove, !1);
  // document.addEventListener("click", netTopology.prototype.onMouseClick, !1);
  window.addEventListener("resize", netTopology.prototype.onWindowResize, !1)
  if (document.addEventListener) { //火狐使用DOMMouseScroll绑定
    document.addEventListener('DOMMouseScroll', netTopology.prototype.scrollFunc, false);
  }
  //其他浏览器
  window.addEventListener("wheel", netTopology.prototype.scrollFunc, {passive: false})
  // window.onmousewheel=netTopology.container.onmousewheel= netTopology.prototype.scrollFunc;


}

function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

  // compute a unit vector that points in the direction the camera is now
  // from the center of the box
  const direction = (new THREE.Vector3()).subVectors(camera.position, boxCenter).normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

netTopology.prototype.createObj=function (){

  const skyColor = 0xb1e1ff // 蓝色
  const groundColor = 0xffffff // 白色
  const intensity = 1
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
  netTopology.scene.add(light)

  // 方向光
  const color = 0xffffff
  const intensity2 = 1
  const light2 = new THREE.DirectionalLight(color, intensity2)
  light2.position.set(0, 10, 0)
  light2.target.position.set(-5, 0, 0)
  netTopology.scene.add(light2)
  netTopology.scene.add(light2.target)

    const objLoader = new OBJLoader()
    objLoader.load('http://192.168.8.94:8000/obj/Koltuk.obj', (root) => {
      console.log(root,'root')
      netTopology.scene.add(root)
      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());
      // frameArea(boxSize * 100, boxSize, boxCenter, netTopology.camera);
      // const scene=root.scene;
      const x = (box.max.x - box.min.x)
      const y = (box.max.y - box.min.y)
      const z = (box.max.z - box.min.z)
      // const maxDim = Math.max(x, y, z)
      // const scale = 250 / maxDim
      // box.scale.set(scale, scale, scale)
      // const mesh = root.scene.children[0];
      // const att = mesh.geometry.attributes;
      console.log('att', root.scene);
      root.scale.set(100,100,100)
      console.log('boxSize',root.scale());
      console.log(boxCenter,'boxCenter');
    })



}
netTopology.prototype.initGroud = function () {
  /*三维底面网格线 gridHelper:三维底面,GridHelper:网格线
通过 Three.js 类 GridHelper 可以创建一个坐标网格对象
GridHelper 本质上是对线模型对象 Line 的封装，纵横交错的直线构成一个矩形网格模型对象。
GridHelper( size : number, divisions : Number, colorCenterLine : Color, colorGrid : Color )
size -- 网格宽度，默认为 10.
divisions -- 等分数，默认为 10.
colorCenterLine -- 中心线颜色，默认 0x444444
colorGrid --  网格线颜色，默认为 0x888888
*/
  for (var i = 0; 3 > i; i++) {
    let height = 300 - 300 * i;
    var gridHelper = new THREE.GridHelper(1050, 50);
    gridHelper.position.y = height;
    gridHelper.material.opacity = .75;
    gridHelper.material.transparent = !0;
    0 == i && (gridHelper.material.color = new THREE.Color("rgb(132, 112, 255)"));
    1 == i && (gridHelper.material.color = new THREE.Color("rgb(255, 255, 0)"));
    2 == i && (gridHelper.material.color = new THREE.Color("rgb(0, 255, 255)"));
    netTopology.gridHelper.add(gridHelper);

  }
  // console.log(netTopology.gridHelper,'netTopology.gridHelper')
  netTopology.gridHelper.name = 'gridHelper';
  netTopology.nodeGroup.name = "netTopology.nodeGroup";
  // for (var i = 0; 3 > i; i++) {
  //   netTopology.topoMesh.add(netTopology.gridHelper.children[0]);
  // }
}

 netTopology.prototype.initPoint =async function () {

  var topoMeshY,
    nodeLinkArr = node_link_Sort(netTopology.jsonData.links);
  var topoPointArr = netTopology.prototype.getForceLayout(netTopology.topoMeshNodeArr, nodeLinkArr);
  // netTopology.topoMeshNodeArr = node_link_Sort(netTopology.jsonData.nodes);
  for (var i = 0; 3 > i; i++) {
    /*通过 THREE.Group 类创建一个组对象 group,然后通过 add 方法把网格模型 mesh1、mesh2 作为设置为组对象 group 的子对象，
    然后在通过执行 scene.add(group)把组对象 group 作为场景对象的 scene 的子对象。
    也就是说场景对象是 scene 是 group 的父对象，group 是 mesh1、mesh2 的父对象。
    * */
    var layGroup = new THREE.Group;
    layGroup.name = "\u7b2c" + (i + 1) + "\u5c42";
    topoMeshY = 320 - 300 * i;
    $.each(topoPointArr, function (index, value) {
      if (value.layer < i + 2) {
        if (value.layer == i + 1) {
          let texTureItem;
          texTureItem = (new THREE.TextureLoader).load('http://192.168.8.94:8000/pic/' + value.path);
          var topoMesh = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshPhongMaterial({
            transparent: !0,
            opacity: 1,
            emissive: "black"
          }));
          topoMesh.position.set(value.position.x, topoMeshY, value.position.y);
          topoMesh.value = value.value;
          topoMesh.name = value.name;
          topoMesh.userData.abstract = value.abstract;
          topoMesh.userData.pic = value.pic;
          texTureItem.magFilter = THREE.LinearFilter;
          texTureItem.anisotropy = 2;
          topoMesh.material.map = texTureItem;

          netTopology.nodePos.push({position: topoMesh.position, id: value.id});
          // console.log(netTopology.nodePos, 'netTopology.nodePos', topoMesh.position)
          netTopology.nodeObjects.push(topoMesh);
          layGroup.add(topoMesh)
        }
        return !0
      }
      return !1
    });
    netTopology.nodeGroup.add(layGroup)
    // console.log(netTopology.nodeGroup.children[i],'netTopology.nodeGroup')
    // netTopology.topoMesh.add(netTopology.gridHelper.children[0]);
    //
    // netTopology.topoMesh.add(netTopology.nodeGroup.children[0]);
  }

}

netTopology.prototype.addPointLayer = function () {
  for (var i = 0; 3 > i; i++) {
    // netTopology.topoMesh.add(netTopology.nodeGroup.children[0]);
  }
}

netTopology.prototype.initLine =async function () {
  /*
  threejs三维坐标系，向上为Y正轴，向右为X正轴，向屏幕从里到外方向为Z正轴。
  https://juejin.cn/post/7056946979623927839
  **/
  netTopology.topoMeshNodeArr = node_link_Sort(netTopology.jsonData.nodes);
  //初始化点
  await netTopology.prototype.initPoint();
  //定义四层箭头
  var firstArrowLayer = new THREE.Group,
    secondArrowLayer = new THREE.Group,
    thirdArrowLayer = new THREE.Group,
    forthArrowLayer = new THREE.Group;
  // var h = 0;
  for (let i = 0; i < netTopology.jsonData.links.length; i++) {
    var h = 0,
      linkSourceItem = netTopology.jsonData.links[i].source,
      linkTargetItem = netTopology.jsonData.links[i].target,
      fthirdVector = new THREE.Vector3,
      soureVector = new THREE.Vector3,
      targetVector = new THREE.Vector3,
      layer = netTopology.jsonData.links[i].layer;
    // console.log(that.jsonData.links[i],layer,'tur')
    $.each(netTopology.topoMeshNodeArr, function (index, value) {
      //k:nodeid与linksource相等的点的向量,源向量
      //m:nodeid与linkTarget相等的点的向量，末端向量
      value.id == linkSourceItem ? (soureVector = netTopology.nodePos[index].position, h += 1) :
        value.id == linkTargetItem && (targetVector = netTopology.nodePos[index].position, h += 1);
      if (2 == h) return !1
    });
    /*
     subVectors( a: Vector3, b: Vector3 ): this
     将该向量设置为a - b。
     获取方向向量
      var vec1 = new THREE.Vector3(1,2,3);
      var vec2 = new THREE.Vector3(2,3,4);
      new THREE.Vector3().subVectors(vec2, vec1);//返回Vector3 {x: 1, y: 1, z: 1}
      normalize(): this
      将该向量转换为单位向量（unit vector）， 也就是说，将该向量的方向设置为和原向量相同，但是其长度（length）为1。就是将向量归一化。
    * */
    fthirdVector.subVectors(targetVector, soureVector);
    fthirdVector.normalize();
    /*
    ArrowHelper(dir : Vector3, origin : Vector3, length : Number, hex : Number, headLength : Number, headWidth : Number )
    生成一个箭头
    dir -- 基于箭头原点的方向. 必须为单位向量.
    origin -- 箭头的原点.
    length -- 箭头的长度. 默认为 1.
    hex -- 定义的16进制颜色值. 默认为 0xffff00.
    headLength -- 箭头头部(锥体)的长度. 默认为箭头长度的0.2倍(0.2 * length).
    headWidth -- The width of the head of the arrow. Default is 0.2 * headLength.
    * */
    var distance = soureVector.distanceTo(targetVector) - 25,
      arrow = new THREE.ArrowHelper(fthirdVector, soureVector, distance, '#FFD700', 20, 7);
    arrow.layer = layer;
    if (arrow.layer == 4) {
      arrow.setColor('#ffffff');
      arrow.setLength(distance, 0, 0)
    }
    netTopology.lineObjects.push(arrow);
    // console.log(arrow.name, 'arrow.name')
    switch (arrow.layer) {
      case 1:
        firstArrowLayer.add(arrow);
        break;
      case 2:
        secondArrowLayer.add(arrow);
        break;
      case 3:
        thirdArrowLayer.add(arrow);
        break;
      case 4:
        forthArrowLayer.add(arrow)
    }
  }

  for (let j = 0; j<3; j++) {
    netTopology.topoMesh=new THREE.Group
    netTopology.topoMesh.add(netTopology.nodeGroup.children[0]);
    netTopology.topoMesh.add(netTopology.gridHelper.children[0]);
    // console.log(netTopology.nodeGroup,netTopology.nodeGroup.children[0],'netTopology.nodeGroup')

    switch (j) {
      case 0:
        //添加箭头layer
        netTopology.topoMesh.add(firstArrowLayer);
        break;
      case 1:
        //添加箭头layer
        netTopology.topoMesh.add(secondArrowLayer);
        break;
      case 2:
        //添加箭头layer
        netTopology.topoMesh.add(thirdArrowLayer)
    }
    // console.log(netTopology.topoMesh,'netTopology.topoMesh')
    netTopology.networkGroup.add(netTopology.topoMesh)
  }

  //添加箭头layer

  netTopology.networkGroup.add(forthArrowLayer);
  // console.log(netTopology.networkGroup.children,netTopology.gridHelper,netTopology.nodeGroup,'netTopology.nodeGroup')
  netTopology.scene.add(netTopology.networkGroup);
  // console.log(netTopology.networkGroup,'netTopology.networkGroup')
}

netTopology.prototype.initMeshLine=function () {
  netTopology.topoMeshNodeArr = node_link_Sort(netTopology.jsonData.nodes);
  //初始化点
  netTopology.prototype.initPoint();

  // 生成一段贝赛尔曲线
  const curve = new THREE.LineCurve3(
    new THREE.Vector3(-500, 0, 0),
    new THREE.Vector3(500, 0, 0)
  )
// 获取这段线上51个坐标点
  const points = curve.getPoints(51)
// 将坐标数据存入positions中
  const positions = []
  for (let j = 0; j < points.length; j++) {
    positions.push(points[j].x, points[j].y, points[j].z)
  }
  // console.log(points,'point')
// 初始化MeshLine
  const line = new MeshLine();
// 传入顶点坐标数据
  line.setPoints(positions)
// 获取纹理，官方案例中的纹理
  this.texture = new THREE.TextureLoader().load('http://192.168.8.94:8000/pic/stroke.png')
  this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping
// 生成线材质
  this.material = new MeshLineMaterial({
    useMap: 0,
    color: new THREE.Color('#D8BFD8'),
    opacity: 1,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    sizeAttenuation: 1,
    lineWidth: 100,
    transparent: true,
    // wireframe: true,
    map: this.texture
  })
// 生成模型
//   netTopology.testLine.add(new THREE.Mesh(line.geometry, this.material));
  const mesh=new THREE.Mesh(line.geometry, this.material);
  mesh.value='testline'
  mesh.raycaster=MeshLineRaycast;
  netTopology.testLineGroup.add(mesh)
  netTopology.nodeObjects.push(mesh);
  // netTopology.testLine.push(mesh)
  // console.log(netTopology.nodeObjects,'nodeObjects')
  netTopology.scene.add(netTopology.testLineGroup)


}

// netTopology.prototype.lineAnimate=function () {
//   requestAnimationFrame(netTopology.prototype.lineAnimate)
//   if (this.material) {
//     this.material.uniforms.dashOffset.value -= 0.005
//   }
// }


function zoom(event) {
  event.preventDefault();
  console.log('1111')
}

// 阻止 touchmove 事件的默认行为

netTopology.prototype.render = function () {
  netTopology.controls.update();
  netTopology.prototype.rayMousemove(netTopology.mouse, netTopology.camera);
  // console.log(netTopology.mouse.x,netTopology.mouse.y,'netTopology.mouse')
  netTopology.prototype.changeObjFace(netTopology.nodeObjects);
  netTopology.renderer.render(netTopology.scene, netTopology.camera)
}

netTopology.prototype.animate = function () {
  // console.log('aaaaa')
  netTopology.timer = window.requestAnimationFrame(netTopology.prototype.animate);
  netTopology.prototype.render();
  netTopology.myStats.update();
  TWEEN.update()
}

netTopology.prototype.rayMousemove = function (a, d) {
  //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
// 形象点说就是在点击位置创建一条射线，用来选中拾取模型对象
  netTopology.raycaster.setFromCamera(a, d);
  // 通过.intersectObjects()方法可以计算出来与射线相交的网格模型
  a = netTopology.raycaster.intersectObjects(netTopology.nodeObjects);
  // console.log(a,'aaaa')
  // let b = netTopology.raycaster.intersectObjects(netTopology.testLine);
  // console.log(b,'bbbbbbbbbb')

  // console.log(a,a.length,'intersectObjects')
  0 < a.length ? netTopology.INTERSECTED != a[0].object
    && (netTopology.INTERSECTED
    && netTopology.INTERSECTED.material.emissive.setHex(netTopology.INTERSECTED.currentHex),
      netTopology.INTERSECTED = a[0].object,
      netTopology.INTERSECTED.currentHex = netTopology.INTERSECTED.material.emissive.getHex(),
      netTopology.INTERSECTED.scale.setScalar(1.2),
      netTopology.INTERSECTED.material.emissive.setHex(5592405),
      console.log(netTopology.INTERSECTED, a, '??????'))
    : (netTopology.INTERSECTED &&
    (netTopology.INTERSECTED.material.emissive.setHex(netTopology.INTERSECTED.currentHex),
      netTopology.INTERSECTED.scale.setScalar(1)),
      netTopology.INTERSECTED = null)

}

netTopology.prototype.changeObjFace = function (a) {
  var that = netTopology;
  $.each(a, function (a, b) {
    b.lookAt(that.camera.position)
  })
}

netTopology.prototype.homeAnimation = function () {

  function a() {
    $.each(d.children, function (a, c) {
      console.log('d = netTopology.networkGroup.children[3]')
      a = c.line.material;
      c = c.cone.material;
      a.transparent = !0;
      c.transparent = !0;
      d.visible = !0;
      a.opacity = .2;
      c.opacity = .2;
      (new TWEEN.Tween(a)).delay(0).to({opacity: 1}, 5E3).easing(TWEEN.Easing.Exponential.Out).start();
      (new TWEEN.Tween(c)).delay(0).to({opacity: 1}, 5E3).easing(TWEEN.Easing.Exponential.Out).start()
    })
  }

  netTopology.which_layer = "home";
  netTopology.isShowDetail = !1;
  netTopology.prototype.showDetail(!1);
  netTopology.prototype.showPic(!1);
  TWEEN.removeAll();
  $.each(netTopology.networkGroup.children, function (a, c) {
    (new TWEEN.Tween(c.scale)).to({
      x: 1,
      y: 1, z: 1
    }, 800).start()
  });
  var d;
  // console.log(netTopology.networkGroup.children,'netTopology.networkGroup.children')
  d = netTopology.networkGroup.children[3];
  // console.log(d, netTopology.networkGroup, 'dddd');
  (new TWEEN.Tween(netTopology.networkGroup.children[0].position)).delay(0).to({
    y: 0,
    x: 0,
    z: 0
  }, 700).easing(TWEEN.Easing.Exponential.In).start();
  (new TWEEN.Tween(netTopology.networkGroup.children[0].rotation)).delay(0).to({y: 0}, 2500).easing(TWEEN.Easing.Quintic.Out).start().onComplete(function () {
  });
  (new TWEEN.Tween(netTopology.networkGroup.children[1].position)).delay(0).to({
    y: 0,
    x: 0,
    z: 0
  }, 700).easing(TWEEN.Easing.Exponential.In).start();
  (new TWEEN.Tween(netTopology.networkGroup.children[1].rotation)).delay(0).to({y: 0},
    2500).easing(TWEEN.Easing.Quintic.Out).start().onComplete(function () {
  });
  (new TWEEN.Tween(netTopology.networkGroup.children[2].position)).delay(0).to({
    y: 0,
    x: 0,
    z: 0
  }, 700).easing(TWEEN.Easing.Exponential.In).start();
  (new TWEEN.Tween(netTopology.networkGroup.children[2].rotation)).delay(0).to({y: 0}, 2500).easing(TWEEN.Easing.Quintic.Out).start().onComplete(function () {
    a();
    // IsHome = !0
  })
}

netTopology.prototype.networkAnimation = function () {

  netTopology.isShowDetail = !0;
  netTopology.prototype.showDetail(!1);
  netTopology.prototype.showPic(!1);
  if ("first" != netTopology.which_layer) {
    netTopology.which_layer = "first";
    TWEEN.removeAll();
    // console.log( netTopology.networkGroup.children,' netTopology.networkGroup.children[3]')
    netTopology.networkGroup.children[3].visible = !1;
    var a = (new TWEEN.Tween(netTopology.networkGroup.children[0].position)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: -500,
        z: 0
      }, 1E3),
      d = (new TWEEN.Tween(netTopology.networkGroup.children[0].scale)).delay(0).easing(TWEEN.Easing.Exponential.Out).to({
        x: 1.7,
        y: 1.7,
        z: 1.7
      }, 5E3),
      b = (new TWEEN.Tween(netTopology.networkGroup.children[0].rotation)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 0, z: 0
      }, 1E3);
    $.each(netTopology.networkGroup.children, function (c, e) {
      (new TWEEN.Tween(e.scale)).to({
        x: .3,
        y: .3,
        z: .3
      }, 800).easing(TWEEN.Easing.Quintic.InOut).start().onComplete(function () {
        a.start();
        d.start();
        b.start()
      })
    });
    (new TWEEN.Tween(netTopology.networkGroup.children[1].position)).delay(100).to({
      y: 0,
      x: 1300,
      z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(netTopology.networkGroup.children[1].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start();
    (new TWEEN.Tween(netTopology.networkGroup.children[2].position)).delay(100).to({
      y: 0,
      x: -1300, z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(netTopology.networkGroup.children[2].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start()
  }
}

netTopology.prototype.serviceAnimation = function () {

  netTopology.isShowDetail = !0;
  netTopology.prototype.showDetail(!1);
  netTopology.prototype.showPic(!1);
  if ("second" != netTopology.which_layer) {
    netTopology.which_layer = "second";
    TWEEN.removeAll();
    netTopology.networkGroup.children[3].visible = !1;
    var a = (new TWEEN.Tween(netTopology.networkGroup.children[1].scale)).easing(TWEEN.Easing.Exponential.Out).delay(0).to({
        x: 1.7,
        y: 1.7,
        z: 1.7
      }, 5E3),
      d = (new TWEEN.Tween(netTopology.networkGroup.children[1].position)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 0,
        z: 0
      }, 1E3),
      b = (new TWEEN.Tween(netTopology.networkGroup.children[1].rotation)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 0, z: 0
      }, 1E3);
    $.each(netTopology.networkGroup.children, function (c, e) {
      (new TWEEN.Tween(e.scale)).to({
        x: .3,
        y: .3,
        z: .3
      }, 800).easing(TWEEN.Easing.Quintic.InOut).start().onComplete(function () {
        a.start();
        d.start();
        b.start()
      })
    });
    (new TWEEN.Tween(netTopology.networkGroup.children[0].position)).delay(100).to({
      y: 0,
      x: 1300,
      z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(netTopology.networkGroup.children[0].rotation)).delay(100).to({
      x: 0,
      y: 10,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start();
    (new TWEEN.Tween(netTopology.networkGroup.children[2].position)).delay(100).to({
      y: 0,
      x: -1300, z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(netTopology.networkGroup.children[2].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start()
  }
}

netTopology.prototype.virtualUser = function () {

  netTopology.isShowDetail = !0;
  netTopology.prototype.showDetail(!1);
  netTopology.prototype.showPic(!1);
  if ("third" != netTopology.which_layer) {
    netTopology.which_layer = "third";
    TWEEN.removeAll();
    netTopology.networkGroup.children[3].visible = !1;
    var a = (new TWEEN.Tween(netTopology.networkGroup.children[2].position)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 500,
        z: 0
      }, 1E3),
      d = (new TWEEN.Tween(netTopology.networkGroup.children[2].scale)).easing(TWEEN.Easing.Exponential.Out).delay(0).to({
        x: 1.7,
        y: 1.7,
        z: 1.7
      }, 5E3),
      b = (new TWEEN.Tween(netTopology.networkGroup.children[2].rotation)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 0, z: 0
      }, 1E3);
    $.each(netTopology.networkGroup.children, function (c, e) {
      (new TWEEN.Tween(e.scale)).to({
        x: .3,
        y: .3,
        z: .3
      }, 800).easing(TWEEN.Easing.Quintic.InOut).start().onComplete(function () {
        a.start();
        d.start();
        b.start()
      })
    });
    (new TWEEN.Tween(netTopology.networkGroup.children[0].position)).delay(100).to({
      y: 0,
      x: 1300,
      z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(netTopology.networkGroup.children[0].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start();
    (new TWEEN.Tween(netTopology.networkGroup.children[1].position)).delay(100).to({
      y: 0,
      x: -1300, z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(netTopology.networkGroup.children[1].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start()
  }
}

netTopology.prototype.rotate = function () {
  1 == netTopology.controls.autoRotate ? netTopology.controls.autoRotate = !1 : netTopology.controls.autoRotate = !0

}

netTopology.prototype.showDetail = function (a) {
  a ? netTopology.INTERSECTED.name != netTopology.pointed && (netTopology.showString = netTopology.INTERSECTED.userData.abstract, $("#detail").slideDown(1E3), $("#detail").html('<div style="background-color: rgba(50,50,50,0.8);color: white;padding: 5px 5px 5px 5px;opacity: 0.7;border: 0;resize: none;font-size: 23px;text-align: center;padding-top: 58%;padding-bottom: 70%;">\u52a0\u8f7d\u4e2d...</div>'), setTimeout("netTopology.prototype.showText(netTopology.showString)", 500)) : $("#detail").slideUp(900)
}

netTopology.prototype.showText = function (a) {
  $("#detail").html("<textarea></textarea>");
  $("#detail textarea").typetype(a, {t: 10, e: 0})
}

netTopology.prototype.getForceLayout = function (pointArr, lineArr) {
  // console.log(pointArr, 'pointArr')
  var arr = [], clineArr = [];
  $.each(pointArr, function (index, value) {
    arr.push({
      name: value.id,
      value: value.name,
      path: value.path,
      layer: value.layer,
      abstract: value.abstract,
      pic: value.pic,
      position:{x: value.x , y: value.y}
    });
    // console.log(arr, 'zheli Arr')
  });
  clineArr = lineArr;

  //使用echarts随机生成
  for (var i = 1; 4 > i; i++) {
    var e = {nodes: [], links: []};
    $.each(arr, function (index, value) {
      value.layer == i && e.nodes.push(value)
    });
    $.each(clineArr, function (index, value) {
      value.layer == i && e.links.push(value)
    });
    FORCE.getForceLayout(e, function (node, eage) {
      let nodeArr = node;
      $.each(e.nodes, function (index, value) {
        let positon = nodeArr[index].p;
        console.log(value,'value')
        value.position =(value.position.x&&value.position.y) ? value.position: {x: value.position.x||positon[0]-500 , y: value.position.y||500-positon[1]}
      });
    })

  }
  // console.log(e.nodes,arr,'eee')
  return arr
}

netTopology.prototype.onWindowResize = function () {

  netTopology.renderer.setSize(netTopology.container.getBoundingClientRect().width, netTopology.container.getBoundingClientRect().height)

}

netTopology.prototype.onDocumentMouseMove = function (a) {

  a.preventDefault();
  // mouse.x = ( (event.clientX - px)  / renderer.domElement.clientWidth) * 2 - 1;
  // mouse.y = - ( (event.clientY - py) / renderer.domElement.clientHeight) * 2 + 1;
  //屏幕坐标转换成世界坐标，偏移量
  var px = netTopology.container.getBoundingClientRect().left;
  var py = netTopology.container.getBoundingClientRect().top;
  netTopology.mouse.x = ((a.clientX - px) / netTopology.container.getBoundingClientRect().width) * 2 - 1;
  netTopology.mouse.y = 2 * -((a.clientY - py) / netTopology.container.getBoundingClientRect().height) + 1;
  netTopology.prototype.showAbstract(netTopology.mouse.x, netTopology.mouse.y, a)
}

netTopology.prototype.scrollFunc = function (e) {
  //禁止页面滚动，我也不知道为啥起作用了，不能删
  e = e || window.event;
  if (document.all) {
    e.cancelBubble = true;
  } else {
    e.stopPropagation();
  }

  //改变fov值，并更新场景的渲染
  if (e.wheelDelta) {
    if (e.wheelDelta > 0) { //当滑轮向上滚动时
      netTopology.fov -= (netTopology.near < netTopology.fov ? 4 : 0);
    }
    if (e.wheelDelta < 0) { //当滑轮向下滚动时
      netTopology.fov += (netTopology.fov < netTopology.far ? 4 : 0);
    }
  } else if (e.detail) {  //Firefox滑轮事件
    if (e.detail > 0) { //当滑轮向上滚动时
      netTopology.fov -= 4;
    }
    if (e.detail < 0) { //当滑轮向下滚动时
      netTopology.fov += 4;
    }
  }
  netTopology.camera.fov = netTopology.fov;
  // console.log(netTopology.camera.fov, ' netTopology.camera.fov')
  netTopology.camera.updateProjectionMatrix();


  // renderer.render(scene, camera);
}

function stopBubble(e) {

  // 如果提供了事件对象，则这是一个非IE浏览器

  if (e && e.stopPropagation) {

    // 因此它支持W3C的stopPropagation()方法

    e.stopPropagation();

  } else {

    // 否则，我们需要使用IE的方式来取消事件冒泡

    window.event.cancelBubble = true;

  }

}


netTopology.prototype.showAbstract = function (a, d, e) {
  let ev = e;
  var px = netTopology.container.getBoundingClientRect().left;
  var py = netTopology.container.getBoundingClientRect().top;
  // console.log(ev.clientX,ev.clientY)
  if (netTopology.INTERSECTED) {
    $("#abstract").css("display", "table");
    var b = document.getElementById("abstract");
    b.innerText = netTopology.INTERSECTED.value;
    // console.log(netTopology.INTERSECTED.value,'netTopology.INTERSECTED.value')
    b.style.top = ev.clientY - py + "px";
    b.style.left = ev.clientX - px + "px"
    // console.log( b.style.top, b.style.left)
  } else $("#abstract").css("display", "none")
}


netTopology.prototype.onMouseClick = function () {

  if(netTopology.INTERSECTED){

    return netTopology.INTERSECTED
  }else {
    return false;
  }
  netTopology.INTERSECTED && netTopology.isShowDetail && (netTopology.showDetail(!0), netTopology.prototype.showPic(!0))

}

function chartClick() {

}

netTopology.prototype.showPic = function (a) {

  a ? netTopology.INTERSECTED.name != netTopology.pointed && (netTopology.picPath = netTopology.INTERSECTED.userData.pic, $("#picture").fadeOut(400), setTimeout("netTopology.prototype.changePic(picPath)", 400), netTopology.pointed = netTopology.INTERSECTED.name) : $("#picture").fadeOut(900)
}

netTopology.prototype.changePic = function (a) {
  $("#picture img").attr("src", "http://192.168.8.94:8000/pic/" + a);
  // console.log( "http://192.168.8.94:8000/pic/" + a)
  $("#picture").fadeIn(400)
}


netTopology.prototype.destroy = function () {
  // netTopology.container=null;
  // netTopology.camera=null;
  // netTopology.controls=null;
  // netTopology.scene=null;
  // netTopology.renderer=null;
  // netTopology.raycaster=null;
  // netTopology.nodeObjects =null;
  // netTopology.networkGroup = null;
  // netTopology.nodePos=null;
  // netTopology.jsonData=null;
  // netTopology.isShowDetail=null;
  // netTopology.mouse = null;
  // netTopology.INTERSECTED=null;
  // netTopology.offset =null;
  // netTopology.which_layer="home";
  // netTopology.pointed=null;
  // netTopology.showString=null;
  // netTopology.picPath=null;
  // netTopology.myStats=null;
  document.removeEventListener("mousemove", netTopology.prototype.onDocumentMouseMove, !1);
  document.removeEventListener("click", netTopology.prototype.onMouseClick(), !1);
  window.removeEventListener("resize", netTopology.prototype.onWindowResize, !1);
  window.removeEventListener('wheel', netTopology.prototype.scrollFunc, !1)
  document.removeEventListener('DOMMouseScroll', netTopology.prototype.scrollFunc, !1);

  window.cancelAnimationFrame(netTopology.timer);
}


//将point通过layer的层数分离
function node_link_Sort(a) {
  var d = [];
  for (var i = 1; 4 > i; i++) $.each(a, function (a, c) {
    c.layer == i && d.push(c)
  });
  return d
}

function sleep(a) {
  var d = new Date;
  for (a = d.getTime() + a; !(d = new Date, d.getTime() > a);) ;
}

