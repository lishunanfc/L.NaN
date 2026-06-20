"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ── Context ── */
interface AudioContextValue {
  isPlaying: boolean;
  isNight: boolean;
  togglePlay: () => void;
}

const AudioCtx = createContext<AudioContextValue>({
  isPlaying: false,
  isNight: false,
  togglePlay: () => {},
});

export function useAudio() {
  return useContext(AudioCtx);
}

/* ── Provider ── */
const LOOP_DURATION = 28; // 前 28 秒循环

export default function BackgroundAudioProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isNight, setIsNight] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    a.currentTime = 0;
    a.play().catch(() => {});
    setIsPlaying(true);

    /* 1.5 秒音量渐入，避免切夜间刺耳跳变 */
    const start = performance.now();
    const FADE_DURATION = 1500;
    const fadeIn = () => {
      const a = audioRef.current;
      if (!a) return;
      const t = Math.min((performance.now() - start) / FADE_DURATION, 1);
      a.volume = t;
      if (t < 1) {
        requestAnimationFrame(fadeIn);
      }
    };
    requestAnimationFrame(fadeIn);
  }, []);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  /* ── 28 秒循环 ── */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTimeUpdate = () => {
      if (a.currentTime >= LOOP_DURATION) {
        a.currentTime = 0;
      }
    };
    a.addEventListener("timeupdate", onTimeUpdate);
    return () => a.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  /* ── 主题联动 ── */
  useEffect(() => {
    const sync = () => {
      const theme =
        document.documentElement.getAttribute("data-theme") || "light";
      const night = theme === "dark";
      setIsNight(night);

      if (night) {
        // 自动播放（利用主题切换按钮的手势上下文）
        play();
      }
      if (!night) {
        pause();
      }
    };

    sync(); // 首次加载

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          m.attributeName === "data-theme"
        ) {
          sync();
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [play, pause]);

  return (
    <AudioCtx.Provider value={{ isPlaying, isNight, togglePlay }}>
      <audio
        ref={audioRef}
        src="/night-ambient.mp3"
        preload="auto"
        style={{ display: "none" }}
      />
      {children}
    </AudioCtx.Provider>
  );
}
