"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ShaderMaterial,
  SphereGeometry,
  Group,
} from "three";

/* ───────────────────────────────────────────
   模块级材质注册表（主题切换时批量更新 uniforms）
   ─────────────────────────────────────────── */
const _materials = new Set<ShaderMaterial>();

function isDarkTheme(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function applyThemeToMaterial(mat: ShaderMaterial) {
  const dark = isDarkTheme();
  mat.uniforms.uOpacity.value = dark ? 0.16 : 0.22;
  mat.uniforms.uHueShift.value = dark ? 0.55 : 0.0;
  mat.uniforms.uEdgeSoftness.value = dark ? 0.35 : 0.20;
  mat.uniforms.uHueSpread.value = dark ? 2.0 : 3.5;
}

function updateAllMaterials() {
  _materials.forEach(applyThemeToMaterial);
}

/* ───────────────────────────────────────────
   Shaders
   ─────────────────────────────────────────── */
const BUBBLE_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const BUBBLE_FRAGMENT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;

uniform float uTime;
uniform float uOpacity;
uniform float uHueShift;
uniform float uEdgeSoftness;
uniform float uHueSpread;
uniform float uOpacityScale;

vec3 hsl2rgb(float h, float s, float l) {
  vec3 rgb = clamp(
    abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
    0.0, 1.0
  );
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);

  float fresnel = 1.0 - abs(dot(viewDir, normal));
  fresnel = pow(fresnel, 1.25);

  float hue = fract(fresnel * uHueSpread + uTime * 0.025 + uHueShift);
  float saturation = 0.72 + fresnel * 0.22;
  float lightness = 0.52 + fresnel * 0.16;

  vec3 color = hsl2rgb(hue, saturation, lightness);

  float alpha = smoothstep(0.0, uEdgeSoftness, fresnel) * uOpacity * uOpacityScale;
  alpha += 0.025 * uOpacity;

  gl_FragColor = vec4(color, alpha);
}
`;

/* ───────────────────────────────────────────
   泡泡定义
   ─────────────────────────────────────────── */
interface BubbleDef {
  radius: number;
  posX: number;
  posY: number;
  posZ: number;
  animated: boolean;
  entranceDelay: number;
  floatAmp: number;
  floatSpeed: number;
  opacityScale?: number;
}

const BUBBLE_DEFS: BubbleDef[] = [
  { radius: 1.575, posX: -5.2, posY: -2.5, posZ: -0.2, animated: true,  entranceDelay: 0.3, floatAmp: 0.35, floatSpeed: 0.65, opacityScale: 0.82 },
  { radius: 1.425, posX: -2.0, posY: 0.2,  posZ:  0.3, animated: true,  entranceDelay: 1.0, floatAmp: 0.40, floatSpeed: 0.52 },
  { radius: 0.975, posX: 1.5,  posY: 3.2,  posZ:  0.1, animated: true,  entranceDelay: 0.08, floatAmp: 0.30, floatSpeed: 0.75 },
  { radius: 1.2,   posX: 3.0,  posY: 2.0,  posZ: -0.3, animated: true,  entranceDelay: 0.05, floatAmp: 0.35, floatSpeed: 0.58 },
  { radius: 1.125, posX: 2.0,  posY: 1.2,  posZ:  0.5, animated: true,  entranceDelay: 0.03, floatAmp: 0.38, floatSpeed: 0.70 },
];

/* ───────────────────────────────────────────
   单个泡泡
   ─────────────────────────────────────────── */
function Bubble({ def }: { def: BubbleDef }) {
  const groupRef = useRef<Group>(null);
  const startTime = useRef(Date.now() * 0.001);

  const geometry = useMemo(() => new SphereGeometry(def.radius, 64, 48), [def.radius]);
  const material = useMemo(() => {
    const mat = new ShaderMaterial({
      vertexShader: BUBBLE_VERTEX,
      fragmentShader: BUBBLE_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.22 },
        uHueShift: { value: 0.0 },
        uEdgeSoftness: { value: 0.20 },
        uHueSpread: { value: 3.5 },
        uOpacityScale: { value: def.opacityScale ?? 1.0 },
      },
      transparent: true,
      depthWrite: false,
    });
    applyThemeToMaterial(mat);
    _materials.add(mat);
    return mat;
  }, []);

  useEffect(() => {
    return () => {
      _materials.delete(material);
      material.dispose();
    };
  }, [material]);

  useFrame(() => {
    const elapsed = Date.now() * 0.001 - startTime.current;
    const grp = groupRef.current;
    if (!grp) return;

    material.uniforms.uTime.value = elapsed;

    let scale: number;
    if (def.animated) {
      if (elapsed >= def.entranceDelay) {
        const t = Math.min((elapsed - def.entranceDelay) / 2.0, 1.0);
        scale = 1 - (1 - t) ** 3;
      } else {
        scale = 0;
      }
    } else {
      scale = 1;
    }

    const floatY = Math.sin(elapsed * def.floatSpeed) * def.floatAmp;
    grp.position.y = def.posY + floatY;
    grp.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={[def.posX, def.posY, def.posZ]}>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}

/* ───────────────────────────────────────────
   场景
   ─────────────────────────────────────────── */
function BubbleScene() {
  return (
    <>
      {BUBBLE_DEFS.map((def, i) => (
        <Bubble key={i} def={def} />
      ))}
    </>
  );
}

/* ───────────────────────────────────────────
   导出组件
   ─────────────────────────────────────────── */
export default function ThreeClouds() {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          requestAnimationFrame(() => updateAllMaterials());
          break;
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ pointerEvents: "none" as React.CSSProperties["pointerEvents"] }}
    >
      <Canvas
        camera={{ position: [0, 1.5, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: "none" }}
      >
        <BubbleScene />
      </Canvas>
    </div>
  );
}
