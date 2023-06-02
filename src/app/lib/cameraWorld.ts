import * as THREE from "three";
import genStarParticles from "./genStarParticles";

/**
 * types
 */
export type CameraView = {
  canvas: HTMLCanvasElement;
  camera: THREE.Camera;
  cameraHelper: THREE.CameraHelper;
};

type CameraArgs = {
  type: "perspective" | "orthographic";
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  position?: Partial<THREE.PerspectiveCamera["position"]>;
};

/**
 * variables
 */
let cameraViews: CameraView[] = [];
const aspect = 1; // all viewports will have square aspect ratio
const CONTAINER_HEIGHT = 640;
const CONTAINER_WIDTH = 640;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let mesh: THREE.Mesh;
let mesh2: THREE.Mesh;
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

  // keep mesh global
  mesh = _mesh;
  scene.add(mesh);

  // green "planet"
  const _mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(50, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
  );

  // keep global
  mesh2 = _mesh2;
  mesh2.position.y = 150;
  mesh.add(mesh2);

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
  canvas.style.height = "inherit";
  canvas.style.width = "inherit";
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
      containerCanvasWidth * cameraViews.length -
        containerCanvasHeight * (cameraIndex + 1),
      containerCanvasWidth,
      containerCanvasHeight,
      0,
      0,
      targetCanvas.width,
      targetCanvas.height
    );
  return targetCanvas;
};

const animate = () => {
  mesh.rotation.y += 0.005;
  mesh.children[0].position.x = mesh.position.x + 100;
  mesh.children[0].rotation.y -= 0.02;
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

  cameraViews.forEach((cameraView, cameraIndex) => {
    const { canvas: targetCanvas, camera } = cameraView;

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

export const initWorld = (): CameraView => {
  // create scene and default camera
  const { scene: _scene, camera } = createWorld();

  // keep scene global
  scene = _scene;

  renderer = createRenderer(CONTAINER_WIDTH, CONTAINER_HEIGHT);

  // add to cameraViews
  cameraViews.push({ camera, canvas: createCanvas() });

  // kick off render loop
  requestAnimationFrame((time) => render(time, renderer, scene));

  return cameraViews[0];
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

  camera.lookAt(mesh.position);

  scene.add(camera);
  scene.add(cameraHelper);

  cameraViews.push({ camera, canvas: createCanvas(), cameraHelper });

  // update renderer size for new camera
  renderer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT * cameraViews.length);

  return cameraViews;
};

export const removeCamera = (cameraView: CameraView) => {
  const { camera, cameraHelper } = cameraView;
  scene.remove(camera);
  scene.remove(cameraHelper);
  cameraViews = cameraViews.filter((c) => c !== cameraView);
  renderer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT * cameraViews.length);
  return cameraViews;
};
