"use client";

import { useState } from "react";

export default function ContactNote() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 纸条按钮 — 右上角 */}
      <button
        onClick={() => setOpen(true)}
        className="absolute z-20 cursor-pointer select-none group"
        style={{ right: 36, top: 34 }}
        aria-label="查看微信二维码"
      >
        {/* 折叠纸条 SVG */}
        <svg
          width="28"
          height="32"
          viewBox="0 0 28 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-110"
        >
          {/* 纸条主体 */}
          <rect
            x="2"
            y="3"
            width="24"
            height="26"
            rx="2"
            fill="white"
            fillOpacity="0.12"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="0.8"
          />
          {/* 折角 */}
          <path
            d="M18 3 L26 11 L18 11 Z"
            fill="white"
            fillOpacity="0.18"
            stroke="white"
            strokeOpacity="0.35"
            strokeWidth="0.8"
          />
          {/* 文字横线 */}
          <rect x="6" y="15" width="10" height="1.2" rx="0.6" fill="white" fillOpacity="0.5" />
          <rect x="6" y="19" width="7" height="1.2" rx="0.6" fill="white" fillOpacity="0.4" />
          <rect x="6" y="23" width="9" height="1.2" rx="0.6" fill="white" fillOpacity="0.3" />
          {/* 微光点 */}
          <circle cx="7" cy="8" r="1" fill="white" fillOpacity="0.35" />
        </svg>
      </button>

      {/* 二维码弹窗 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* 卡片 */}
          <div
            className="relative bg-white/95 rounded-2xl p-8 flex flex-col items-center shadow-2xl"
            style={{
              boxShadow:
                "0 20px 80px rgba(80,40,120,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="关闭"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="#666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* 标题 */}
            <p className="text-sm text-gray-400 tracking-[0.15em] mb-5">扫码添加微信</p>

            {/* 二维码 */}
            <div style={{ width: 200, height: 200, position: "relative" }}>
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

            {/* 底部提示 */}
            <p className="mt-4 text-xs text-gray-300 tracking-wider">
              微信扫一扫
            </p>
          </div>
        </div>
      )}
    </>
  );
}
