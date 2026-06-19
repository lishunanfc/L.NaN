"use client";

import { motion } from "framer-motion";

export default function Prism() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: "10%", right: "10%", width: "140px", height: "140px" }}
      initial={{ opacity: 0, rotate: 0 }}
      animate={{
        opacity: 1,
        rotate: [0, 8, -4, 0],
        transition: {
          opacity: { duration: 1.2, delay: 1.5, ease: "easeOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        },
      }}
    >
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          {/* 三角面 A — 亮紫 */}
          <linearGradient id="prismA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(196,181,253,0.55)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.28)" />
          </linearGradient>
          {/* 三角面 B — 半透明粉紫 */}
          <linearGradient id="prismB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(216,180,254,0.4)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.2)" />
          </linearGradient>
          {/* 三角面 C — 底部暗紫 */}
          <linearGradient id="prismC" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(124,58,237,0.25)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.35)" />
          </linearGradient>
          {/* 棱线光晕 */}
          <filter id="prismGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 左三角面 */}
        <polygon
          points="60,15 20,105 60,90"
          fill="url(#prismA)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.6"
        />
        {/* 右三角面 */}
        <polygon
          points="60,15 60,90 100,105"
          fill="url(#prismB)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.6"
        />
        {/* 底部三角面 */}
        <polygon
          points="20,105 60,90 100,105"
          fill="url(#prismC)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />

        {/* 棱线高光 */}
        <line x1="60" y1="15" x2="60" y2="90" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" filter="url(#prismGlow)" />
        <line x1="60" y1="15" x2="20" y2="105" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
        <line x1="60" y1="15" x2="100" y2="105" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      </svg>

      {/* 辉光晕 */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "140%",
          height: "140%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,181,253,0.18) 0%, transparent 65%)",
          filter: "blur(20px)",
        }}
      />
    </motion.div>
  );
}
