import echarts, {encodeHTML} from "@/assets/js/echartsForce"
import "../../assets/js/typetype.js"
import "../../assets/js/OrbitControls.js"
import TWEEN from "../../assets/js/tween.min.js"
import Stats from "../../assets/js/stats.min.js"
import {render} from "@/views/dashboard/init";

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


  // console.log(myChart.getEnode(), myChart.getEeage(),'myChart.getEnode(), myChart.getEeage()')
  callback(myChart.getEnode(), myChart.getEeage());
}


var container, camera, controls, scene, renderer, raycaster, nodeObjects = [], networkGroup = new THREE.Group,
  nodePos = [], jsonData, isShowDetail = !1, mouse = new THREE.Vector2, INTERSECTED,
  offset = new THREE.Vector3(10, 10, 10);

export function netTopology(obj) {
  netTopology.container = obj.container;
  netTopology.camera = obj.camera;
  netTopology.controls = obj.controls;
  netTopology.scene = obj.scene;
  netTopology.renderer = obj.renderer;
  netTopology.raycaster = obj.renderer;
  netTopology.nodeObjects = nodeObjects;
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


}

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
  //三维底面网格线
  for (var a = new THREE.Group,
         d, b = 0; 3 > b; b++) {
    d = 300 - 300 * b;
    var c = new THREE.GridHelper(1050, 50);
    c.position.y = d;
    c.material.opacity = .75;
    c.material.transparent = !0;
    0 == b && (c.material.color = new THREE.Color("rgb(132, 112, 255)"));
    1 == b && (c.material.color = new THREE.Color("rgb(255, 255, 0)"));
    2 == b && (c.material.color = new THREE.Color("rgb(0, 255, 255)"));
    // console.log(c,'c')
    a.add(c)
  }
  a.name = "planeGroup";
  d = new THREE.Group;
  d.name = "nodeGroup";
  var that = netTopology;

  for (var e, c = node_link_Sort(netTopology.jsonData.nodes), g = node_link_Sort(netTopology.jsonData.links), g = netTopology.prototype.getForceLayout(c, g), b = 0; 3 > b; b++) {

    var l = new THREE.Group;
    l.name = "\u7b2c" + (b + 1) + "\u5c42";
    e = 320 - 300 * b;
    $.each(g, function (a, c) {
      if (c.layer < b + 2) {
        //
        if (c.layer == b + 1) {
          a = (new THREE.TextureLoader).load('http://192.168.8.94:8000/pic/' + c.path);

          var d = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshPhongMaterial({
            transparent: !0,
            opacity: 1,
            emissive: "black"
          }));
          d.position.set(c.position.x, e, c.position.y);
          d.value = c.value;
          d.name = c.name;
          d.userData.abstract = c.abstract;
          d.userData.pic = c.pic;
          a.magFilter = THREE.LinearFilter;
          a.anisotropy = 2;
          d.material.map = a;
          that.nodePos.push({position: d.position, id: c.id});
          that.nodeObjects.push(d);
          l.add(d)
        }
        return !0
      }
      return !1
    });
    d.add(l)
  }
  var g = new THREE.Group, n = new THREE.Group, p = new THREE.Group, q = new THREE.Group;
  new THREE.Group;
  new THREE.Group;
  for (var h = 0, b = 0; b < that.jsonData.links.length; b++) {
    var h = 0, t = that.jsonData.links[b].source, u = that.jsonData.links[b].target, f = new THREE.Vector3,
      k = new THREE.Vector3, m = new THREE.Vector3, r = that.jsonData.links[b].layer;
    $.each(c, function (a, b) {
      b.id == t ? (k = that.nodePos[a].position, h += 1) : b.id == u && (m = that.nodePos[a].position, h += 1);
      if (2 == h) return !1
    });
    f.subVectors(m, k);
    f.normalize();
    var v = k.distanceTo(m) - 25, f = new THREE.ArrowHelper(f, k, v, 3149642496, 20, 7);
    f.name = r;
    switch (r) {
      case 1:
        g.add(f);
        break;
      case 2:
        n.add(f);
        break;
      case 3:
        p.add(f);
        break;
      case 4:
        q.add(f)
    }
  }
  for (b = 0; 3 > b; b++) {
    c = new THREE.Group;
    c.add(d.children[0]);
    c.add(a.children[0]);
    switch (b) {
      case 0:
        c.add(g);
        break;
      case 1:
        c.add(n);
        break;
      case 2:
        c.add(p)
    }
    netTopology.networkGroup.add(c)
  }

  netTopology.networkGroup.add(q);
  netTopology.scene.add(netTopology.networkGroup);
  netTopology.renderer = new THREE.WebGLRenderer({antialias: !0});
  netTopology.renderer.setPixelRatio(window.devicePixelRatio);
  netTopology.renderer.setSize(window.innerWidth,
    window.innerHeight);
  netTopology.renderer.domElement.style.height = "100%";
  netTopology.renderer.domElement.style.width = "100%";
  netTopology.container.appendChild(netTopology.renderer.domElement);
  netTopology.raycaster = new THREE.Raycaster;
  netTopology.myStats = new Stats;
  // console.log(netTopology.container.addEventListener("mousemove"))
  document.addEventListener("mousemove", netTopology.prototype.onDocumentMouseMove, !1);
  document.addEventListener("click", netTopology.prototype.onMouseClick, !1);
  window.addEventListener("resize", netTopology.prototype.onWindowResize, !1)
  if (document.addEventListener) { //火狐使用DOMMouseScroll绑定
    document.addEventListener('DOMMouseScroll', netTopology.prototype.scrollFunc, false);
  }
  //其他浏览器
  window.addEventListener("wheel", netTopology.prototype.scrollFunc, {passive: false})
  // window.onmousewheel=netTopology.container.onmousewheel= netTopology.prototype.scrollFunc;


}

function zoom(event) {
  event.preventDefault();
  console.log('1111')
}

// 阻止 touchmove 事件的默认行为

netTopology.prototype.render = function () {
  // console.log(netTopology.controls,'netTopology.controls.')
  netTopology.controls.update();
  // let m=a.clientX-netTopology.container.getBoundingClientRect().left;
  // let n=a.clientY-netTopology.container.getBoundingClientRect().top
  // netTopology.mouse.x=m;
  // netTopology.mouse.y=n;
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

  netTopology.raycaster.setFromCamera(a, d);

  a = netTopology.raycaster.intersectObjects(netTopology.nodeObjects);

  0 < a.length ? netTopology.INTERSECTED != a[0].object && (netTopology.INTERSECTED && netTopology.INTERSECTED.material.emissive.setHex(netTopology.INTERSECTED.currentHex),
    netTopology.INTERSECTED = a[0].object, netTopology.INTERSECTED.currentHex = netTopology.INTERSECTED.material.emissive.getHex(), netTopology.INTERSECTED.scale.setScalar(1.2),
    netTopology.INTERSECTED.material.emissive.setHex(5592405), console.log(netTopology.INTERSECTED.name)) : (netTopology.INTERSECTED &&
  (netTopology.INTERSECTED.material.emissive.setHex(netTopology.INTERSECTED.currentHex), netTopology.INTERSECTED.scale.setScalar(1)),
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
  d = netTopology.networkGroup.children[3];
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

netTopology.prototype.showDetail = function (a) {
  a ? netTopology.INTERSECTED.name != netTopology.pointed && (netTopology.showString = netTopology.INTERSECTED.userData.abstract, $("#detail").slideDown(1E3), $("#detail").html('<div style="background-color: rgba(50,50,50,0.8);color: white;padding: 5px 5px 5px 5px;opacity: 0.7;border: 0;resize: none;font-size: 23px;text-align: center;padding-top: 58%;padding-bottom: 70%;">\u52a0\u8f7d\u4e2d...</div>'), setTimeout("netTopology.prototype.showText(netTopology.showString)", 500)) : $("#detail").slideUp(900)
}

netTopology.prototype.showText = function (a) {
  console.log(a, 'aaaaaaaaaaaaaaaaa')
  $("#detail").html("<textarea></textarea>");
  $("#detail textarea").typetype(a, {t: 10, e: 0})
}

netTopology.prototype.getForceLayout = function (a, d) {

  var b = [], c = [];
  $.each(a, function (a, c) {
    b.push({name: c.id, value: c.name, path: c.path, layer: c.layer, abstract: c.abstract, pic: c.pic})
  });
  c = d;
  for (var i = 1; 4 > i; i++) {
    var e = {nodes: [], links: []};
    $.each(b, function (a, b) {
      b.layer == i && e.nodes.push(b)
    });
    $.each(c, function (a, b) {
      b.layer == i && e.links.push(b)
    });

    FORCE.getForceLayout(e, function (a, b) {
      $.each(e.nodes, function (b, c) {
        b = a[b].p;
        console.log(a, 'bbb')
        c.position = {x: b[0] - 500, y: 500 - b[1]}
        console.log(c.position, c, 'c.position')
      });

    })
  }
  return b
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
  console.log(netTopology.camera.fov, ' netTopology.camera.fov')
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


netTopology.prototype.scrollFuncFox = function () {
  console.log('gungun111')
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


netTopology.prototype.onMouseClick = function (a) {

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

netTopology.prototype.networkAnimation = function () {

  netTopology.isShowDetail = !0;
  netTopology.prototype.showDetail(!1);
  netTopology.prototype.showPic(!1);
  if ("first" != netTopology.which_layer) {
    netTopology.which_layer = "first";
    TWEEN.removeAll();
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

