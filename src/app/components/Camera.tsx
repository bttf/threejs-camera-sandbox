"use client";

import { SandboxCamera } from "@/app/lib/cameraWorld";
import clsx from "clsx";
import { FC, useEffect, useRef } from "react";

const Camera: FC<{
  camera: SandboxCamera;
  underControl: boolean;
  onClick: () => void;
}> = ({ camera, underControl, onClick: _onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvas: HTMLCanvasElement = camera.canvas;

  useEffect(() => {
    if (ref.current && canvas && !ref.current.contains(canvas)) {
      ref.current.appendChild(canvas);
    }
  }, [canvas]);

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
