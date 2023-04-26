"use client";

import { SandboxCamera } from "@/app/lib/cameraWorld";
import clsx from "clsx";
import { FC, useEffect, useRef } from "react";

const Camera: FC<{ camera: SandboxCamera }> = ({ camera }) => {
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
      className={clsx("my-2", "h-80", "w-80", "rounded", "overflow-hidden")}
    ></div>
  );
};

export default Camera;
