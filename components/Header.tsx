"use client";

import { useState, useRef } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-10 py-6">
      <div className="flex items-center gap-12">
        <span
          className="text-sm font-medium tracking-[0.25em]"
          style={{ color: "var(--text-muted)" }}
        >
          L.NaN
        </span>
        <nav className="flex gap-8">
          <a
            href="https://github.com/lishunanfc"
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-[13px] font-light tracking-[0.12em] cursor-pointer no-underline"
            style={{
              color: "var(--nav-text)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "var(--nav-hover)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "var(--nav-text)";
            }}
          >
            实验室
          </a>
          <a
            href="https://www.woshipm.com/u/1681210"
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-[13px] font-light tracking-[0.12em] cursor-pointer no-underline"
            style={{
              color: "var(--nav-text)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "var(--nav-hover)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "var(--nav-text)";
            }}
          >
            行业观察
          </a>
        </nav>
      </div>

      <div className="relative flex items-center">
        {/* 日夜切换按钮 */}
        <ThemeToggle />

        <button
          ref={btnRef}
          className="btn-outline cursor-pointer relative z-10"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          丢个纸条
        </button>

        {/* 二维码气泡 */}
        <div
          ref={bubbleRef}
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "calc(100% + 14px)",
            width: 200,
            marginLeft: -100,
            opacity: hovered ? 1 : 0,
            transform: hovered
              ? "translateY(0) scale(1)"
              : "translateY(6px) scale(0.96)",
            transition: hovered
              ? "opacity 0.25s ease-out, transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)"
              : "opacity 0.15s ease-in, transform 0.15s ease-in",
          }}
        >
          {/* 尖角 */}
          <div
            className="absolute left-1/2"
            style={{
              top: -7,
              marginLeft: -8,
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid rgba(50, 30, 80, 0.45)",
              filter: "drop-shadow(0 -1px 2px rgba(0,0,0,0.08))",
            }}
          />

          {/* 气泡主体 */}
          <div
            style={{
              padding: "16px",
              background: "var(--bubble-bg)",
              backdropFilter: "blur(20px) saturate(1.6)",
              WebkitBackdropFilter: "blur(20px) saturate(1.6)",
              border: "1px solid var(--bubble-border)",
              borderRadius: 14,
              boxShadow:
                "0 8px 32px rgba(60,30,100,0.2), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ width: 168, height: 168, position: "relative" }}>
              {/* 日景二维码 */}
              <img
                src="/wechat-qr.jpg"
                alt="微信二维码"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "var(--qr-day-display)",
                  borderRadius: 8,
                } as React.CSSProperties}
              />
              {/* 夜景二维码 */}
              <img
                src="/qrcode-night.png"
                alt="微信二维码"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "var(--qr-night-display)",
                  borderRadius: 8,
                } as React.CSSProperties}
              />
            </div>
            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                fontSize: 12,
                letterSpacing: "0.12em",
                color: "var(--bubble-text)",
                textAlign: "center",
              }}
            >
              微信扫一扫
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
