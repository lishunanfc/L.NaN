"use client";

import { useMemo } from "react";

/**
 * SkyBackground —— 全屏天空背景
 *
 * 日夜模式适配：所有颜色均通过 CSS 变量注入。
 * L1 主渐变 → L2 弥散光源 → L3 星空（仅夜间）→ L4 大云朵 → 月亮（仅夜间）→ L6 胶片颗粒
 */
export default function SkyBackground() {
  const twinklingStars = useMemo(() => {
    const arr: { x: number; y: number; size: number; baseOpacity: number; duration: number; delay: number }[] = [];
    for (let i = 0; i < 70; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 55,
        size: Math.random() * 2 + 1,
        baseOpacity: Math.random() * 0.4 + 0.3,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 4,
      });
    }
    return arr;
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* ── SVG 滤镜库 ── */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="filmGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0.3 0.3 0.3 0 0  0.3 0.3 0.3 0 0  0.3 0.3 0.3 0 0  0 0 0 0.8 0" />
          </filter>
        </defs>
      </svg>

      {/* ═══════════════════════════════════════════════════
           L1 — 主渐变（9 色标，通过 @property 平滑过渡）
           ═══════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--sky-c1) 0%, var(--sky-c2) 16%, var(--sky-c3) 30%, var(--sky-c4) 38%, var(--sky-c5) 48%, var(--sky-c6) 56%, var(--sky-c7) 62%, var(--sky-c8) 80%, var(--sky-c9) 100%)",
          transition:
            "--sky-c1 0.5s ease-in-out, --sky-c2 0.5s ease-in-out, --sky-c3 0.5s ease-in-out, --sky-c4 0.5s ease-in-out, --sky-c5 0.5s ease-in-out, --sky-c6 0.5s ease-in-out, --sky-c7 0.5s ease-in-out, --sky-c8 0.5s ease-in-out, --sky-c9 0.5s ease-in-out",
        }}
      />

      {/* ═══════════════════════════════════════════════════
           闪烁星点 — 上半区域白色闪烁星点（仅夜间可见）
           ═══════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          display: "var(--twinkling-stars-display)",
          maskImage: "linear-gradient(to bottom, transparent 0px, transparent 80px, black 80px, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, transparent 80px, black 80px, black 100%)",
        }}
      >
        {twinklingStars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: "#ffffff",
              opacity: s.baseOpacity,
              animation: `twinkle ${s.duration}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
              ["--twinkle-from" as string]: String(s.baseOpacity),
              ["--twinkle-to" as string]: String(Math.min(s.baseOpacity + 0.35, 1)),
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
           L2 — 弥散光源（使用 CSS 变量，配合 blur 掩盖渐变切换）
           ═══════════════════════════════════════════════════ */}

      {/* 左侧 — 柔珊瑚橙光 / 暗蓝光 */}
      <div
        className="absolute"
        style={{
          left: "-6%",
          top: "20%",
          width: "42%",
          height: "55%",
          background:
            "radial-gradient(ellipse 40% 55% at 12% 50%, var(--glow-left-start) 0%, var(--glow-left-mid) 22%, var(--glow-left-end) 48%, transparent 76%)",
          filter: "blur(44px)",
        }}
      />

      {/* 右侧 — 柔珊瑚橙光 / 暗蓝光 */}
      <div
        className="absolute"
        style={{
          right: "-6%",
          top: "20%",
          width: "42%",
          height: "55%",
          background:
            "radial-gradient(ellipse 40% 55% at 88% 50%, var(--glow-right-start) 0%, var(--glow-right-mid) 22%, var(--glow-right-end) 48%, transparent 76%)",
          filter: "blur(44px)",
        }}
      />

      {/* 中上部 — 暖粉金 / 冷蓝微光 */}
      <div
        className="absolute"
        style={{
          left: "20%",
          top: "18%",
          width: "60%",
          height: "45%",
          background:
            "radial-gradient(ellipse 55% 45% at 50% 40%, var(--glow-ct-start) 0%, var(--glow-ct-mid) 30%, var(--glow-ct-end) 58%, transparent 80%)",
          filter: "blur(50px)",
        }}
      />

      {/* 中下部 — 金黄底光 / 暗蓝微光 */}
      <div
        className="absolute"
        style={{
          left: "8%",
          bottom: "0%",
          width: "84%",
          height: "50%",
          background:
            "radial-gradient(ellipse 65% 50% at 50% 78%, var(--glow-cb-start) 0%, var(--glow-cb-mid) 28%, var(--glow-cb-end) 52%, transparent 78%)",
          filter: "blur(42px)",
        }}
      />

      {/* 顶部 — 紫罗兰微光 / 暗蓝紫微光 */}
      <div
        className="absolute"
        style={{
          left: "12%",
          top: "0%",
          width: "76%",
          height: "35%",
          background:
            "radial-gradient(ellipse 60% 45% at 50% 20%, var(--glow-purple-start) 0%, var(--glow-purple-mid) 30%, var(--glow-purple-end) 55%, transparent 78%)",
          filter: "blur(40px)",
        }}
      />

      {/* ═══════════════════════════════════════════════════
           封面云层（CSS 变量：light 暖白 → dark 暗蓝半透明）
           ═══════════════════════════════════════════════════ */}



      {/* ═══════════════════════════════════════════════════
           L6 — 胶片颗粒
           ═══════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `rgba(128,128,128,var(--grain-opacity))`,
          filter: "url(#filmGrain)",
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 42%, transparent 0%, transparent 18%, rgba(0,0,0,0.04) 32%, rgba(0,0,0,0.25) 52%, rgba(0,0,0,0.65) 74%, rgba(0,0,0,1) 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 42%, transparent 0%, transparent 18%, rgba(0,0,0,0.04) 32%, rgba(0,0,0,0.25) 52%, rgba(0,0,0,0.65) 74%, rgba(0,0,0,1) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
