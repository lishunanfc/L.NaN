"use client";

export default function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center select-none">
      {/* ── 身份标签 ── */}
      <p
        className="text-xs tracking-[0.3em] uppercase mb-8"
        style={{ color: "var(--text-muted)" }}
      >
        L.NaN &middot; AI训练师
      </p>

      {/* ── 主标题 ── */}
      <h1
        className="font-medium tracking-[0.08em] leading-[1.1]"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.6rem, 7vw, 5.6rem)",
          color: "var(--title-color)",
          textShadow: "var(--title-shadow)",
        }}
      >
        ALIGNS HUMAN
        <br />
        INTENT
      </h1>

      {/* ── 副标题 ── */}
      <p
        className="text-base font-light tracking-[0.15em]"
        style={{ color: "var(--text-secondary)", marginTop: "36px" }}
      >
        让算法听懂人类的潜台词，也让表达回归本来的理性。
      </p>
    </div>
  );
}
