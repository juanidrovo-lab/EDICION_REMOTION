import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { CTAOverlay } from "../components/CTAOverlay";
import { ProgressBar } from "../components/ProgressBar";
import type { CTAType } from "../types";
import type { PlatformId } from "../presets/platforms";
import { getPlatform } from "../presets/platforms";

export interface ProductFeature {
  icon: string;
  text: string;
}

export interface ProductShowcaseProps {
  platform: PlatformId;

  // ── Producto ──────────────────────────────────────────────────────────────
  productImageSrc: string;
  productName: string;
  productTagline?: string;

  // ── Precio ────────────────────────────────────────────────────────────────
  price?: string;
  originalPrice?: string;
  discountLabel?: string;

  // ── Features (bullet points) ──────────────────────────────────────────────
  features?: ProductFeature[];

  // ── CTA ───────────────────────────────────────────────────────────────────
  ctaText: string;
  ctaType?: CTAType;

  // ── Branding ─────────────────────────────────────────────────────────────
  brandColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  backgroundImageSrc?: string;

  // ── Stories progress bar ─────────────────────────────────────────────────
  showProgressBar?: boolean;
}

const sec = (s: number, fps: number) => Math.round(s * fps);

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  platform,
  productImageSrc,
  productName,
  productTagline,
  price,
  originalPrice,
  discountLabel,
  features = [],
  ctaText,
  ctaType = "pill",
  brandColor = "#1a1a2e",
  accentColor = "#e94560",
  backgroundColor = "#0f0f1a",
  backgroundImageSrc,
  showProgressBar = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const preset = getPlatform(platform);
  const isVertical = preset.orientation === "vertical";
  const sz = preset.safeZone;

  // ── Animaciones de entrada ────────────────────────────────────────────────

  const productSpring = spring({ frame, fps, config: { stiffness: 100, damping: 14 }, durationInFrames: 20 });
  const productScale = interpolate(productSpring, [0, 1], [0.7, 1]);
  const productOpacity = interpolate(productSpring, [0, 1], [0, 1]);

  const titleDelay = sec(0.3, fps);
  const titleSpring = spring({ frame: Math.max(0, frame - titleDelay), fps, config: { stiffness: 120, damping: 16 }, durationInFrames: 18 });
  const titleY = interpolate(titleSpring, [0, 1], [30, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const priceDelay = sec(0.6, fps);
  const priceSpring = spring({ frame: Math.max(0, frame - priceDelay), fps, config: { stiffness: 200, damping: 14 }, durationInFrames: 12 });
  const priceScale = interpolate(priceSpring, [0, 1], [0.5, 1]);
  const priceOpacity = interpolate(priceSpring, [0, 1], [0, 1]);

  const ctaDelay = sec(1.2, fps);
  const ctaSpring = spring({ frame: Math.max(0, frame - ctaDelay), fps, config: { stiffness: 160, damping: 14 }, durationInFrames: 14 });
  const ctaY = interpolate(ctaSpring, [0, 1], [40, 0]);
  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);

  // Pulsate en el precio para llamar atención
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2.5) * 0.015;

  const productImgSize = isVertical ? Math.min(width * 0.75, 640) : Math.min(height * 0.7, 500);

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Fondo opcional */}
      {backgroundImageSrc && (
        <AbsoluteFill>
          <Img
            src={backgroundImageSrc}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }}
          />
        </AbsoluteFill>
      )}

      {/* Degradado de marca */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${brandColor}cc 0%, ${backgroundColor} 70%)`,
        }}
      />

      {/* Imagen del producto */}
      <div
        style={{
          position: "absolute",
          top: isVertical ? sz.top + 40 : sz.top + 20,
          left: "50%",
          transform: `translateX(-50%) scale(${productScale})`,
          opacity: productOpacity,
          width: productImgSize,
          height: productImgSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={productImageSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.6))",
          }}
        />
        {/* Badge de descuento */}
        {discountLabel && (
          <div
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              backgroundColor: accentColor,
              color: "#ffffff",
              fontFamily: "Arial Black, sans-serif",
              fontWeight: 900,
              fontSize: 28,
              borderRadius: "50%",
              width: 90,
              height: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: `0 4px 20px ${accentColor}88`,
              transform: `scale(${pulse})`,
            }}
          >
            {discountLabel}
          </div>
        )}
      </div>

      {/* Info del producto */}
      <div
        style={{
          position: "absolute",
          bottom: sz.bottom + (isVertical ? 320 : 100),
          left: sz.left + 40,
          right: sz.right + 40,
        }}
      >
        {/* Nombre */}
        <div
          style={{
            fontFamily: "Arial Black, sans-serif",
            fontSize: isVertical ? 72 : 48,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textShadow: "0 4px 16px rgba(0,0,0,0.7)",
            lineHeight: 1.1,
          }}
        >
          {productName}
        </div>

        {/* Tagline */}
        {productTagline && (
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: isVertical ? 36 : 24,
              fontWeight: 500,
              color: "rgba(255,255,255,0.75)",
              textAlign: "center",
              marginTop: 8,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            {productTagline}
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px 24px",
              marginTop: 20,
              opacity: titleOpacity,
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#ffffff",
                  fontFamily: "Arial, sans-serif",
                  fontSize: isVertical ? 30 : 22,
                  fontWeight: 600,
                }}
              >
                <span style={{ fontSize: isVertical ? 32 : 24 }}>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Precio */}
        {price && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 16,
              marginTop: 24,
              opacity: priceOpacity,
              transform: `scale(${priceScale})`,
            }}
          >
            {originalPrice && (
              <span
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: isVertical ? 40 : 28,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "line-through",
                  fontWeight: 600,
                }}
              >
                {originalPrice}
              </span>
            )}
            <span
              style={{
                fontFamily: "Arial Black, sans-serif",
                fontSize: isVertical ? 80 : 56,
                fontWeight: 900,
                color: accentColor,
                textShadow: `0 0 30px ${accentColor}88`,
                transform: `scale(${pulse})`,
                display: "inline-block",
              }}
            >
              {price}
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: sz.bottom + 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <CTAOverlay
          clip={{
            id: "cta-prod",
            type: "text",
            subtitleType: "cta",
            startFrame: 0,
            durationInFrames,
            trackIndex: 3,
            text: ctaText,
            ctaType,
            backgroundColor: accentColor,
            accentColor: "#ffffff",
            icon: "cart",
            pulsate: true,
            x: 50,
            y: 50,
          }}
        />
      </div>

      {showProgressBar && (
        <ProgressBar topOffset={sz.top > 100 ? sz.top - 40 : 20} color="#ffffff" />
      )}
    </AbsoluteFill>
  );
};
