import * as THREE from "three";
import genStarParticles from "./genStarParticles";

/**
 * types
 */
export type SandboxCamera = {
  canvas: HTMLCanvasElement;
  camera: THREE.Camera;
};

type CameraArgs = {
  type: "perspective" | "orthographic";
} & {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
} & {
  position?: Partial<THREE.PerspectiveCamera["position"]>;
};

/**
 * variables
 */
let cameras: SandboxCamera[] = [];
const aspect = 1; // all viewports will have square aspect ratio
const CONTAINER_HEIGHT = 320; // hard-coded for the moment, matching tailwind's h-80 styling (320px)
const CONTAINER_WIDTH = 320;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let mesh: THREE.Mesh;
let _tick = 0;

/**
 * functions
 */
const createWorld = () => {
  const scene = new THREE.Scene();

  // default camera
  const camera = new THREE.PerspectiveCamera(50, aspect, 1, 10000);
  camera.position.z = 500;

  // white "planet"
  const _mesh = new THREE.Mesh(
    new THREE.SphereGeometry(100, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
  );
  mesh = _mesh;
  scene.add(mesh);

  // stars
  scene.add(genStarParticles());

  return { scene, camera };
};

const createRenderer = (width: number, height: number) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  renderer.autoClear = false;

  return renderer;
};

const createCanvas = () => {
  // mimic the way three.js doubles resouluion of canvas and scales it down
  const canvas = document.createElement("canvas");
  canvas.width = CONTAINER_WIDTH * 2;
  canvas.height = CONTAINER_HEIGHT * 2;
  canvas.style.height = `${CONTAINER_HEIGHT}px`;
  canvas.style.width = `${CONTAINER_WIDTH}px`;
  return canvas;
};

const updateCameraCanvas = ({
  sourceCanvas,
  targetCanvas,
  cameraIndex,
}: {
  sourceCanvas: HTMLCanvasElement;
  targetCanvas: HTMLCanvasElement;
  cameraIndex: number;
}) => {
  // canvas dimensions are scaled up by 2x via webgl renderer
  const containerCanvasWidth = CONTAINER_WIDTH * 2;
  const containerCanvasHeight = CONTAINER_HEIGHT * 2;

  targetCanvas
    .getContext("2d")
    ?.drawImage(
      sourceCanvas,
      0,
      containerCanvasWidth * cameras.length -
        containerCanvasHeight * (cameraIndex + 1),
      containerCanvasWidth,
      containerCanvasHeight,
      0,
      0,
      containerCanvasWidth,
      containerCanvasHeight
    );
  return targetCanvas;
};

const animate = () => {
  mesh.rotation.y += 0.005;
};

const render = (
  time: number,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene
) => {
  requestAnimationFrame((time) => render(time, renderer, scene));

  // 60 fps
  if (time - _tick < 1000 / 60) return;

  _tick = time;
  renderer.clear();

  animate();

  cameras.forEach((sandboxCamera, cameraIndex) => {
    const { canvas: targetCanvas, camera } = sandboxCamera;

    renderer.setViewport(
      0,
      CONTAINER_HEIGHT * cameraIndex,
      CONTAINER_WIDTH,
      CONTAINER_HEIGHT
    );

    renderer.render(scene, camera);

    updateCameraCanvas({
      sourceCanvas: renderer.domElement,
      targetCanvas,
      cameraIndex,
    });
  });
};

export const initWorld = (): SandboxCamera => {
  // create scene and default camera
  const { scene: _scene, camera } = createWorld();

  // keep scene global
  scene = _scene;

  renderer = createRenderer(CONTAINER_WIDTH, CONTAINER_HEIGHT);

  // add to cameras
  cameras.push({ camera, canvas: createCanvas() });

  // kick off render loop
  requestAnimationFrame((time) => render(time, renderer, scene));

  return cameras[0];
};

export const addCamera = ({
  type,
  fov,
  aspect,
  near,
  far,
  left,
  right,
  top,
  bottom,
  position,
}: CameraArgs) => {
  const camera =
    type === "perspective"
      ? new THREE.PerspectiveCamera(fov, aspect, near, far)
      : new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  const cameraHelper = new THREE.CameraHelper(camera);

  camera.position.x = position?.x ?? camera.position.x;
  camera.position.y = position?.y ?? camera.position.y;
  camera.position.z = position?.z ?? camera.position.z;

  scene.add(camera);
  scene.add(cameraHelper);

  cameras.push({ camera, canvas: createCanvas() });

  // update renderer size for new camera
  renderer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT * cameras.length);

  return cameras;
};

export const removeCamera = (sandboxCamera: SandboxCamera) => {
  const { camera } = sandboxCamera;
  scene.remove(camera);
  cameras = cameras.filter((c) => c !== sandboxCamera);
  renderer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT * cameras.length);
  return cameras;
};
