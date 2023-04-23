"use client";

import { FC, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Renderer from "@/app/components/Renderer";

// all viewports will have equal width x height
let aspect = 1;

let container: HTMLDivElement;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let mesh: THREE.Mesh;
let cameraRig: THREE.Group;
let activeCamera: THREE.Camera;
let activeHelper: THREE.CameraHelper;
let cameraPerspective: THREE.PerspectiveCamera;
let cameraOrtho: THREE.OrthographicCamera;
let cameraPerspectiveHelper: THREE.CameraHelper;
let cameraOrthoHelper: THREE.CameraHelper;

function _genPoints() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 10000; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color: 0x888888 })
  );

  return particles;
}

function init() {
  // init scene
  scene = new THREE.Scene();

  // default cam
  camera = new THREE.PerspectiveCamera(50, aspect, 1, 10000);
  camera.position.z = 2500;

  // white "planet"
  mesh = new THREE.Mesh(
    new THREE.SphereGeometry(100, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
  );
  scene.add(mesh);

  // stars
  scene.add(_genPoints());

  return { camera, scene };
}

function animate() {
  requestAnimationFrame(animate);

  const r = Date.now() * 0.0005;

  mesh.position.x = 700 * Math.cos(r);
  mesh.position.z = 700 * Math.sin(r);
  mesh.position.y = 700 * Math.sin(r);
}

const Sandbox: FC<{}> = () => {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [cameras, setCameras] = useState<THREE.Camera[]>([]);

  useEffect(() => {
    const { camera, scene } = init();
    setScene(scene);
    setCameras([camera]);
  }, []);

  useEffect(() => {
    if (!scene) return;
    if (cameras.length === 0 || cameras.length > 1) return;
    animate();
  }, [scene, cameras]);

  if (!scene) return null;

  return (
    <div className="flex flex-col items-center">
      {cameras.map((camera, i) => (
        <Renderer key={i} camera={camera} scene={scene} />
      ))}
    </div>
  );
};

export default Sandbox;
