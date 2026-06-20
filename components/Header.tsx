"use client";

import { useState, useRef, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAudio } from "./BackgroundAudio";

export default function Header() {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const { isPlaying, isNight, togglePlay } = useAudio();

  /* ── 状态灯点击彩蛋（日夜双轨状态隔离） ── */
  const [dayAligned, setDayAligned] = useState(false);
  const [nightConverged, setNightConverged] = useState(false);
  const [lossDisplay, setLossDisplay] = useState("0.024");
  const [statusAnim, setStatusAnim] = useState<"idle" | "shaking" | "scrambling">("idle");
  const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStatusClick = useCallback(() => {
    if (statusAnim !== "idle") return;

    if (isNight) {
      /* 夜间：Loss 跑数 → 莹蓝收敛 */
      setStatusAnim("scrambling");
      const startTime = Date.now();
      scrambleRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= 800) {
          clearInterval(scrambleRef.current!);
          scrambleRef.current = null;
          setLossDisplay("0.001");
          setNightConverged(true);
          setStatusAnim("idle");
          return;
        }
        const raw = Math.random() * 0.06;
        setLossDisplay(raw.toFixed(4));
      }, 40);
    } else {
      /* 白天：Alignment 对齐 → 专属绿 */
      setStatusAnim("shaking");
      setTimeout(() => {
        setDayAligned(true);
        setStatusAnim("idle");
      }, 500);
    }
  }, [isNight, statusAnim]);

  /* 状态灯文本（日夜双轨） */
  const statusText = (() => {
    if (isNight) {
      return `Loss: ${lossDisplay}`;
    }
    return dayAligned ? "Status: Aligned √" : "Status: Aligning...";
  })();

  /* 文本激活颜色：以当前主题为准，两个状态共存时按主题选 */
  const statusTextStyle: React.CSSProperties = {};
  if (isNight && nightConverged) statusTextStyle.color = "rgba(0, 210, 255, 0.6)";
  else if (!isNight && dayAligned) statusTextStyle.color = "#00E676";

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-10 py-6">
      <div className="flex items-center gap-12">
        <span className="logo-text">L.NaN</span>

        {/* AI 系统运行状态灯 — 可点击跑数彩蛋 */}
        <span
          className={`status-indicator ${statusAnim === "shaking" ? "status-shake" : ""}`}
          onClick={handleStatusClick}
        >
          <span className={`status-dot${!isNight && dayAligned ? " day-aligned" : ""}${isNight && nightConverged ? " night-converged" : ""}`} />
          <span
            className="status-text"
            style={statusTextStyle}
          >
            {statusText}
          </span>
        </span>

        <nav className="flex gap-8">
          <a
            href="https://github.com/lishunanfc"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link relative text-[16px] font-light tracking-[0.12em] cursor-pointer no-underline"
            style={{
              color: "var(--nav-text)",
              fontWeight: "var(--nav-font-weight)",
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
            className="nav-link relative text-[16px] font-light tracking-[0.12em] cursor-pointer no-underline"
            style={{
              color: "var(--nav-text)",
              fontWeight: "var(--nav-font-weight)",
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
        {/* 音频播放/静音按钮 —— 仅夜晚显示 */}
        {isNight && (
          <button
            className="audio-toggle"
            onClick={togglePlay}
            aria-label={isPlaying ? "静音" : "播放背景音乐"}
            title={isPlaying ? "静音" : "播放背景音乐"}
          >
            <span className={`audio-note ${isPlaying ? "playing" : "paused"}`}>
              &#9835;
            </span>
          </button>
        )}

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
