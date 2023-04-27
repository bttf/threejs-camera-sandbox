"use client";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import clsx from "clsx";
import { FC, useEffect, useRef } from "react";
import { SandboxCamera } from "@/app/lib/cameraWorld";

let _orbitControls: OrbitControls | null = null;

const Camera: FC<{
  sandboxCamera: SandboxCamera;
  underControl: boolean;
  onClick: () => void;
}> = ({ sandboxCamera, underControl, onClick: _onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvas: HTMLCanvasElement = sandboxCamera.canvas;

  useEffect(() => {
    if (ref.current && canvas && !ref.current.contains(canvas)) {
      ref.current.appendChild(canvas);
    }
  }, [canvas]);

  useEffect(() => {
    if (underControl && !_orbitControls) {
      _orbitControls = new OrbitControls(sandboxCamera.camera, canvas);
      // none of the below is working
      _orbitControls.enablePan = true;
      _orbitControls.keys = {
        LEFT: "A",
        UP: "W",
        RIGHT: "D",
        BOTTOM: "S",
      };
      _orbitControls.mouseButtons = {
        MIDDLE: THREE.MOUSE.ROTATE,
        RIGHT: THREE.MOUSE.DOLLY,
        LEFT: THREE.MOUSE.PAN,
      };
    } else if (_orbitControls) {
      _orbitControls.dispose();
      _orbitControls = null;
    }
  }, [underControl]);

  return (
    <div
      ref={ref}
      className={clsx("my-2", "h-80", "w-80", "rounded", "overflow-hidden", {
        "border-2 border-red-500": underControl,
      })}
      onClick={_onClick}
    ></div>
  );
};

export default Camera;
