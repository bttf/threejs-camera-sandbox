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
  large?: boolean;
}> = ({ sandboxCamera, underControl, onClick: _onClick, large }) => {
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
      _orbitControls.mouseButtons = {
        MIDDLE: THREE.MOUSE.ROTATE,
        LEFT: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
    } else if (_orbitControls) {
      _orbitControls.dispose();
      _orbitControls = null;
    }
  }, [underControl]);

  return (
    <div
      ref={ref}
      className={clsx("rounded", "overflow-hidden", "w-80", "h-80", {
        "border-2 border-red-500": underControl,

        "md:w-[40rem]": large,
        "md:h-[40rem]": large,
      })}
      onClick={_onClick}
    ></div>
  );
};

export default Camera;
