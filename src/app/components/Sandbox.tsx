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
      fov: 25,
      aspect: 1,
      near: 1,
      far: 500,
      position: {
        z: 200 - Math.random() * 400 + 100,
        x: 200 - Math.random() * 400 + 100,
      },
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
        <div className="h-12 flex items-center justify-between px-2">
          <div>Default camera</div>

          <button
            className="my-2 px-2 py-1 bg-blue-300 rounded"
            onClick={addCamera}
          >
            + Add Camera
          </button>
        </div>
        <Camera
          large
          underControl={cameraUnderControl === defaultCamera}
          sandboxCamera={defaultCamera}
          onClick={() => setCameraUnderControl(defaultCamera)}
        />
      </div>
      <div className="md:flex-1 md:flex md:flex-wrap md:overflow-y-auto md:h-full">
        {userCameras.map((camera, i) => (
          <div key={camera.camera.uuid}>
            <div className="h-12 flex items-center justify-between px-2">
              <div className="my-2">{`Camera #${i + 1}`}</div>
              <button
                className="my-2 px-2 py-1 bg-rose-300 rounded"
                onClick={() => removeCamera(camera)}
              >
                Remove
              </button>
            </div>
            <Camera
              underControl={cameraUnderControl === camera}
              sandboxCamera={camera}
              onClick={() => setCameraUnderControl(camera)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sandbox;
