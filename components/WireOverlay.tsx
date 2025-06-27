// WireOverlay.jsx
import React from "react";

export function WireOverlay({ from, to }) {
  if (!from || !to) return null;

  // Calculate control points for a nice curve (horizontal)
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const control1 = { x: from.x + deltaX * 0.4, y: from.y };
  const control2 = { x: from.x + deltaX * 0.6, y: to.y };

  const pathData = `M ${from.x} ${from.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${to.x} ${to.y}`;

  return (
    <svg
      className="pointer-events-none fixed left-0 top-0 z-50"
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ width: "100vw", height: "100vh" }}
    >
      <defs>
        <linearGradient id="stripeWire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <path
        d={pathData}
        stroke="url(#stripeWire)"
        strokeWidth="3"
        fill="none"
        style={{
          filter: "drop-shadow(0 2px 12px #f472b6aa)",
        }}
      />
    </svg>
  );
}