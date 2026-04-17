import React from "react";
import { Composition } from "remotion";
import { MainComposition } from "./compositions/MainComposition";
import { DemoComposition, demoProject } from "./compositions/DemoProject";
import { HookAdTemplate } from "./templates/HookAdTemplate";
import { ProductShowcase } from "./templates/ProductShowcase";
import { UGCAdTemplate } from "./templates/UGCAdTemplate";
import type { HookAdProps } from "./templates/HookAdTemplate";
import type { ProductShowcaseProps } from "./templates/ProductShowcase";
import type { UGCAdProps } from "./templates/UGCAdTemplate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnyComp = (comp: React.FC<any>) => comp as React.FC<Record<string, unknown>>;

const FPS = 30;

// ── Datos de ejemplo — Hook Ad (TikTok 9:16, 15seg) ──────────────────────────
const hookAdDemo: HookAdProps = {
  platform: "tiktok",
  scenes: [
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80",
      durationSec: 5,
      kenBurns: true,
    },
    {
      src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&q=80",
      durationSec: 5,
      kenBurns: true,
    },
    {
      src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1080&q=80",
      durationSec: 5,
      kenBurns: false,
    },
  ],
  hookText: "¿Sabías esto?",
  hookSubtext: "La mayoría no lo sabe…",
  words: [
    { word: "Este", startFrame: 3 * FPS, endFrame: 3.3 * FPS },
    { word: "truco", startFrame: 3.3 * FPS, endFrame: 3.7 * FPS },
    { word: "cambia", startFrame: 3.7 * FPS, endFrame: 4.2 * FPS },
    { word: "todo", startFrame: 4.2 * FPS, endFrame: 4.6 * FPS },
    { word: "lo", startFrame: 4.6 * FPS, endFrame: 4.9 * FPS },
    { word: "que", startFrame: 4.9 * FPS, endFrame: 5.2 * FPS },
    { word: "creías", startFrame: 5.2 * FPS, endFrame: 5.8 * FPS },
    { word: "saber.", startFrame: 5.8 * FPS, endFrame: 6.4 * FPS },
    { word: "Primero,", startFrame: 7 * FPS, endFrame: 7.5 * FPS },
    { word: "nunca", startFrame: 7.5 * FPS, endFrame: 7.9 * FPS },
    { word: "ignores", startFrame: 7.9 * FPS, endFrame: 8.4 * FPS },
    { word: "las", startFrame: 8.4 * FPS, endFrame: 8.7 * FPS },
    { word: "señales.", startFrame: 8.7 * FPS, endFrame: 9.3 * FPS },
    { word: "Segundo,", startFrame: 10 * FPS, endFrame: 10.6 * FPS },
    { word: "actúa", startFrame: 10.6 * FPS, endFrame: 11.0 * FPS },
    { word: "rápido", startFrame: 11.0 * FPS, endFrame: 11.5 * FPS },
    { word: "antes", startFrame: 11.5 * FPS, endFrame: 11.9 * FPS },
    { word: "de", startFrame: 11.9 * FPS, endFrame: 12.1 * FPS },
    { word: "que", startFrame: 12.1 * FPS, endFrame: 12.3 * FPS },
    { word: "sea", startFrame: 12.3 * FPS, endFrame: 12.5 * FPS },
    { word: "tarde.", startFrame: 12.5 * FPS, endFrame: 13 * FPS },
  ].map((w) => ({ ...w, startFrame: Math.round(w.startFrame), endFrame: Math.round(w.endFrame) })),
  captionStyle: "tiktok",
  ctaText: "Ver más",
  ctaSubtext: "Enlace en bio",
  ctaStartSec: 13,
  ctaType: "button",
  ctaColor: "#FF3B5C",
  showProgressBar: false,
};

// ── Datos de ejemplo — Product Showcase (Reels 9:16, 12seg) ──────────────────
const productDemo: ProductShowcaseProps = {
  platform: "reels",
  productImageSrc:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  productName: "Reloj Premium",
  productTagline: "Lujo accesible para todos",
  price: "$199",
  originalPrice: "$399",
  discountLabel: "-50%",
  features: [
    { icon: "⌚", text: "Resistente al agua" },
    { icon: "🔋", text: "30 días de batería" },
    { icon: "📦", text: "Envío gratis" },
  ],
  ctaText: "Comprar ahora",
  ctaType: "pill",
  brandColor: "#1a1a2e",
  accentColor: "#FFD700",
  backgroundColor: "#0a0a1a",
  showProgressBar: false,
};

// ── Datos de ejemplo — UGC Ad (Meta Ads Vertical, 20seg) ─────────────────────
const ugcDemo: UGCAdProps = {
  platform: "meta_ads_vertical",
  backgroundSrc:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1080&q=80",
  hookEmoji: "🔥",
  hookLine1: "Nadie te dice esto",
  hookLine2: "sobre bajar de peso",
  words: [
    { word: "Después", startFrame: 3 * FPS, endFrame: 3.4 * FPS },
    { word: "de", startFrame: 3.4 * FPS, endFrame: 3.6 * FPS },
    { word: "3", startFrame: 3.6 * FPS, endFrame: 3.9 * FPS },
    { word: "meses", startFrame: 3.9 * FPS, endFrame: 4.3 * FPS },
    { word: "probé", startFrame: 4.3 * FPS, endFrame: 4.8 * FPS },
    { word: "esto", startFrame: 4.8 * FPS, endFrame: 5.2 * FPS },
    { word: "y", startFrame: 5.4 * FPS, endFrame: 5.6 * FPS },
    { word: "bajé", startFrame: 5.6 * FPS, endFrame: 6.0 * FPS },
    { word: "12kg.", startFrame: 6.0 * FPS, endFrame: 6.8 * FPS },
    { word: "Sin", startFrame: 7.5 * FPS, endFrame: 7.9 * FPS },
    { word: "dietas", startFrame: 7.9 * FPS, endFrame: 8.4 * FPS },
    { word: "extremas.", startFrame: 8.4 * FPS, endFrame: 9.2 * FPS },
    { word: "Sin", startFrame: 10 * FPS, endFrame: 10.3 * FPS },
    { word: "pastillas.", startFrame: 10.3 * FPS, endFrame: 11.2 * FPS },
    { word: "Solo", startFrame: 12 * FPS, endFrame: 12.4 * FPS },
    { word: "este", startFrame: 12.4 * FPS, endFrame: 12.8 * FPS },
    { word: "método", startFrame: 12.8 * FPS, endFrame: 13.4 * FPS },
    { word: "de", startFrame: 13.4 * FPS, endFrame: 13.6 * FPS },
    { word: "5", startFrame: 13.6 * FPS, endFrame: 13.9 * FPS },
    { word: "minutos.", startFrame: 13.9 * FPS, endFrame: 14.6 * FPS },
  ].map((w) => ({ ...w, startFrame: Math.round(w.startFrame), endFrame: Math.round(w.endFrame) })),
  captionStyle: "bold_pop",
  ctaText: "Lo quiero gratis",
  ctaEmoji: "👇",
  ctaStartSec: 15,
  ctaColor: "#25D366",
  socialProof: "+50,000 personas ya lo usan",
  socialProofIcon: "⭐",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Composición principal (configurable por JSON) ── */}
      <Composition
        id="MainComposition"
        component={AnyComp(MainComposition)}
        durationInFrames={demoProject.durationInFrames}
        fps={demoProject.fps}
        width={demoProject.width}
        height={demoProject.height}
        defaultProps={demoProject}
      />

      {/* ── Demo básico 16:9 ── */}
      <Composition
        id="Demo"
        component={DemoComposition}
        durationInFrames={demoProject.durationInFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* ── Hook Ad — TikTok 9:16 ── */}
      <Composition
        id="HookAd_TikTok"
        component={AnyComp(HookAdTemplate)}
        durationInFrames={15 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={hookAdDemo}
      />

      {/* ── Product Showcase — Reels 9:16 ── */}
      <Composition
        id="ProductShowcase_Reels"
        component={AnyComp(ProductShowcase)}
        durationInFrames={12 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={productDemo}
      />

      {/* ── UGC Ad — Meta Ads Vertical ── */}
      <Composition
        id="UGCAd_MetaVertical"
        component={AnyComp(UGCAdTemplate)}
        durationInFrames={20 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={ugcDemo}
      />
    </>
  );
};
