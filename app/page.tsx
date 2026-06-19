"use client";

import SkyBackground from "@/components/SkyBackground";
import ThreeClouds from "@/components/ThreeClouds";
import Header from "@/components/Header";
import HeroContent from "@/components/HeroContent";
import Clouds from "@/components/Clouds";
import PaperPlane from "@/components/PaperPlane";
import PaperPlaneTop from "@/components/PaperPlaneTop";
import GirlCharacter from "@/components/GirlCharacter";
import CursorTrail from "@/components/CursorTrail";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <SkyBackground />
      <ThreeClouds />
      <Clouds />
      <PaperPlane />
      <PaperPlaneTop />
      <GirlCharacter />
      <CursorTrail />
      <Header />
      <HeroContent />
    </main>
  );
}
