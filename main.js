import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

//Scene
const scene = new THREE.Scene();

//Creat a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#5D3FD3",
  roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//sizes
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 1.25;
scene.add(light);

//Camara
const camara = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  100
);
camara.position.z = 20;
scene.add(camara);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.render(scene, camara);
renderer.setPixelRatio(2);

//controls
const controls = new OrbitControls(camara, canvas);
controls.enableDamping = true;
// disable mouse draging and zooming in
controls.enablePan = false;
controls.enableZoom = false;
//Aout-rotation and speed
controls.autoRotate = true;
controls.autoRotateSpeed = 5;
//resizing
window.addEventListener("resize", () => {
  // Update Sizes
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  //Update camara
  camara.updateProjectionMatrix();
  camara.aspect = size.width / size.height;
  renderer.setSize(size.width, size.height);
});

const loop = () => {
  // mesh.position.x += 0.2;
  renderer.render(scene, camara);
  window.requestAnimationFrame(loop);
  controls.update();
};
loop();

//timeline Black Magic//timeline() this allows us to make multiple animations togther
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

//Mouse animation color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / size.width) * 255),
      Math.round((e.pageY / size.height) * 255),
      180,
    ];
    //Animate color
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
