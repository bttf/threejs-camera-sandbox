"use client";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import clsx from "clsx";
import { FC, useEffect, useRef, useState } from "react";
import { CameraView } from "@/app/lib/cameraWorld";
import PerspectiveControls from "./PerspectiveControls";
import OrthographicControls from "./OrthographicControls";

const Camera: FC<{
  cameraView: CameraView;
  underControl: boolean;
  onClick: () => void;
  large?: boolean;
}> = ({ cameraView, underControl, onClick: _onClick, large }) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvas: HTMLCanvasElement = cameraView.canvas;
  const [orbitControls, setOrbitControls] = useState<OrbitControls | null>(
    null
  );
  const cameraType =
    cameraView.camera instanceof THREE.PerspectiveCamera
      ? "perspective"
      : "orthographic";

  useEffect(() => {
    if (ref.current && canvas && !ref.current.contains(canvas)) {
      ref.current.appendChild(canvas);
    }
  }, [canvas]);

  useEffect(() => {
    if (underControl && !orbitControls) {
      const _orbitControls = new OrbitControls(cameraView.camera, canvas);
      _orbitControls.mouseButtons = {
        MIDDLE: THREE.MOUSE.ROTATE,
        LEFT: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
      setOrbitControls(_orbitControls);
    } else if (orbitControls && !underControl) {
      orbitControls.dispose();
      setOrbitControls(null);
    }
  }, [underControl, orbitControls, canvas, cameraView]);

  return (
    <div
      ref={ref}
      className={clsx("overflow-hidden", "w-80", "h-80", "relative", {
        "border-2 border-red-500": underControl,

        "md:w-[40rem]": large,
        "md:h-[40rem]": large,
      })}
      onClick={_onClick}
    >
      {cameraType === "perspective" ? (
        <PerspectiveControls />
      ) : (
        <OrthographicControls />
      )}
    </div>
  );
};

export default Camera;