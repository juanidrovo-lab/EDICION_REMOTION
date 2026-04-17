import React from "react";
import { AbsoluteFill } from "remotion";
import type { SafeZone } from "../presets/platforms";

interface SafeZoneGuideProps {
  safeZone: SafeZone;
  platformName?: string;
  /** Solo visible en desarrollo — se omite automáticamente al renderizar */
  show?: boolean;
}

/**
 * Overlay visual que muestra las safe zones de la plataforma.
 * Solo debe usarse durante el desarrollo (showSafeZone: true en el proyecto).
 * Las zonas rojas son zonas BLOQUEADAS por la UI de la plataforma.
 * La zona verde es el área segura donde va el contenido principal.
 */
export const SafeZoneGuide: React.FC<SafeZoneGuideProps> = ({
  safeZone,
  platformName = "Plataforma",
  show = true,
}) => {
  if (!show) return null;

  const { top, bottom, left, right } = safeZone;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Zona bloqueada superior */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: top,
          backgroundColor: "rgba(255, 50, 50, 0.25)",
          borderBottom: "2px dashed rgba(255, 80, 80, 0.8)",
        }}
      />
      {/* Zona bloqueada inferior */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: bottom,
          backgroundColor: "rgba(255, 50, 50, 0.25)",
          borderTop: "2px dashed rgba(255, 80, 80, 0.8)",
        }}
      />
      {/* Zona bloqueada izquierda */}
      <div
        style={{
          position: "absolute",
          top,
          bottom,
          left: 0,
          width: left,
          backgroundColor: "rgba(255, 50, 50, 0.15)",
          borderRight: "2px dashed rgba(255, 80, 80, 0.5)",
        }}
      />
      {/* Zona bloqueada derecha */}
      <div
        style={{
          position: "absolute",
          top,
          bottom,
          right: 0,
          width: right,
          backgroundColor: "rgba(255, 50, 50, 0.15)",
          borderLeft: "2px dashed rgba(255, 80, 80, 0.5)",
        }}
      />
      {/* Borde zona segura */}
      <div
        style={{
          position: "absolute",
          top,
          bottom,
          left,
          right,
          border: "2px dashed rgba(80, 220, 80, 0.7)",
          borderRadius: 4,
        }}
      />
      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: top + 8,
          left: left + 8,
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "#80ff80",
          fontFamily: "monospace",
          fontSize: 20,
          padding: "4px 10px",
          borderRadius: 4,
          border: "1px solid rgba(80,220,80,0.5)",
        }}
      >
        ✓ SAFE ZONE — {platformName}
      </div>
      {/* Medidas */}
      <div
        style={{
          position: "absolute",
          top: top / 2,
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "#ff8080",
          fontFamily: "monospace",
          fontSize: 18,
          padding: "3px 8px",
          borderRadius: 4,
          whiteSpace: "nowrap",
        }}
      >
        ↕ {top}px bloqueado
      </div>
    </AbsoluteFill>
  );
};
