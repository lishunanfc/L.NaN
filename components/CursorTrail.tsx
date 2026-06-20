"use client";

import { useEffect, useRef, useCallback } from "react";

/* ──────────────────────────────────────────
   可调参数（微调拖尾形态与粒子行为）
   ────────────────────────────────────────── */
const CONFIG = {
  /** 拖尾最大历史点数 */
  TRAIL_MAX_POINTS: 30,
  /** 每个点的存活时间（ms），超出后自动移除 */
  POINT_LIFETIME: 350,
  /** 拖尾头部最大线宽（px） */
  TRAIL_HEAD_WIDTH: 3.2,
  /** 拖尾尾部最小线宽（px） */
  TRAIL_TAIL_WIDTH: 0.5,
  /** 拖尾头部透明度（0-1） */
  TRAIL_HEAD_ALPHA: 0.55,
  /** 外发光层额外宽度（px，0=不绘制外层） */
  TRAIL_GLOW_EXTRA: 6,
  /** 外发光透明度 */
  TRAIL_GLOW_ALPHA: 0.08,
  /** 粒子最大数量 */
  PARTICLE_MAX: 55,
  /** 粒子存活帧数（60fps 下 30≈0.5s） */
  PARTICLE_LIFE: 30,
  /** 粒子半径范围 [min, max]（px） */
  PARTICLE_SIZE: [2, 5],
  /** 粒子向下漂移速度范围（px/帧） */
  PARTICLE_GRAVITY: [0.2, 0.5],
  /** 粒子水平扩散速度范围（px/帧） */
  PARTICLE_SPREAD: [-0.6, 0.6],
  /** 每帧生成粒子的概率（0-1），鼠标移动中生效 */
  PARTICLE_SPAWN_CHANCE: 0.4,
  /** 每次生成的粒子数量 */
  PARTICLE_SPAWN_COUNT: 2,
} as const;

/* ──────────────────────────────────────────
   粒子颜色池 —— 日间暖色
   ────────────────────────────────────────── */
const PARTICLE_COLORS_DAY = [
  "#EEA47F", // 暖橙
  "#E8926A", // 深暖橙
  "#F0B898", // 浅暖橙
  "#B695C0", // 晚霞紫
  "#C4A8D0", // 淡紫
  "#A382B8", // 深紫
  "#F5E6D3", // 暖白
  "#E8D5F0", // 粉紫白
];

/* ──────────────────────────────────────────
   粒子颜色池 —— 夜间冷白流星
   ────────────────────────────────────────── */
const PARTICLE_COLORS_NIGHT = [
  "#FFFFFF", // 纯白
  "#E0ECFF", // 极淡蓝白
  "#D0E0FF", // 淡蓝白
  "#F0E4FF", // 淡紫白
  "#C4D8FF", // 浅蓝
  "#DCC8F8", // 淡紫
  "#FFF2F0", // 暖白星点
  "#D8E8F8", // 冰蓝
];

/* ──────────────────────────────────────────
   类型定义
   ────────────────────────────────────────── */
interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const themeRef = useRef<"light" | "dark">("light");
  const mouseRef = useRef<{ x: number; y: number; moving: boolean }>({
    x: -100,
    y: -100,
    moving: false,
  });
  const rafRef = useRef<number>(0);

  /* ── 移动端检测 ── */
  const isMobile = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const narrow = window.innerWidth < 1024;
    const mobileUA =
      /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return touch && (narrow || mobileUA);
  }, []);

  useEffect(() => {
    if (isMobile()) return; // 移动端直接禁用，零开销

    /* ── 主题监听 ── */
    themeRef.current =
      (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    const themeObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          themeRef.current =
            (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
        }
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── Canvas 尺寸自适应 ── */
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 缩放坐标系，使用 CSS 像素
        // 清空旧拖尾（尺寸变化后历史坐标已无效）
        trailRef.current = [];
        particlesRef.current = [];
      }, 80); // 80ms 防抖
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── 鼠标跟踪 ── */
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moving = true;

      const now = performance.now();
      const trail = trailRef.current;
      trail.push({ x: e.clientX, y: e.clientY, time: now });

      // 粒子生成
      if (
        Math.random() < CONFIG.PARTICLE_SPAWN_CHANCE &&
        particlesRef.current.length < CONFIG.PARTICLE_MAX
      ) {
        for (let i = 0; i < CONFIG.PARTICLE_SPAWN_COUNT; i++) {
          const life = CONFIG.PARTICLE_LIFE;
          particlesRef.current.push({
            x: e.clientX,
            y: e.clientY,
            vx: CONFIG.PARTICLE_SPREAD[0] + Math.random() * (CONFIG.PARTICLE_SPREAD[1] - CONFIG.PARTICLE_SPREAD[0]),
            vy: CONFIG.PARTICLE_GRAVITY[0] + Math.random() * (CONFIG.PARTICLE_GRAVITY[1] - CONFIG.PARTICLE_GRAVITY[0]),
            life,
            maxLife: life,
            radius:
              CONFIG.PARTICLE_SIZE[0] +
              Math.random() * (CONFIG.PARTICLE_SIZE[1] - CONFIG.PARTICLE_SIZE[0]),
            color: (themeRef.current === "dark" ? PARTICLE_COLORS_NIGHT : PARTICLE_COLORS_DAY)[Math.floor(Math.random() * (themeRef.current === "dark" ? PARTICLE_COLORS_NIGHT : PARTICLE_COLORS_DAY).length)],
          });
        }
      }
    };

    /* ── 鼠标停止时标记静默（停止生成粒子，拖尾自然淡出） ── */
    const onIdle = () => {
      mouseRef.current.moving = false;
    };
    let idleTimer: ReturnType<typeof setTimeout>;
    const onMoveWrapper = (e: MouseEvent) => {
      onMove(e);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(onIdle, 60); // 60ms 无移动视为静止
    };

    window.addEventListener("mousemove", onMoveWrapper, { passive: true });

    /* ── 渲染循环 ── */
    const render = (now: number) => {
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

      const trail = trailRef.current;
      const particles = particlesRef.current;

      /* 清理过期拖尾点 */
      while (trail.length > 0 && now - trail[0].time > CONFIG.POINT_LIFETIME) {
        trail.shift();
      }
      // 上限裁剪
      while (trail.length > CONFIG.TRAIL_MAX_POINTS) {
        trail.shift();
      }

      /* ── 绘制拖尾气流线 ── */
      if (trail.length >= 2) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // 快移插值补点：采样点间距 > threshold 时插入中间点
        const threshold = 16;
        const renderPoints: typeof trail = [];
        for (let i = 0; i < trail.length - 1; i++) {
          renderPoints.push(trail[i]);
          const dx = trail[i + 1].x - trail[i].x;
          const dy = trail[i + 1].y - trail[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > threshold) {
            const steps = Math.ceil(dist / threshold);
            for (let s = 1; s < steps; s++) {
              const t = s / steps;
              renderPoints.push({
                x: trail[i].x + dx * t,
                y: trail[i].y + dy * t,
                time: trail[i].time + (trail[i + 1].time - trail[i].time) * t,
              });
            }
          }
        }
        renderPoints.push(trail[trail.length - 1]);
        const total = renderPoints.length;

        // 外发光层（柔和光晕）
        if (CONFIG.TRAIL_GLOW_EXTRA > 0) {
          for (let i = 0; i < total - 1; i++) {
            const progress = i / (total - 1); // 0=头部, 1=尾部远端
            const alpha = CONFIG.TRAIL_GLOW_ALPHA * (1 - progress);
            if (alpha <= 0.002) continue;

            const width =
              CONFIG.TRAIL_TAIL_WIDTH +
              (CONFIG.TRAIL_HEAD_WIDTH - CONFIG.TRAIL_TAIL_WIDTH) * (1 - progress) +
              CONFIG.TRAIL_GLOW_EXTRA;

            ctx.beginPath();
            ctx.moveTo(renderPoints[i].x, renderPoints[i].y);

            // 二次贝塞尔通过中点平滑
            if (i < total - 2) {
              const mx = (renderPoints[i].x + renderPoints[i + 1].x) / 2;
              const my = (renderPoints[i].y + renderPoints[i + 1].y) / 2;
              ctx.quadraticCurveTo(renderPoints[i].x, renderPoints[i].y, mx, my);
            } else {
              ctx.lineTo(renderPoints[i + 1].x, renderPoints[i + 1].y);
            }

            const isDark = themeRef.current === "dark";
            // 夜间：冷白带淡蓝辉光；日间：暖白辉光
            ctx.strokeStyle = isDark
              ? `rgba(180,200,240,${alpha * 1.4})`
              : `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = width;
            ctx.stroke();
          }
        }

        // 主线（纤细、半透）
        for (let i = 0; i < total - 1; i++) {
          const progress = i / (total - 1);
          const alpha = CONFIG.TRAIL_HEAD_ALPHA * (1 - progress);
          if (alpha <= 0.003) continue;

          const width =
            CONFIG.TRAIL_TAIL_WIDTH +
            (CONFIG.TRAIL_HEAD_WIDTH - CONFIG.TRAIL_TAIL_WIDTH) * (1 - progress);

          ctx.beginPath();
          ctx.moveTo(renderPoints[i].x, renderPoints[i].y);

          if (i < total - 2) {
            const mx = (renderPoints[i].x + renderPoints[i + 1].x) / 2;
            const my = (renderPoints[i].y + renderPoints[i + 1].y) / 2;
            ctx.quadraticCurveTo(renderPoints[i].x, renderPoints[i].y, mx, my);
          } else {
            ctx.lineTo(renderPoints[i + 1].x, renderPoints[i + 1].y);
          }

          const isDark2 = themeRef.current === "dark";
          // 夜间：冷白主线；日间：白色半透主线
          ctx.strokeStyle = isDark2
            ? `rgba(220,235,255,${alpha * 1.2})`
            : `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = width;
          ctx.stroke();
        }

        // 在每个轨迹点绘制填充小圆点，消除贝塞尔曲线段间的视觉断点
        for (let i = 0; i < total; i++) {
          const progress = i / Math.max(total - 1, 1);
          const alpha = CONFIG.TRAIL_HEAD_ALPHA * (1 - progress);
          if (alpha <= 0.005) continue;
          const width =
            CONFIG.TRAIL_TAIL_WIDTH +
            (CONFIG.TRAIL_HEAD_WIDTH - CONFIG.TRAIL_TAIL_WIDTH) * (1 - progress);
          const isDark3 = themeRef.current === "dark";
          ctx.fillStyle = isDark3
            ? `rgba(220,235,255,${alpha * 1.2})`
            : `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(renderPoints[i].x, renderPoints[i].y, width / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      /* ── 更新 & 绘制粒子 ── */
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const t = p.life / p.maxLife; // 1→0
        // 缓出曲线：快速亮起 → 缓慢消散
        const alpha = t < 0.6 ? 1 : (1 - t) / 0.4 * 0.7;
        const radius = p.radius * (0.3 + t * 0.7);

        ctx.save();
        ctx.globalAlpha = alpha;

        // 粒子光点（径向渐变模拟柔和发光）
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.5, p.color + "99");
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      themeObserver.disconnect();
      window.removeEventListener("mousemove", onMoveWrapper);
      window.removeEventListener("resize", resize);
      clearTimeout(resizeTimeout);
      clearTimeout(idleTimer);
    };
  }, [isMobile]);

  if (isMobile()) return null; // 移动端不渲染任何 DOM

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
