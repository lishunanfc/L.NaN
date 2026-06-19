"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PaperPlane() {
  const [phase, setPhase] = useState<"entering" | "floating">("entering");

  return (
    <motion.div
      className="absolute pointer-events-none z-[5]"
      style={{ top: "47%", left: "calc(50% - 110px)", width: "100px", height: "100px" }}
      /* 入场：从右下飞往左上 */
      initial={{ x: 260, y: 100, opacity: 0 }}
      animate={
        phase === "entering"
          ? {
              x: 0,
              y: 0,
              opacity: 1,
              transition: { duration: 1.8, ease: "easeInOut" },
            }
          : {
              x: 0,
              y: [0, -5, 5, 0],
              opacity: 1,
              transition: {
                x: { duration: 0 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              },
            }
      }
      onAnimationComplete={() => {
        if (phase === "entering") setPhase("floating");
      }}
    >
      {/* ═══════════════════════════════════════════════
           流星/火箭式 金色拖尾
           ═══════════════════════════════════════════════ */}

      {/* 外层尾焰 — 长锥形金色弥散光带 */}
      <motion.div
        className="absolute"
        style={{
          bottom: "15%",
          left: "50%",
          width: "160px",
          height: "50px",
          background:
            "linear-gradient(110deg, transparent 0%, rgba(255,200,80,0.12) 20%, rgba(255,180,60,0.35) 45%, rgba(255,160,40,0.5) 70%, rgba(255,200,100,0.3) 85%, transparent 100%)",
          borderRadius: "50% 30% 40% 60%",
          filter: "blur(18px)",
          transform: "rotate(15deg)",
        }}
        animate={{ opacity: [0.3, 0.55, 0.3], scaleX: [0.85, 1.1, 0.85] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 中层尾焰 — 中长金色核心光带 */}
      <motion.div
        className="absolute"
        style={{
          bottom: "20%",
          left: "55%",
          width: "110px",
          height: "30px",
          background:
            "linear-gradient(110deg, transparent 0%, rgba(255,220,100,0.25) 18%, rgba(255,190,50,0.55) 45%, rgba(255,170,40,0.7) 68%, rgba(255,200,80,0.4) 88%, transparent 100%)",
          borderRadius: "45% 25% 35% 55%",
          filter: "blur(10px)",
          transform: "rotate(12deg)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4], scaleX: [0.9, 1.08, 0.9] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />

      {/* 内层尾焰 — 短而亮的白金光核 */}
      <motion.div
        className="absolute"
        style={{
          bottom: "24%",
          left: "62%",
          width: "55px",
          height: "16px",
          background:
            "linear-gradient(110deg, transparent 0%, rgba(255,240,180,0.5) 20%, rgba(255,220,100,0.8) 50%, rgba(255,200,60,0.6) 80%, transparent 100%)",
          borderRadius: "40% 20% 30% 50%",
          filter: "blur(5px)",
          transform: "rotate(10deg)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5], scaleX: [0.95, 1.05, 0.95] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />

      {/* ── 金色星尘粒子（锥形扩散，近大远小） ── */}
      {Array.from({ length: 45 }).map((_, i) => {
        const t = i / 44; // 0=近飞机, 1=最远
        const spreadAngle = (i % 5 - 2) * 7; // 每5个一组，角度分散
        const baseDist = 55 + t * 120;
        const spreadX = Math.sin((spreadAngle * Math.PI) / 180) * baseDist * 0.25;
        const px = 60 + baseDist * 0.55 + spreadX;
        const py = 30 - baseDist * 0.45 + (i % 3) * 5;
        const size = 2.8 - t * 2.0;
        const alpha = 0.7 - t * 0.55;
        const colors = ["#fff8dc", "#ffd700", "#ffb90f", "#ffa500", "#ff8c00", "#ffd700", "#ffed4a"];
        const color = colors[i % 7];
        return (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${px}%`,
              bottom: `${py}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              boxShadow:
                i % 3 === 0
                  ? `0 0 ${4 + size}px ${size * 0.8}px rgba(255,200,50,${alpha})`
                  : `0 0 ${2 + size * 0.5}px ${size * 0.4}px rgba(255,180,40,${alpha * 0.7})`,
            }}
            animate={{
              opacity: [alpha * 0.5, alpha, alpha * 0.3],
              scale: [0.4, 1.0, 0.3],
            }}
            transition={{
              duration: 1.5 + Math.random() * 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: t * 1.0 + Math.random() * 0.4,
            }}
          />
        );
      })}

      {/* ── 金色拖尾粒子（女孩同款） ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "30%",
          left: "20%",
          width: "80%",
          height: "40%",
          zIndex: -1,
        }}
      >
        {Array.from({ length: 16 }).map((_, i) => {
          const delay = i * 0.15;
          const size = 3 + Math.random() * 6;
          const topOffset = Math.random() * 50;
          const leftStart = 50 + Math.random() * 30;
          return (
            <div
              key={`trail-${i}`}
              style={{
                position: "absolute",
                top: `${topOffset}%`,
                left: `${leftStart}%`,
                width: size,
                height: size * 0.5,
                borderRadius: "50%",
                background: `radial-gradient(ellipse at center, rgba(255,${210 + Math.floor(Math.random() * 40)},${40 + Math.floor(Math.random() * 40)},0.9) 0%, rgba(255,${150 + Math.floor(Math.random() * 80)},20,0) 100%)`,
                boxShadow: `0 0 ${size * 2}px rgba(255,200,40,0.7), 0 0 ${size * 4}px rgba(255,160,20,0.4)`,
                filter: "blur(1px)",
                animation: `planeGoldenTrail ${2.5 + Math.random() * 2}s ease-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* ── 红色折纸飞机（经典对称钻石形） ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: [-18, -22, -14, -18] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="sunsetRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--plane-red-start)" />
              <stop offset="40%" stopColor="var(--plane-red-mid)" />
              <stop offset="100%" stopColor="var(--plane-red-end)" />
            </linearGradient>
            <filter id="pShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="rgba(200,60,40,0.18)" />
            </filter>
          </defs>

          {/* 右翼 — 略暗，表现折叠厚度 */}
          <polygon
            points="40,20 155,115 170,160"
            fill="url(#sunsetRed)"
            filter="url(#pShadow)"
            opacity="0.82"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.6"
          />

          {/* 左翼 — 亮面 */}
          <polygon
            points="40,20 18,128 170,160"
            fill="url(#sunsetRed)"
            filter="url(#pShadow)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.6"
          />

          {/* 中轴折痕高光 */}
          <line
            x1="40" y1="20" x2="170" y2="160"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.8"
            opacity="0.6"
          />

          {/* 翼根折痕 */}
          <line
            x1="62" y1="122" x2="128" y2="58"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.8"
            opacity="0.4"
          />

          {/* 左翼前缘高光 */}
          <line
            x1="40" y1="20" x2="18" y2="128"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* 右翼前缘高光 */}
          <line
            x1="40" y1="20" x2="155" y2="115"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      <style>{`
        @keyframes planeGoldenTrail {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          60% {
            opacity: 0.4;
            transform: translate(-25px, -10px) scale(0.4);
          }
          100% {
            opacity: 0;
            transform: translate(-50px, -5px) scale(0.08);
          }
        }
      `}</style>
    </motion.div>
  );
}
