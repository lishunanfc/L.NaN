import type { Metadata } from "next";
import "./globals.css";
import BackgroundAudioProvider from "@/components/BackgroundAudio";

export const metadata: Metadata = {
  title: "L.NaN · Aligns Human Intent",
  description: "让算法听懂人类的潜台词，也让表达回归本来的理性。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* ═══════════════════════════════════════════════════
            防闪烁阻塞脚本 —— 在所有元素渲染前挂载 data-theme
            localStorage > 默认白天 light
            ═══════════════════════════════════════════════════ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <BackgroundAudioProvider>{children}</BackgroundAudioProvider>
      </body>
    </html>
  );
}
