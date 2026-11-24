import {
  Color,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { MATERIALS, type MaterialParams, type TextureKey } from "./textures";

/**
 * Moteur de la scène « matière » : une goutte de matière cosmétique déformée par un bruit organique,
 * éclairée par un studio procédural (aucune texture à télécharger). Sans dépendance à React.
 */

const noise = /* glsl */ `
// Simplex 3D — Ian McEwan, Ashima Arts (licence MIT).
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uRidges;
uniform vec3 uPointer;
uniform float uPointerStrength;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vDisp;
${noise}

float displacement(vec3 p){
  // Ondulation ample et lente (une matière, pas une surface froissée)
  float n = snoise(p * uFreq + vec3(0.0, uTime * 0.5, uTime * 0.3)) * 0.78;
  n += snoise(p * uFreq * 1.9 - vec3(uTime * 0.35)) * 0.16;
  // Stries de crème fouettée : sillons fins qui tournent autour de l'axe vertical
  float swirl = sin(atan(p.z, p.x) * 6.0 + p.y * 5.0 + n * 2.0 + uTime * 0.5);
  float r = uRidges * 0.028 * swirl * (1.0 - abs(p.y));
  // Attraction douce vers le pointeur
  float d = distance(normalize(p), normalize(uPointer));
  float bulge = uPointerStrength * exp(-d * d * 5.0) * 0.2;
  return n * uAmp + r + bulge;
}

void main(){
  vec3 p = position;
  vec3 n = normalize(normal);
  vec3 tangent = normalize(cross(n, abs(n.y) > 0.9 ? vec3(1.0,0.0,0.0) : vec3(0.0,1.0,0.0)));
  vec3 bitangent = normalize(cross(n, tangent));
  float eps = 0.012;
  float d0 = displacement(p);
  vec3 p0 = p + n * d0;
  vec3 p1 = (p + tangent * eps); p1 += normalize(p1) * displacement(p1);
  vec3 p2 = (p + bitangent * eps); p2 += normalize(p2) * displacement(p2);
  vec3 displacedNormal = normalize(cross(p1 - p0, p2 - p0));
  if (dot(displacedNormal, n) < 0.0) displacedNormal = -displacedNormal;
  vDisp = d0;
  vec4 world = modelMatrix * vec4(p0, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * displacedNormal);
  vViewDir = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uRim;
uniform vec3 uDeep;
uniform float uClarity;
uniform float uGloss;
uniform float uIridescence;
uniform float uTime;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vDisp;

// Studio procédural : deux boîtes à lumière aux bords nets (reflets « photo produit ») et un sol sombre.
vec3 studio(vec3 r){
  float sky = smoothstep(-0.5, 0.9, r.y);
  vec3 env = mix(vec3(0.02, 0.07, 0.07), vec3(0.42, 0.5, 0.49), sky);
  float key = dot(r, normalize(vec3(-0.6, 0.62, 0.5)));
  env += vec3(2.6) * smoothstep(0.93, 0.965, key);
  env += vec3(0.6) * pow(max(key, 0.0), 6.0);
  float fill = dot(r, normalize(vec3(0.85, 0.15, 0.5)));
  env += vec3(1.3, 1.35, 1.3) * smoothstep(0.955, 0.985, fill);
  float bounce = dot(r, normalize(vec3(0.1, -0.8, 0.5)));
  env += vec3(0.9, 0.75, 0.5) * 0.35 * pow(max(bounce, 0.0), 4.0);
  return env;
}

void main(){
  vec3 n = normalize(vNormalW);
  vec3 v = normalize(vViewDir);
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  float fresnel = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);

  vec3 r = reflect(-v, n);
  vec3 reflection = studio(r);

  vec3 l = normalize(vec3(-0.5, 0.75, 0.6));
  vec3 h = normalize(l + v);
  float spec = pow(max(dot(n, h), 0.0), 220.0) * 3.0 + pow(max(dot(n, h), 0.0), 30.0) * 0.25;

  // Transmission simulée : le cœur laisse passer la lumière, les bords s'assombrissent (épaisseur)
  vec3 refr = refract(-v, n, 0.72);
  float back = pow(max(dot(refr, normalize(vec3(0.2, -0.9, -0.3))), 0.0), 2.0);
  vec3 trans = mix(uDeep, uBase, smoothstep(0.0, 0.9, ndv));
  trans += uBase * back * 0.8 + uRim * 0.25 * pow(ndv, 6.0);

  // Matière opaque : diffusion enveloppante, sous-surface chaude (crème, perle)
  float wrap = clamp((dot(n, l) + 0.5) / 1.5, 0.0, 1.0);
  vec3 milky = uBase * (0.38 + 0.72 * wrap) + mix(uDeep, uRim, 0.5) * 0.18 * pow(1.0 - ndv, 2.0);

  vec3 body = mix(milky, trans, uClarity);

  // Irisation en couches minces, concentrée sur les bords
  vec3 film = 0.5 + 0.5 * cos(6.2831 * (pow(1.0 - ndv, 1.5) * 1.3 + vDisp * 1.6 + vec3(0.0, 0.33, 0.67)));
  body = mix(body, body * 0.7 + film * 0.5, uIridescence * pow(1.0 - ndv, 1.2));

  vec3 color = body * (1.0 - fresnel * 0.6) + reflection * fresnel * uGloss + vec3(spec) * uGloss;
  color += uRim * 0.12 * pow(1.0 - ndv, 3.0);

  // Tonalité filmique (ACES approché) et passage en sRGB
  color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);
  color = pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.2));
  gl_FragColor = vec4(color, 1.0);
}
`;

export interface EngineOptions {
  texture: TextureKey;
  /** Image fixe (capture des visuels de repli) : temps figé, aucune animation. */
  still?: boolean;
  quality?: "high" | "low";
  onFirstFrame?: () => void;
  onFailure?: () => void;
}

type UniformKey = "uBase" | "uRim" | "uDeep" | "uClarity" | "uGloss" | "uIridescence" | "uAmp" | "uFreq" | "uRidges";

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export class MatterEngine {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(32, 1, 0.1, 50);
  private material: ShaderMaterial;
  private blob: Mesh;
  private droplets: Mesh[] = [];
  private last = 0;
  private raf = 0;
  private running = false;
  private disposed = false;
  private time = 0;
  private speed: number;
  private pointer = new Vector2(0, 0);
  private pointerTarget = new Vector2(0, 0);
  private pointerStrength = 0;
  private pointerStrengthTarget = 0;
  private scroll = 0;
  private from: MaterialParams;
  private to: MaterialParams;
  private mix = 1;
  private frameTimes: number[] = [];
  private firstFrame = false;
  private resizeObserver: ResizeObserver;

  constructor(
    private canvas: HTMLCanvasElement,
    private options: EngineOptions,
  ) {
    const quality = options.quality ?? "high";
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: quality === "high",
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: Boolean(options.still),
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    const maxDpr = quality === "high" ? 1.75 : 1.25;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));

    const params = MATERIALS[options.texture];
    this.from = params;
    this.to = params;
    this.speed = params.speed;

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBase: { value: new Color(params.base) },
        uRim: { value: new Color(params.rim) },
        uDeep: { value: new Color(params.deep) },
        uClarity: { value: params.clarity },
        uGloss: { value: params.gloss },
        uIridescence: { value: params.iridescence },
        uAmp: { value: params.amp },
        uFreq: { value: params.freq },
        uRidges: { value: params.ridges },
        uPointer: { value: new Vector3(0, 0, 1) },
        uPointerStrength: { value: 0 },
      },
    });

    const detail = quality === "high" ? 72 : 36;
    this.blob = new Mesh(new IcosahedronGeometry(1, detail), this.material);
    this.scene.add(this.blob);

    // Trois gouttelettes satellites : profondeur et échelle
    const dropletGeometry = new IcosahedronGeometry(1, quality === "high" ? 24 : 12);
    const placements: Array<[number, number, number, number]> = [
      [1.55, 0.75, -0.6, 0.15],
      [-1.45, -0.85, 0.2, 0.1],
      [1.1, -1.15, 0.5, 0.065],
    ];
    for (const [x, y, z, s] of placements) {
      const drop = new Mesh(dropletGeometry, this.material);
      drop.position.set(x, y, z);
      drop.scale.setScalar(s);
      drop.userData.base = new Vector3(x, y, z);
      this.droplets.push(drop);
      this.scene.add(drop);
    }

    this.camera.position.set(0, 0, 6.2);
    this.camera.lookAt(0, 0, 0);

    canvas.addEventListener("webglcontextlost", this.handleContextLost, false);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();

    if (options.still) {
      this.time = 3.2;
      this.renderFrame(0);
    }
  }

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.stop();
    this.options.onFailure?.();
  };

  resize() {
    const { clientWidth: w, clientHeight: h } = this.canvas;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Garder la goutte entière quel que soit le cadrage (portrait sur mobile)
    const fit = w / h < 0.8 ? 7.6 : 6.2;
    this.camera.position.z = fit;
    this.camera.updateProjectionMatrix();
    if (!this.running) this.renderFrame(0);
  }

  setTexture(key: TextureKey) {
    const target = MATERIALS[key];
    if (target === this.to) return;
    // Repartir de l'état actuellement affiché
    this.from = this.currentParams();
    this.to = target;
    this.mix = 0;
    if (!this.running) {
      this.mix = 1;
      this.applyParams(target);
      this.renderFrame(0);
    }
  }

  /** Position du pointeur normalisée (-1..1) dans le cadre de la scène. */
  setPointer(x: number, y: number, active: boolean) {
    this.pointerTarget.set(x, y);
    this.pointerStrengthTarget = active ? 1 : 0;
  }

  /** Progression de défilement de la section (0..1) : rotation lente. */
  setScroll(progress: number) {
    this.scroll = progress;
  }

  start() {
    if (this.running || this.disposed || this.options.still) return;
    this.running = true;
    this.last = performance.now();
    const loop = () => {
      if (!this.running) return;
      const now = performance.now();
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.renderFrame(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.stop();
    this.disposed = true;
    this.resizeObserver.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.handleContextLost);
    this.blob.geometry.dispose();
    this.droplets[0]?.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }

  private currentParams(): MaterialParams {
    const u = this.material.uniforms;
    const hex = (k: UniformKey) => `#${(u[k]!.value as Color).getHexString()}`;
    return {
      base: hex("uBase"),
      rim: hex("uRim"),
      deep: hex("uDeep"),
      clarity: u.uClarity!.value as number,
      gloss: u.uGloss!.value as number,
      iridescence: u.uIridescence!.value as number,
      amp: u.uAmp!.value as number,
      freq: u.uFreq!.value as number,
      speed: this.speed,
      ridges: u.uRidges!.value as number,
    };
  }

  private applyParams(p: MaterialParams) {
    const u = this.material.uniforms;
    (u.uBase!.value as Color).set(p.base);
    (u.uRim!.value as Color).set(p.rim);
    (u.uDeep!.value as Color).set(p.deep);
    u.uClarity!.value = p.clarity;
    u.uGloss!.value = p.gloss;
    u.uIridescence!.value = p.iridescence;
    u.uAmp!.value = p.amp;
    u.uFreq!.value = p.freq;
    u.uRidges!.value = p.ridges;
    this.speed = p.speed;
  }

  private blendParams(t: number) {
    const k = easeInOut(t);
    const a = this.from;
    const b = this.to;
    const u = this.material.uniforms;
    (u.uBase!.value as Color).set(a.base).lerp(new Color(b.base), k);
    (u.uRim!.value as Color).set(a.rim).lerp(new Color(b.rim), k);
    (u.uDeep!.value as Color).set(a.deep).lerp(new Color(b.deep), k);
    const lerp = (x: number, y: number) => x + (y - x) * k;
    u.uClarity!.value = lerp(a.clarity, b.clarity);
    u.uGloss!.value = lerp(a.gloss, b.gloss);
    u.uIridescence!.value = lerp(a.iridescence, b.iridescence);
    // La matière « se liquéfie » pendant la transition puis se repose
    u.uAmp!.value = lerp(a.amp, b.amp) + Math.sin(k * Math.PI) * 0.12;
    u.uFreq!.value = lerp(a.freq, b.freq);
    u.uRidges!.value = lerp(a.ridges, b.ridges);
    this.speed = lerp(a.speed, b.speed);
  }

  private renderFrame(dt: number) {
    const started = performance.now();
    if (this.mix < 1) {
      this.mix = Math.min(1, this.mix + dt / 1.3);
      this.blendParams(this.mix);
    }
    this.time += dt * this.speed * 2.2;
    this.pointer.lerp(this.pointerTarget, 0.06);
    this.pointerStrength += (this.pointerStrengthTarget - this.pointerStrength) * 0.05;

    const u = this.material.uniforms;
    u.uTime!.value = this.time;
    (u.uPointer!.value as Vector3).set(this.pointer.x * 1.2, this.pointer.y * 1.2, 1).normalize();
    u.uPointerStrength!.value = this.pointerStrength;

    this.blob.rotation.y = this.time * 0.12 + this.pointer.x * 0.35 + this.scroll * 1.2;
    this.blob.rotation.x = Math.sin(this.time * 0.1) * 0.15 - this.pointer.y * 0.25;
    this.droplets.forEach((drop, i) => {
      const base = drop.userData.base as Vector3;
      drop.position.y = base.y + Math.sin(this.time * 0.5 + i * 2.1) * 0.12 - this.scroll * 0.4 * (i + 1) * 0.3;
      drop.position.x = base.x + Math.cos(this.time * 0.35 + i) * 0.06;
    });

    this.renderer.render(this.scene, this.camera);

    if (!this.firstFrame) {
      this.firstFrame = true;
      this.options.onFirstFrame?.();
    }
    if (this.running) this.watchPerformance(performance.now() - started, dt);
  }

  /** Qualité adaptative : si la fréquence d'images s'effondre, réduire la résolution puis figer la scène. */
  private watchPerformance(_cpuMs: number, dt: number) {
    if (dt <= 0) return;
    this.frameTimes.push(dt);
    if (this.frameTimes.length < 90) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.frameTimes = [];
    if (avg > 1 / 30) {
      const ratio = this.renderer.getPixelRatio();
      if (ratio > 1) {
        this.renderer.setPixelRatio(1);
        this.resize();
      } else if (avg > 1 / 20) {
        // Appareil trop lent : on fige l'image (le visuel reste, l'animation s'arrête)
        this.stop();
      }
    }
  }
}

/** Détection prudente : WebGL disponible, pas d'économie de données, mémoire suffisante. */
export function webglSupport(): "high" | "low" | "none" {
  if (typeof window === "undefined") return "none";
  const params = new URLSearchParams(window.location.search);
  if (params.get("webgl") === "0") return "none";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return "none";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return "none";
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return "none";
  }
  const lowEnd =
    (nav.deviceMemory !== undefined && nav.deviceMemory < 4) ||
    (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4) ||
    window.matchMedia("(max-width: 767px)").matches;
  return lowEnd ? "low" : "high";
}
