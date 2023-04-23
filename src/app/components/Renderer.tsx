"use client";

import clsx from "clsx";
import * as THREE from "three";
import { FC, useEffect, useRef, useState } from "react";

let CONTAINER_HEIGHT: number;
let CONTAINER_WIDTH: number;

function init(container: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  CONTAINER_HEIGHT = container.clientHeight;
  CONTAINER_WIDTH = container.clientWidth;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT);

  container.appendChild(renderer.domElement);
  renderer.autoClear = false;

  return { renderer };
}

function animate(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
) {
  requestAnimationFrame(() => animate(scene, camera, renderer));

  renderer.clear();
  renderer.setViewport(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
  renderer.render(scene, camera);
}

const Renderer: FC<{
  camera: THREE.Camera;
  scene: THREE.Scene;
}> = ({ camera, scene }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!containerRef?.current || !camera || !scene) return;

    // return if already initialized
    if (renderer) return;

    const { renderer: _renderer } = init(containerRef.current);

    setRenderer(_renderer);

    animate(scene, camera, _renderer);
  }, [containerRef, camera, scene, renderer]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "my-2",
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
