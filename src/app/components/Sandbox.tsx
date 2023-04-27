"use client";

import { FC, useCallback, useEffect, useState } from "react";
import {
  SandboxCamera,
  initWorld,
  addCamera as _addCamera,
  removeCamera as _removeCamera,
} from "@/app/lib/cameraWorld";
import Camera from "./Camera";

const Sandbox: FC = () => {
  const [cameras, setCameras] = useState<SandboxCamera[]>([]);
  const [cameraUnderControl, setCameraUnderControl] =
    useState<SandboxCamera | null>(null);

  // initialize
  useEffect(() => {
    const camera = initWorld();
    setCameras([camera]);
  }, []);

  const addCamera = useCallback(() => {
    const newCameras = _addCamera({
      type: "perspective",
      fov: 75,
      aspect: 1,
      near: 1,
      far: 10000,
      position: { z: 500 / cameras.length },
    });
    setCameras([...newCameras]);
  }, [cameras, setCameras]);

  const removeCamera = useCallback(
    (camera: SandboxCamera) => {
      const cameras = _removeCamera(camera);
      setCameras([...cameras]);
    },
    [setCameras]
  );

  const [defaultCamera, ...userCameras] = cameras;

  if (!defaultCamera) return null;

  return (
    <div className="flex flex-col items-center md:items-start md:flex-row">
      <div>
        <div className="my-2">Default Camera</div>
        <Camera
          large
          underControl={cameraUnderControl === defaultCamera}
          sandboxCamera={defaultCamera}
          onClick={() => setCameraUnderControl(defaultCamera)}
        />
        <button className="my-2 px-2 py-1" onClick={addCamera}>
          + Add Camera
        </button>
      </div>
      <div className="md:flex-1 md:flex md:flex-wrap">
        {userCameras.reverse().map((camera, i) => (
          <div key={camera.camera.uuid}>
            <div className="my-2">{`Camera #${userCameras.length - i}`}</div>
            <Camera
              underControl={cameraUnderControl === camera}
              sandboxCamera={camera}
              onClick={() => setCameraUnderControl(camera)}
            />
            <button
              className="my-2 px-2 py-1"
              onClick={() => removeCamera(camera)}
            >
              Remove Camera
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sandbox;
