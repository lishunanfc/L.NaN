"use client";

import { useEffect, useState, useCallback } from "react";

/* ── 8 条射线角度 ── */
const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * ThemeToggle —— 右上角日/夜切换按钮
 *
 * 逻辑：
 * 1. 初始化时读取 data-theme（已被防闪烁脚本设置好）
 * 2. 点击切换 → 写入 localStorage + 更新 data-theme
 * 3. 始终监听系统偏好变化（matchMedia），当用户未手动设置时自动跟随
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /* ── 初始化：从 <html data-theme> 读取 ── */
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") as
      | "light"
      | "dark"
      | null;
    if (current === "light" || current === "dark") {
      setTheme(current);
    }

    /* 监听系统偏好变化（仅当用户未手动设置时才生效） */
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        const next = e.matches ? "dark" : "light";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
      }
    };
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  /* ── 切换 ── */
  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "切换到夜间模式" : "切换到日间模式"}
      title={theme === "light" ? "切换到夜间模式" : "切换到日间模式"}
      style={{
        /* 与 Header 按钮区对齐 */
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 34,
        marginRight: 10,
        padding: 4,
        borderRadius: 20,
        border: "1px solid var(--btn-border)",
        background: "var(--btn-bg)",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
        transition: "background-color 0.5s ease-in-out, border-color 0.5s ease-in-out",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* ── 太阳光芒（8 条射线） ── */}
        <g
          style={{
            opacity: "var(--toggle-sun-opacity, 1)",
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          {RAY_ANGLES.map((angle) => (
            <line
              key={angle}
              x1="22"
              y1="4"
              x2="22"
              y2="9"
              stroke="var(--toggle-ray-color, #FDB813)"
              strokeWidth="2.2"
              strokeLinecap="round"
              style={{
                transformOrigin: "22px 22px",
                transform: `rotate(${angle}deg)`,
              }}
            />
          ))}
        </g>

        {/* ── 太阳本体（圆） ── */}
        <circle
          cx="22"
          cy="22"
          r="10"
          style={{
            fill: "var(--toggle-bg, #FDB813)",
            opacity: "var(--toggle-sun-opacity, 1)",
            transition: "opacity 0.5s ease-in-out",
          }}
        />

        {/* ── 月牙（path） ── */}
        <path
          d="M 23 14 A 10 10 0 1 0 23 30 A 7 7 0 0 1 23 14 Z"
          style={{
            fill: "var(--toggle-bg, #C8D6F0)",
            opacity: "var(--toggle-moon-opacity, 0)",
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      </svg>
    </button>
  );
}
