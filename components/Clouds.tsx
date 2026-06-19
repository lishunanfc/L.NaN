"use client";

import { motion } from "framer-motion";

interface CloudProps {
  x: string;
  y: string;
  scale?: number;
  delay?: number;
}

function Cloud({ x, y, scale = 1, delay = 0 }: CloudProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: 200 * scale,
        height: 130 * scale,
        opacity: 0,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        y: [0, -8, 0],
        transition: {
          opacity: { duration: 1.5, delay: delay + 0.8, ease: "easeOut" },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay },
        },
      }}
    >
      {/* 微粒云团——多层半透明圆叠加产生手绘肌理 */}
      <svg
        viewBox="0 0 200 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ filter: "var(--cloud-blur)" }}
      >
        <defs>
          <filter id="cloudTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed={Math.floor(Math.random() * 10)} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="cloudGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="cloudCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--cloud-core-start)" />
            <stop offset="40%" stopColor="var(--cloud-core-mid)" />
            <stop offset="100%" stopColor="rgba(220,200,240,0.0)" />
          </radialGradient>
        </defs>

        {/* 主云体：多层椭圆叠加 */}
        <ellipse cx="60" cy="75" rx="52" ry="38" fill="url(#cloudCore)" filter="url(#cloudTexture)" opacity="var(--cloud-opacity-base)" />
        <ellipse cx="100" cy="60" rx="58" ry="44" fill="url(#cloudCore)" filter="url(#cloudTexture)" opacity="var(--cloud-opacity-base)" />
        <ellipse cx="135" cy="72" rx="48" ry="35" fill="url(#cloudCore)" filter="url(#cloudTexture)" opacity="var(--cloud-opacity-base)" />
        <ellipse cx="80" cy="45" rx="42" ry="30" fill="url(#cloudCore)" filter="url(#cloudTexture)" opacity="var(--cloud-opacity-base)" />
        <ellipse cx="115" cy="42" rx="38" ry="28" fill="url(#cloudCore)" filter="url(#cloudTexture)" opacity="var(--cloud-opacity-base)" />

        {/* 边缘粉紫微光 */}
        <ellipse cx="60" cy="75" rx="54" ry="40" fill="none" stroke="var(--cloud-edge-glow)" strokeWidth="3" filter="url(#cloudGlow)" opacity="0.6" />
        <ellipse cx="100" cy="60" rx="60" ry="46" fill="none" stroke="var(--cloud-edge-glow)" strokeWidth="2.5" filter="url(#cloudGlow)" opacity="0.5" />
        <ellipse cx="135" cy="72" rx="50" ry="37" fill="none" stroke="var(--cloud-edge-glow)" strokeWidth="2" filter="url(#cloudGlow)" opacity="0.45" />

        {/* 微粒点缀 */}
        {[
          [48, 60], [82, 40], [105, 55], [128, 68], [70, 50],
          [95, 70], [115, 38], [140, 62], [55, 72], [88, 65],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={3 + Math.random() * 4}
            fill="var(--cloud-particle)"
            opacity={0.5 + Math.random() * 0.3}
          />
        ))}
      </svg>
    </motion.div>
  );
}

export default function Clouds() {
  return <></>;
}
