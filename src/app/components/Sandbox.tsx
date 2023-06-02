"use client";

import { FC, useCallback, useEffect, useState } from "react";
import {
  CameraView,
  initWorld,
  addCamera as _addCamera,
  removeCamera as _removeCamera,
} from "@/app/lib/cameraWorld";
import Camera from "./Camera";

const Sandbox: FC = () => {
  const [cameraViews, setCameraViews] = useState<CameraView[]>([]);
  const [cameraViewUnderControl, setCameraViewUnderControl] =
    useState<CameraView | null>(null);

  // initialize
  useEffect(() => {
    const cameraView = initWorld();
    setCameraViews([cameraView]);
  }, []);

  const addCamera = useCallback(() => {
    const newCameraViews = _addCamera({
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
    setCameraViews([...newCameraViews]);
  }, [setCameraViews]);

  const removeCameraView = useCallback(
    (camera: CameraView) => {
      const newCameraViews = _removeCamera(camera);
      setCameraViews([...newCameraViews]);
    },
    [setCameraViews]
  );

  const [defaultCameraView, ...userCameraViews] = cameraViews;

  if (!defaultCameraView) return null;

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
          cameraView={defaultCameraView}
          underControl={cameraViewUnderControl === defaultCameraView}
          onClick={() => setCameraViewUnderControl(defaultCameraView)}
        />
      </div>
      <div className="md:flex-1 md:flex md:flex-wrap md:overflow-y-auto md:h-full">
        {userCameraViews.map((cameraView, i) => (
          <div key={cameraView.camera.uuid}>
            <div className="h-12 flex items-center justify-between px-2">
              <div className="my-2">{`Camera #${i + 1}`}</div>
              <button
                className="my-2 px-2 py-1 bg-rose-300 rounded"
                onClick={() => removeCameraView(cameraView)}
              >
                Remove
              </button>
            </div>
            <Camera
              cameraView={cameraView}
              underControl={cameraViewUnderControl === cameraView}
              onClick={() => setCameraViewUnderControl(cameraView)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sandbox;
