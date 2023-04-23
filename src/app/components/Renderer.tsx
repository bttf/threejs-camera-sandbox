"use client";

import clsx from "clsx";
import * as THREE from "three";
import { FC, useEffect, useRef } from "react";

let renderer: THREE.WebGLRenderer;

let CONTAINER_HEIGHT: number;
let CONTAINER_WIDTH: number;

function init(container: HTMLDivElement) {
  renderer = new THREE.WebGLRenderer({ antialias: true });

  CONTAINER_HEIGHT = container.clientHeight;
  CONTAINER_WIDTH = container.clientWidth;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT);

  container.appendChild(renderer.domElement);
  renderer.autoClear = false;
}

function animate(scene: THREE.Scene, camera: THREE.Camera) {
  requestAnimationFrame(() => animate(scene, camera));

  renderer.clear();
  renderer.setViewport(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
  renderer.render(scene, camera);
}

const Renderer: FC<{
  camera: THREE.Camera;
  scene: THREE.Scene;
}> = ({ camera, scene }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef?.current || !camera || !scene) return;

    // return if already initialized
    if (renderer) return;

    init(containerRef.current);
    animate(scene, camera);
  }, [containerRef, camera, scene]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "my-4",
        "border-lg",
        "border-slate-500",
        "h-80",
        "w-80",
        "rounded",
        "overflow-hidden"
      )}
    ></div>
  );
};

export default Renderer;
