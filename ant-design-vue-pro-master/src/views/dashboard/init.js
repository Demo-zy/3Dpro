import echarts from "@/assets/js/echartsForce"
import "../../assets/js/typetype.js"
import "../../assets/js/OrbitControls.js"
import TWEEN from "../../assets/js/tween.min.js"
import Stats from "../../assets/js/stats.min.js"


// // added by zy
var FORCE = {};
FORCE.force_layout_nodes = {};
FORCE.force_layout_edges = {};
FORCE.forceLayout = function(nodes, edges) {
  FORCE.force_layout_nodes = nodes;
  FORCE.force_layout_edges = edges;
}
FORCE.getForceLayout = function(layoutData, callback) {
  console.log(layoutData,'layoutData')
  var div = document.createElement("div");
  div.style.width = 1000 + "px";
  div.style.height = 1000 + "px";
  // div.style.margin = "auto";
  // div.style.marginTop = "10%";
  div.style.display = "none";
  div.setAttribute("id", "tuopu");
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(div)
  var myChart = echarts.init(document.getElementById('tuopu'));

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
    }],
  };
  myChart.setOption(option);
  body.removeChild(div);
  callback(myChart.getEnode(), myChart.getEeage());
}



var container, camera, controls, scene, renderer, raycaster, nodeObjects = [], networkGroup = new THREE.Group,
  nodePos = [], jsonData, isShowDetail = !1,mouse = new THREE.Vector2, INTERSECTED,
  offset = new THREE.Vector3(10, 10, 10);
var pointed, showString, picPath;
let myStats;
var which_layer = "home";
function applyVertexColors(a, d) {
  a.faces.forEach(function (a) {
    for (var b = a instanceof THREE.Face3 ? 3 : 4, e = 0; e < b; e++) a.vertexColors[e] = d
  })
}

function changeObjFace(a) {
  $.each(a, function (a, b) {
    b.lookAt(camera.position)
  })
}

function onMouseMove(a) {
  mouse.x = a.screenX;
  mouse.y = a.screenY
}

function pick() {
  renderer.render(pickingScene, camera, pickingTexture);
  var a = new Uint8Array(4);
  renderer.readRenderTargetPixels(pickingTexture, mouse.x, pickingTexture.height - mouse.y, 1, 1, a);
  (a = pickingData[a[0] << 16 | a[1] << 8 | a[2]]) ? a.position && a.rotation && a.scale && (highlightBox.position.copy(a.position), highlightBox.rotation.copy(a.rotation), highlightBox.scale.copy(a.scale).add(offset), highlightBox.visible = !0) : highlightBox.visible = !1
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onDocumentMouseMove(a) {
  a.preventDefault();
  mouse.x = a.clientX / window.innerWidth * 2 - 1;
  mouse.y = 2 * -(a.clientY / window.innerHeight) + 1;
  showAbstract(a.clientX, a.clientY)
}

function onMouseClick(a) {
  INTERSECTED && isShowDetail && (showDetail(!0), showPic(!0))
  console.log(INTERSECTED,isShowDetail,'1111')
}


function showAbstract(a, d) {
  if (INTERSECTED) {
    $("#abstract").css("display", "table");
    var b = document.getElementById("abstract");
    b.innerText = INTERSECTED.value;
    b.style.top = d + "px";
    b.style.left = a - 88 + "px"
  } else $("#abstract").css("display", "none")
  // console.log(INTERSECTED,isShowDetail,'22222')
}



function showText(a) {
  $("#detail").html("<textarea></textarea>");
  $("#detail textarea").typetype(a, {t: 10, e: 0})
}

function showDetail(a) {
  a ? INTERSECTED.name != pointed && (showString = INTERSECTED.userData.abstract, $("#detail").slideDown(1E3), $("#detail").html('<div style="background-color: rgba(50,50,50,0.8);color: white;padding: 5px 5px 5px 5px;opacity: 0.7;border: 0;resize: none;font-size: 23px;text-align: center;padding-top: 58%;padding-bottom: 70%;">\u52a0\u8f7d\u4e2d...</div>'), setTimeout("showText(showString)", 500)) : $("#detail").slideUp(900)
}

function changePic(a) {
  //修改图片路径
  $("#picture img").attr("src", "http://192.168.8.94:8000/pic/" + a);
  $("#picture").fadeIn(400)
}

function showPic(a) {
  a ? INTERSECTED.name != pointed && (picPath = INTERSECTED.userData.pic, $("#picture").fadeOut(400), setTimeout("changePic(picPath)", 400), pointed = INTERSECTED.name) : $("#picture").fadeOut(900)
}

function rayMousemove(a, d) {
  raycaster.setFromCamera(a, d);
  a = raycaster.intersectObjects(nodeObjects);
  0 < a.length ? INTERSECTED != a[0].object && (INTERSECTED && INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex), INTERSECTED = a[0].object, INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex(), INTERSECTED.scale.setScalar(1.2), INTERSECTED.material.emissive.setHex(5592405), console.log(INTERSECTED.name)) : (INTERSECTED && (INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex), INTERSECTED.scale.setScalar(1)),
    INTERSECTED = null)
}

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

function getForceLayout(a, d) {
  console.log(a,d,'ad')
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
        c.position = {x: b[0] - 500, y: 500 - b[1]}

      });
      console.log(e)
    })
  }
  return b
}

// $().ready($.getJSON("js/data/data.json", function (a) {
//   jsonData = a;
//   init();
//   animate()
// }));
// jsonData = Json;
// setTimeout(()=>{
//
// })



export function init(data,show) {
  jsonData=data;
  console.log(jsonData,"jsonData")
  container = document.getElementById("container");
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 4E3);
  camera.position.set(1300, 300, 400);
  controls = new THREE.OrbitControls(camera);
  controls.rotateSpeed = 1;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = .8;
  controls.enableZoom = !1;
  controls.enablePan = !1;
  controls.autoRotate = !0;
  controls.autoRotateSpeed = .5;
  scene = new THREE.Scene;
  scene.background = new THREE.Color(0);
  scene.add(new THREE.AmbientLight(16777215));
  for (var a = new THREE.Group,
         d, b = 0; 3 > b; b++) {
    d = 300 - 300 * b;
    var c = new THREE.GridHelper(1050, 50);
    c.position.y = d;
    c.material.opacity = .75;
    c.material.transparent = !0;
    0 == b && (c.material.color = new THREE.Color("rgb(240, 134, 82)"));
    1 == b && (c.material.color = new THREE.Color("rgb(30, 160, 230)"));
    2 == b && (c.material.color = new THREE.Color("rgb(122, 225, 116)"));
    console.log(c,'c')
    a.add(c)
  }
  a.name = "planeGroup";
  d = new THREE.Group;
  d.name = "nodeGroup";

  for (var e, c = node_link_Sort(jsonData.nodes), g = node_link_Sort(jsonData.links), g = getForceLayout(c, g), b = 0; 3 > b; b++) {

    var l = new THREE.Group;
    l.name = "\u7b2c" + (b + 1) + "\u5c42";
    e = 320 - 300 * b;
    $.each(g, function (a, c) {
      if (c.layer < b + 2) {
        if (c.layer == b + 1) {
          a = (new THREE.TextureLoader).load('http://192.168.8.94:8000/pic/'+ c.path);
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
          nodePos.push({position: d.position, id: c.id});
          nodeObjects.push(d);
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
  for (var h = 0, b = 0; b < jsonData.links.length; b++) {
    var h = 0, t = jsonData.links[b].source, u = jsonData.links[b].target, f = new THREE.Vector3,
      k = new THREE.Vector3, m = new THREE.Vector3, r = jsonData.links[b].layer;
    $.each(c, function (a, b) {
      b.id == t ? (k = nodePos[a].position, h += 1) : b.id == u && (m = nodePos[a].position, h += 1);
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
    networkGroup.add(c)
  }
  networkGroup.add(q);
  scene.add(networkGroup);
  renderer = new THREE.WebGLRenderer({antialias: !0});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth,
    window.innerHeight);
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.width = "100%";
  container.appendChild(renderer.domElement);
  raycaster = new THREE.Raycaster;
  myStats = new Stats;

  document.addEventListener("mousemove", onDocumentMouseMove, !1);
  document.addEventListener("click", onMouseClick(), !1);
  window.addEventListener("resize", onWindowResize, !1)
}

export function animate() {
  requestAnimationFrame(animate);
  render();
  myStats.update();
  TWEEN.update()
}

export function render() {
  controls.update();
  rayMousemove(mouse, camera);
  changeObjFace(nodeObjects);
  renderer.render(scene, camera)
  // console.log(mouse, camera,'mouse, camera')
}
// $(".btn_list button").bind("click", function (a) {
//   switch (a.target.id) {
//     case "main":
//       homeAnimation();
//       break;
//     case "upper":
//       networkAnimation();
//       break;
//     case "middle":
//       serviceAnimation();
//       break;
//     case "bottom":
//       virtualUser();
//       break;
//     case "browse":
//       rotate()
//   }
// });


export function networkAnimation(show) {
  isShowDetail = !0;
  showDetail(!1);
  showPic(!1);
  if ("first" != which_layer) {
    which_layer = "first";
    TWEEN.removeAll();
    networkGroup.children[3].visible = !1;
    var a = (new TWEEN.Tween(networkGroup.children[0].position)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: -500,
        z: 0
      }, 1E3),
      d = (new TWEEN.Tween(networkGroup.children[0].scale)).delay(0).easing(TWEEN.Easing.Exponential.Out).to({
        x: 1.7,
        y: 1.7,
        z: 1.7
      }, 5E3),
      b = (new TWEEN.Tween(networkGroup.children[0].rotation)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 0, z: 0
      }, 1E3);
    $.each(networkGroup.children, function (c, e) {
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
    (new TWEEN.Tween(networkGroup.children[1].position)).delay(100).to({
      y: 0,
      x: 1300,
      z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(networkGroup.children[1].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start();
    (new TWEEN.Tween(networkGroup.children[2].position)).delay(100).to({
      y: 0,
      x: -1300, z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(networkGroup.children[2].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start()
  }
}

export function serviceAnimation() {
  isShowDetail = !0;
  showDetail(!1);
  showPic(!1);
  if ("second" != which_layer) {
    which_layer = "second";
    TWEEN.removeAll();
    networkGroup.children[3].visible = !1;
    var a = (new TWEEN.Tween(networkGroup.children[1].scale)).easing(TWEEN.Easing.Exponential.Out).delay(0).to({
        x: 1.7,
        y: 1.7,
        z: 1.7
      }, 5E3),
      d = (new TWEEN.Tween(networkGroup.children[1].position)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 0,
        z: 0
      }, 1E3),
      b = (new TWEEN.Tween(networkGroup.children[1].rotation)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 0, z: 0
      }, 1E3);
    $.each(networkGroup.children, function (c, e) {
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
    (new TWEEN.Tween(networkGroup.children[0].position)).delay(100).to({
      y: 0,
      x: 1300,
      z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(networkGroup.children[0].rotation)).delay(100).to({
      x: 0,
      y: 10,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start();
    (new TWEEN.Tween(networkGroup.children[2].position)).delay(100).to({
      y: 0,
      x: -1300, z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(networkGroup.children[2].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start()
  }
}

export function virtualUser() {
  isShowDetail = !0;
  showDetail(!1);
  showPic(!1);
  if ("third" != which_layer) {
    which_layer = "third";
    TWEEN.removeAll();
    networkGroup.children[3].visible = !1;
    var a = (new TWEEN.Tween(networkGroup.children[2].position)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 500,
        z: 0
      }, 1E3),
      d = (new TWEEN.Tween(networkGroup.children[2].scale)).easing(TWEEN.Easing.Exponential.Out).delay(0).to({
        x: 1.7,
        y: 1.7,
        z: 1.7
      }, 5E3),
      b = (new TWEEN.Tween(networkGroup.children[2].rotation)).easing(TWEEN.Easing.Quadratic.Out).delay(100).to({
        x: 0,
        y: 0, z: 0
      }, 1E3);
    $.each(networkGroup.children, function (c, e) {
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
    (new TWEEN.Tween(networkGroup.children[0].position)).delay(100).to({
      y: 0,
      x: 1300,
      z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(networkGroup.children[0].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start();
    (new TWEEN.Tween(networkGroup.children[1].position)).delay(100).to({
      y: 0,
      x: -1300, z: 0
    }, 2E3).easing(TWEEN.Easing.Exponential.InOut).start();
    (new TWEEN.Tween(networkGroup.children[1].rotation)).delay(100).to({
      y: 10,
      x: 0,
      z: 0
    }, 6E3).easing(TWEEN.Easing.Exponential.Out).start()
  }
}

export function homeAnimation(show) {
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

  which_layer = "home";
  isShowDetail = !1;
  showDetail(!1);
  showPic(!1);
  TWEEN.removeAll();
  $.each(networkGroup.children, function (a, c) {
    (new TWEEN.Tween(c.scale)).to({
      x: 1,
      y: 1, z: 1
    }, 800).start()
  });
  var d;
  d = networkGroup.children[3];
  (new TWEEN.Tween(networkGroup.children[0].position)).delay(0).to({
    y: 0,
    x: 0,
    z: 0
  }, 700).easing(TWEEN.Easing.Exponential.In).start();
  (new TWEEN.Tween(networkGroup.children[0].rotation)).delay(0).to({y: 0}, 2500).easing(TWEEN.Easing.Quintic.Out).start().onComplete(function () {
  });
  (new TWEEN.Tween(networkGroup.children[1].position)).delay(0).to({
    y: 0,
    x: 0,
    z: 0
  }, 700).easing(TWEEN.Easing.Exponential.In).start();
  (new TWEEN.Tween(networkGroup.children[1].rotation)).delay(0).to({y: 0},
    2500).easing(TWEEN.Easing.Quintic.Out).start().onComplete(function () {
  });
  (new TWEEN.Tween(networkGroup.children[2].position)).delay(0).to({
    y: 0,
    x: 0,
    z: 0
  }, 700).easing(TWEEN.Easing.Exponential.In).start();
  (new TWEEN.Tween(networkGroup.children[2].rotation)).delay(0).to({y: 0}, 2500).easing(TWEEN.Easing.Quintic.Out).start().onComplete(function () {
    a();
    // IsHome = !0
  })
}

export function rotate() {
  1 == controls.autoRotate ? controls.autoRotate = !1 : controls.autoRotate = !0
};

export function destory(){
  // var container, camera, controls, scene, renderer, raycaster, nodeObjects = [], networkGroup = new THREE.Group,
  //   nodePos = [], jsonData, isShowDetail = !1,mouse = new THREE.Vector2, INTERSECTED,
  //   offset = new THREE.Vector3(10, 10, 10);
  // delete container;
  container=null;
  camera=null;
  controls=null;
  scene=null;
  renderer=null;
  raycaster=null;
  nodeObjects = [];
  networkGroup=null;
  nodePos=[];


}
