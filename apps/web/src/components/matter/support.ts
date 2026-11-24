/**
 * Détection des capacités, isolée du moteur : elle ne charge pas Three.js. Le moteur (≈ 137 Ko compressés)
 * n'est téléchargé que si la scène doit réellement s'animer.
 */
/** Détection prudente : WebGL disponible, pas d'économie de données, mémoire suffisante. */
export function webglSupport(): "high" | "low" | "none" {
  if (typeof window === "undefined") return "none";
  const params = new URLSearchParams(window.location.search);
  if (params.get("webgl") === "0") return "none";
  // Contrôle qualité : forcer la scène même en rendu logiciel
  const forced = params.get("webgl") === "force";
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return "none";
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "none";
    // Rendu logiciel (pas de GPU : SwiftShader, llvmpipe…) : une animation continue saturerait le processeur
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (!forced && /swiftshader|llvmpipe|software|basic render/i.test(renderer)) return "none";
  } catch {
    return "none";
  }
  const lowEnd =
    (nav.deviceMemory !== undefined && nav.deviceMemory < 4) ||
    (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4) ||
    window.matchMedia("(max-width: 767px)").matches;
  return lowEnd ? "low" : "high";
}
