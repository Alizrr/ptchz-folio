import { useMemo, useId } from "react";

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, Number(n) || min));
}

function petalPath(cx, cy, len, width) {
  const tipY = cy - len;
  const halfW = width / 2;
  return `M ${cx} ${cy} `
    + `C ${cx - halfW} ${cy - len * 0.45}, ${cx - halfW} ${tipY + len * 0.18}, ${cx} ${tipY} `
    + `C ${cx + halfW} ${tipY + len * 0.18}, ${cx + halfW} ${cy - len * 0.45}, ${cx} ${cy} Z`;
}

function polygonPoints(cx, cy, r, sides, rotation = 0) {
  return Array.from({ length: sides }).map((_, i) => {
    const a = ((360 / sides) * i + rotation - 90) * Math.PI / 180;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
}

export function randomLogoSeed() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "mark-";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

/**
 * Generated logo mark.
 * style: cloud | constellation | prism | orbit
 */
export default function Logo({
  seed = "Portfolio",
  size = 36,
  className = "",
  tile = true,
  style = "cloud",
  complexity = 6,
  showNodes = true,
}) {
  const uid = useId().replace(/:/g, "");
  const gradId = `av-${uid}`;
  const glowId = `gl-${uid}`;
  const VB = 100;
  const c = VB / 2;

  const cfg = useMemo(() => {
    const rng = makeRng(hashString(`${seed || "Portfolio"}:${style}`));
    const level = clamp(complexity, 3, 10);
    const count = Math.round(level + 3 + rng() * 4);
    const rot = rng() * 360;
    const points = Array.from({ length: count }).map((_, i) => {
      const angle = ((360 / count) * i + rot + (rng() - 0.5) * 18) * Math.PI / 180;
      const radius = 20 + rng() * (15 + level * 1.2);
      return {
        x: c + Math.cos(angle) * radius,
        y: c + Math.sin(angle) * radius,
        r: 2.2 + rng() * 2.2,
      };
    });
    return {
      level,
      count,
      rot,
      points,
      petals: 5 + Math.floor(rng() * Math.min(6, level)),
      len: 24 + level + Math.floor(rng() * 8),
      width: 16 + level + Math.floor(rng() * 9),
      coreR: 5 + Math.floor(rng() * 5),
      sides: 3 + Math.floor(rng() * 5),
    };
  }, [seed, style, complexity]);

  const renderNodes = () => showNodes && (
    <g>
      {cfg.points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="var(--accent)" opacity="0.85" />
      ))}
    </g>
  );

  const renderMark = () => {
    if (style === "constellation") {
      return (
        <g>
          <polyline
            points={cfg.points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.78"
          />
          {renderNodes()}
          <circle cx={c} cy={c} r={cfg.coreR} fill={`url(#${gradId})`} />
        </g>
      );
    }

    if (style === "prism") {
      const layers = Math.max(3, Math.min(6, Math.round(cfg.level / 2)));
      return (
        <g transform={`rotate(${cfg.rot} ${c} ${c})`}>
          {Array.from({ length: layers }).map((_, i) => (
            <polygon
              key={i}
              points={polygonPoints(c, c, 14 + i * 6, cfg.sides + (i % 2), i * 18)}
              fill={i === layers - 1 ? "none" : `url(#${gradId})`}
              stroke={`url(#${gradId})`}
              strokeWidth="2.5"
              opacity={0.25 + i * 0.12}
            />
          ))}
          {renderNodes()}
        </g>
      );
    }

    if (style === "orbit") {
      const rings = Math.max(2, Math.min(5, Math.round(cfg.level / 2)));
      return (
        <g transform={`rotate(${cfg.rot} ${c} ${c})`}>
          {Array.from({ length: rings }).map((_, i) => (
            <ellipse
              key={i}
              cx={c}
              cy={c}
              rx={18 + i * 6}
              ry={8 + i * 4}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="3"
              opacity={0.72 - i * 0.08}
              transform={`rotate(${i * 34} ${c} ${c})`}
            />
          ))}
          {renderNodes()}
          <circle cx={c} cy={c} r={cfg.coreR} fill={`url(#${gradId})`} />
        </g>
      );
    }

    const step = 360 / cfg.petals;
    return (
      <g>
        <g transform={`rotate(${cfg.rot} ${c} ${c})`}>
          {Array.from({ length: cfg.petals }).map((_, i) => (
            <path
              key={i}
              d={petalPath(c, c, cfg.len, cfg.width)}
              fill={`url(#${gradId})`}
              transform={`rotate(${i * step} ${c} ${c})`}
              opacity="0.9"
            />
          ))}
        </g>
        {renderNodes()}
        <circle cx={c} cy={c} r={cfg.coreR} fill="var(--bg, #06070a)" opacity="0.55" />
        <circle cx={c} cy={c} r={cfg.coreR * 0.6} fill={`url(#${gradId})`} />
      </g>
    );
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`} className={className}
         role="img" aria-label="generated logo">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--blob-1, var(--accent))" />
          <stop offset="0.55" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--blob-2, var(--accent))" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="42%" r="60%">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {tile && (
        <rect x="2" y="2" width="96" height="96" rx="24"
          fill="color-mix(in srgb, var(--accent) 9%, transparent)"
          stroke="var(--border, rgba(255,255,255,0.1))" strokeWidth="2" />
      )}
      <circle cx={c} cy={c} r="40" fill={`url(#${glowId})`} />
      {renderMark()}
    </svg>
  );
}
