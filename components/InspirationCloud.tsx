"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ──────────────────────────────────────────
   文案池
   ────────────────────────────────────────── */
const QUOTES = [
  "Sampling tokens...",
  "正在对齐：人类眼中的晚霞。",
  "[Loss 正在下降，而风正在吹]",
  "Temperature = 0.7 时的日落。",
  "Context Window 里全都是风。",
  "Epoch 3：人类开始对齐落日的余晖。",
  "正在将这一刻的温柔，编码为向量空间。",
  "当前置信度（Confidence Score）：99.9% 适合放空。",
  "在 30,000 次对齐之后，它终于学会了看海。",
];

/* ──────────────────────────────────────────
   可调参数
   ────────────────────────────────────────── */
const FADE_DURATION = 400; // 文字淡入/淡出时长（ms）
const SWITCH_DELAY = 500; // 鼠标离开后等待多久再换句（ms），需 ≥ FADE_DURATION
const HOVER_SCALE = 1.05;

/* ──────────────────────────────────────────
   随机取一句，避免连续重复
   ────────────────────────────────────────── */
let lastIndex = -1;
function pickRandomQuote(): string {
  if (QUOTES.length <= 1) return QUOTES[0];
  let idx: number;
  do {
    idx = Math.floor(Math.random() * QUOTES.length);
  } while (idx === lastIndex);
  lastIndex = idx;
  return QUOTES[idx];
}

export default function InspirationCloud() {
  return null;
}
