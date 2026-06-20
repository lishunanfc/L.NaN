"use client";

export default function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center select-none">
      {/* ── 身份标签 ── */}
      <p
        className="hero-subtitle mb-8"
        style={{
          fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
          fontSize: "17px",
          fontWeight: 500,
          letterSpacing: "0.12em",
          color: "var(--subtitle-color)",
        }}
      >
        L.NAN | LLM Alignment
      </p>

      {/* ── 主标题 ── */}
      <h1
        className="hero-title font-medium tracking-[0.08em] leading-[1.1]"
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
        className="hero-desc text-base tracking-[0.15em]"
        style={{
          fontWeight: "var(--hero-desc-weight)",
          color: "var(--hero-desc-color)",
          marginTop: "42px",
        }}
      >
        让算法听懂人类的潜台词，也让表达回归本来的理性。
      </p>
    </div>
  );
}
