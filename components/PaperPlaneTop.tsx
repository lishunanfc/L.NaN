"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PaperPlaneTop() {
  const [phase, setPhase] = useState<"entering" | "floating">("entering");
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: "18%", right: "12%", width: "130px", height: "130px" }}
      /* 入场：左下 → 右上单段平滑弧线 */
      initial={{
        x: "-88vw",
        y: "75vh",
        rotate: 40,
        opacity: 0,
      }}
      animate={
        phase === "entering"
          ? {
              x: 0,
              y: 0,
              rotate: -20,
              opacity: 1,
              transition: {
                duration: 1.8,
                ease: "easeInOut",
              },
            }
          : {
              /* 悬浮：保持位置 + 缓慢呼吸 */
              x: 0,
              y: [0, -8, 8, 0],
              rotate: [-18, -22, -17, -21, -18],
              opacity: 1,
              transition: {
                x: { duration: 0 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              },
            }
      }
      onAnimationComplete={() => {
        if (phase === "entering") setPhase("floating");
      }}
    >
      {/* 拖尾光效 */}
      <motion.div
        className="absolute"
        style={{
          bottom: "22%",
          left: "-80%",
          width: "220px",
          height: "32px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(196,181,253,0.0) 10%, rgba(196,181,253,0.35) 40%, rgba(168,139,250,0.55) 70%, rgba(196,181,253,0.2) 100%)",
          borderRadius: "50%",
          filter: "blur(10px)",
          transform: "rotate(-8deg)",
        }}
        animate={
          phase === "entering"
            ? { opacity: 0.85, scaleX: 1.2 }
            : { opacity: [0.15, 0.28, 0.15], scaleX: [0.5, 0.65, 0.5] }
        }
        transition={
          phase === "floating"
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : { duration: 1.2, ease: "easeOut" }
        }
      />

      {/* 离散紫色光点（精简到4个，减少动画开销） */}
      {[20, 70, 120, 180].map((x, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            bottom: `${22 + i * 5}%`,
            left: `${-60 + x}%`,
            width: "3px",
            height: "3px",
            background: "rgba(196,181,253,0.55)",
            filter: "blur(1px)",
          }}
          animate={
            phase === "entering"
              ? { opacity: 0.7 }
              : { opacity: [0.12, 0.32, 0.12] }
          }
          transition={{
            duration: phase === "floating" ? 2.5 : 1.5,
            repeat: phase === "floating" ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.12,
          }}
        />
      ))}

      {/* 飞机 SVG — 淡粉→淡紫渐变 + 鼠标触碰旋转 */}
      <motion.div
        className="pointer-events-auto cursor-pointer"
        animate={{ rotate: hovered ? 360 : 0 }}
        transition={
          hovered
            ? { duration: 1.0, ease: "easeInOut" }
            : { duration: 0.4, ease: "easeOut" }
        }
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* 右翼（上）渐变：亮白→粉，模拟右上方来光 */}
            <linearGradient id="rightWingTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--plane-pink-start)" />
              <stop offset="45%" stopColor="var(--plane-pink-mid)" />
              <stop offset="100%" stopColor="var(--plane-pink-end)" />
            </linearGradient>
            {/* 左翼（下）渐变：粉→略暗粉，暗面 */}
            <linearGradient id="leftWingTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--plane-pink-end)" />
              <stop offset="60%" stopColor="var(--plane-pink-dark-mid)" />
              <stop offset="100%" stopColor="var(--plane-pink-dark-end)" />
            </linearGradient>
            {/* 尾翼：薰衣草紫 */}
            <linearGradient id="tailFinTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0CCE0" />
              <stop offset="100%" stopColor="#C8A8C8" />
            </linearGradient>
            <filter id="foldShadowTop">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="rgba(180,120,140,0.22)" />
            </filter>
          </defs>

          {/* 右翼 — 亮面，上方 */}
          <polygon
            points="35,30 165,75 170,160"
            fill="url(#rightWingTop)"
            filter="url(#foldShadowTop)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.8"
          />

          {/* 左翼 — 略暗，下方 */}
          <polygon
            points="35,30 25,145 170,160"
            fill="url(#leftWingTop)"
            filter="url(#foldShadowTop)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.8"
          />

          {/* 尾翼 — 薰衣草小三角 */}
          <polygon
            points="170,160 180,185 155,172"
            fill="url(#tailFinTop)"
            filter="url(#foldShadowTop)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.6"
          />

          {/* 中轴折痕高光 */}
          <line
            x1="35" y1="30" x2="170" y2="160"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.8"
            opacity="0.55"
          />

          {/* 右翼翼根折痕 */}
          <line
            x1="60" y1="125" x2="130" y2="55"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.8"
            opacity="0.45"
          />

          {/* 右翼面高光带 */}
          <line
            x1="55" y1="65" x2="130" y2="120"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
            opacity="0.5"
          />

          {/* 右翼前缘高光 */}
          <line
            x1="35" y1="30" x2="165" y2="75"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            opacity="0.4"
          />

          {/* 左翼前缘高光 */}
          <line
            x1="35" y1="30" x2="25" y2="145"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
            opacity="0.35"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
