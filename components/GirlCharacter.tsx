"use client";

import { useEffect, useRef, useState } from "react";

const NOISE_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.55"/></svg>`
)}`;

export default function GirlCharacter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const [shadowDarken, setShadowDarken] = useState(1);
  const [charLift, setCharLift] = useState(false);

  useEffect(() => {
    let rafId: number;
    let targetDarken = 1;
    let targetLift = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!charRef.current) return;
      const rect = charRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= 300) {
        const t = 1 - distance / 300;
        targetDarken = 1 - t * t * 0.25;
      } else {
        targetDarken = 1;
      }

      targetLift =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    };

    const animate = () => {
      setShadowDarken((prev) =>
        prev + (targetDarken - prev) * 0.14
      );
      setCharLift(targetLift);
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none select-none"
      style={{
        right: "-2%",
        bottom: "3%",
        width: "42%",
        maxWidth: 633,
        zIndex: 5,
        transformOrigin: "bottom center",
        animation: "windSway 3.6s ease-in-out infinite",
      }}
    >
      {/* ── Ground Shadow ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-3%",
          width: "44%",
          transform: "translateX(-50%)",
          filter: `brightness(${shadowDarken})`,
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            animation: "shadowBreathe 3.5s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        >
          {/* dark elliptical shadow */}
          <div
            style={{
              width: "100%",
              paddingBottom: "11%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(42,31,29,0.42) 0%, rgba(42,31,29,0.22) 40%, rgba(42,31,29,0.06) 75%, transparent 100%)",
              filter: "blur(10px)",
            }}
          />
          {/* grain texture overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              opacity: 0.11,
              mixBlendMode: "overlay",
              backgroundImage: `url("${NOISE_SVG}")`,
              backgroundSize: "100px 100px",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* ── Character ── */}
      <div
        ref={charRef}
        style={{
          position: "relative",
          width: "100%",
          filter:
            "drop-shadow(0 0 18px var(--girl-glow-1)) drop-shadow(0 0 45px var(--girl-glow-2)) drop-shadow(0 0 90px var(--girl-glow-3)) drop-shadow(0 0 140px var(--girl-glow-4)) drop-shadow(0 8px 30px var(--girl-shadow))",
          transform: charLift ? "translateY(-3px)" : "translateY(0)",
          transition:
            "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: "auto",
          willChange: "transform",
        }}
      >
        <img
          src="/girl.png"
          alt=""
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            imageRendering: "auto",
            clipPath:
              "polygon(0% 0%, 100% 0%, 98% 100%, 50% 96%, 2% 100%)",
            animation: "skirtWave 2.4s ease-in-out infinite alternate",
          }}
        />
      </div>

      <style>{`
        @keyframes windSway {
          0%, 100% { transform: rotate(-0.8deg) skewX(-0.4deg); }
          25%      { transform: rotate(0.6deg) skewX(0.2deg);  }
          50%      { transform: rotate(-0.4deg) skewX(-0.6deg); }
          75%      { transform: rotate(0.8deg) skewX(0.3deg);  }
        }

        @keyframes skirtWave {
          0%   { clip-path: polygon(0% 0%, 100% 0%, 98% 100%, 50% 96%, 2% 100%); }
          25%  { clip-path: polygon(0% 0%, 100% 0%, 97% 98%, 48% 100%, 1% 98%);  }
          50%  { clip-path: polygon(0% 0%, 100% 0%, 99% 100%, 52% 95%, 3% 100%);  }
          75%  { clip-path: polygon(0% 0%, 100% 0%, 96% 99%, 50% 97%, 1% 99%);   }
          100% { clip-path: polygon(0% 0%, 100% 0%, 98% 100%, 50% 96%, 2% 100%); }
        }

        @keyframes shadowBreathe {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%      { transform: scale(1.05); opacity: 1;    }
        }
      `}</style>
    </div>
  );
}
