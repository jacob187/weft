import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { fitCanvas, rafLoop } from '~/lib/canvas';
import { prefersReducedMotion } from '~/lib/motion';
import { token } from '~/lib/tokens';

/** A switchable material finish for the sculpture. */
export interface FinishSpec {
  id: string;
  /** Any CSS color. */
  color: string;
  metalness: number;
  roughness: number;
  /** Core-line color; defaults to the `--amber` token. */
  accent?: string;
}

export interface Stage {
  /** Tween the sculpture to the finish with this id (no-op for unknown ids). */
  setFinish(id: string): void;
}

type Vec3 = [number, number, number];

/** Camera keyframes by scroll progress: hero → design (side) → finish (top-ish) → preorder (front far). */
const KEYFRAMES: { p: number; cam: Vec3; look: Vec3 }[] = [
  { p: 0.0, cam: [2.6, 0.6, 7.2], look: [0, 0, 0] },
  { p: 0.33, cam: [-4.4, 1.4, 5.4], look: [0.4, 0, 0] },
  { p: 0.66, cam: [3.4, 3.4, 4.6], look: [-0.4, -0.2, 0] },
  { p: 1.0, cam: [0, 0.2, 9.0], look: [0, 0.1, 0] },
];

function cameraAt(p: number): { cam: Vec3; look: Vec3 } {
  let a = KEYFRAMES[0];
  let b = KEYFRAMES[KEYFRAMES.length - 1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (p >= KEYFRAMES[i].p && p <= KEYFRAMES[i + 1].p) {
      a = KEYFRAMES[i];
      b = KEYFRAMES[i + 1];
      break;
    }
  }
  const t = (p - a.p) / (b.p - a.p || 1);
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const mix = (from: Vec3, to: Vec3): Vec3 => [
    from[0] + (to[0] - from[0]) * e,
    from[1] + (to[1] - from[1]) * e,
    from[2] + (to[2] - from[2]) * e,
  ];
  return { cam: mix(a.cam, b.cam), look: mix(a.look, b.look) };
}

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  // Curve's constructor is protected in the typings; re-declare it public.
  constructor() {
    super();
  }

  override getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const turns = 2.35;
    const R = 1.05;
    const climb = 2.6;
    const a = t * Math.PI * 2 * turns;
    const taper = 1 - t * 0.34;
    return target.set(Math.cos(a) * R * taper, (t - 0.5) * climb, Math.sin(a) * R * taper);
  }
}

function softShadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  if (x) {
    const g = x.createRadialGradient(128, 128, 10, 128, 128, 120);
    g.addColorStop(0, 'rgba(0,0,0,.55)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(c);
}

/**
 * The HELIX sculpture: a drag-to-rotate helical tube on a pedestal, with a scroll-choreographed camera
 * and tweened finish changes. Scene colors come from the `--coal`, `--amber`, `--pedestal` and `--ambient` tokens.
 */
export function initStage(canvas: HTMLCanvasElement, finishes: FinishSpec[]): Stage {
  const reduced = prefersReducedMotion();
  const first = finishes[0];
  const coal = token('--coal');
  const amber = token('--amber');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(coal);
  scene.fog = new THREE.Fog(coal, 8, 18);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(2.6, 0.6, 7.2);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();

  /* the sculpture: helical tube */
  const curve = new HelixCurve();
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(first.color),
    metalness: first.metalness,
    roughness: first.roughness,
    clearcoat: 0.5,
    clearcoatRoughness: 0.25,
  });
  const helix = new THREE.Mesh(new THREE.TubeGeometry(curve, 320, 0.34, 40, false), mat);
  helix.rotation.z = 0.2;
  scene.add(helix);

  /* horn mouth — flared torus at the top end */
  const mouthMat = mat.clone();
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.13, 26, 60), mouthMat);
  const tip = curve.getPoint(1);
  mouth.position.copy(tip);
  mouth.lookAt(tip.clone().multiplyScalar(2).add(new THREE.Vector3(0, 1.4, 0)));
  scene.add(mouth);

  /* emissive core line inside the helix */
  const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(first.accent ?? amber) });
  const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 320, 0.045, 10, false), coreMat);
  core.scale.setScalar(1.001);
  scene.add(core);

  /* pedestal disc + soft shadow */
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(2.5, 2.6, 0.14, 72),
    new THREE.MeshStandardMaterial({ color: token('--pedestal'), metalness: 0.4, roughness: 0.5 }),
  );
  disc.position.y = -2.1;
  scene.add(disc);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 4.4),
    new THREE.MeshBasicMaterial({ map: softShadowTexture(), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.02;
  scene.add(shadow);

  /* accent lights */
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(amber, 1.1);
  rim.position.set(-5, 2, -4);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(token('--ambient'), 0.5));

  fitCanvas(canvas, {
    maxDpr: 1.6,
    onResize: (w, h) => {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
  });

  /* interaction: drag to rotate, scroll to choreograph */
  let dragging = false;
  let px = 0;
  let py = 0;
  let velX = 0;
  let velY = 0;
  let rotX = 0;
  let rotY = 0;
  addEventListener('pointerdown', (e) => {
    if (e.target === canvas) {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
    }
  });
  addEventListener('pointermove', (e) => {
    if (dragging) {
      velY = (e.clientX - px) * 0.005;
      velX = (e.clientY - py) * 0.004;
      px = e.clientX;
      py = e.clientY;
    }
  });
  addEventListener('pointerup', () => {
    dragging = false;
  });

  let scrollP = 0;
  addEventListener(
    'scroll',
    () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      scrollP = max > 0 ? scrollY / max : 0;
    },
    { passive: true },
  );

  /* finish switcher */
  const byId = new Map(finishes.map((f) => [f.id, f]));
  let tween = 0;
  const setFinish = (id: string) => {
    const f = byId.get(id);
    if (!f) return;
    cancelAnimationFrame(tween);
    const target = new THREE.Color(f.color);
    const from = mat.color.clone();
    const fromMetal = mat.metalness;
    const fromRough = mat.roughness;
    const t0 = performance.now();
    coreMat.color.set(f.accent ?? amber);
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 700);
      const e = 1 - Math.pow(1 - p, 3);
      mat.color.lerpColors(from, target, e);
      mat.metalness = fromMetal + (f.metalness - fromMetal) * e;
      mat.roughness = fromRough + (f.roughness - fromRough) * e;
      mouthMat.color.copy(mat.color);
      mouthMat.metalness = mat.metalness;
      mouthMat.roughness = mat.roughness;
      if (p < 1) tween = requestAnimationFrame(step);
    };
    step(t0);
  };

  const camTarget = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  let t0 = -1;
  rafLoop((t, rawDt) => {
    if (t0 < 0) t0 = t;
    const dt = Math.min(0.05, rawDt);
    if (!dragging) {
      velX *= 0.94;
      velY *= 0.94;
    }
    rotY += velY + (reduced ? 0 : dt * 0.22);
    rotX += velX;
    rotX = Math.max(-0.8, Math.min(0.8, rotX));
    helix.rotation.y = rotY;
    helix.rotation.x = rotX * 0.5;
    core.rotation.copy(helix.rotation);
    mouth.rotation.y += dt * 0.4;
    const k = cameraAt(scrollP);
    camera.position.lerp(camTarget.set(...k.cam), 0.06);
    camera.lookAt(lookTarget.set(...k.look));
    helix.position.y = Math.sin(((t - t0) / 1000) * 0.7) * 0.08;
    core.position.y = helix.position.y;
    renderer.render(scene, camera);
  }).start();

  return { setFinish };
}
