import React, { useState, useEffect, useRef } from 'react';
// Brand assets — original CSS/SVG marks for Casa da Mãe Joana
// Avoiding photographic logo recreation; using the apron-pot motif as primary mark.

const BrandPot = ({ size = 80, color = 'var(--rose)', stroke = 2.4 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {/* steam */}
    <path d="M38 14 C 36 18, 40 22, 38 26" opacity="0.7" />
    <path d="M50 10 C 48 14, 52 18, 50 22" opacity="0.85" />
    <path d="M62 14 C 60 18, 64 22, 62 26" opacity="0.7" />
    {/* lid */}
    <ellipse cx="50" cy="34" rx="22" ry="4" />
    <circle cx="50" cy="29" r="2.5" fill={color} />
    {/* pot body */}
    <path d="M28 36 C 28 36, 26 56, 30 70 C 32 78, 38 82, 50 82 C 62 82, 68 78, 70 70 C 74 56, 72 36, 72 36 Z" />
    {/* spoon handle */}
    <path d="M58 38 L 62 24" />
  </svg>
);

const BrandHeart = ({ size = 32, color = 'var(--rose-soft)' }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M25 42 C 18 36, 8 28, 8 18 C 8 12, 13 8, 18 9 C 22 9.5, 24 12, 25 15 C 26 12, 28 9.5, 32 9 C 37 8, 42 12, 42 18 C 42 28, 32 36, 25 42 Z" />
  </svg>
);

const BrandSparkle = ({ size = 16, color = 'var(--rose-soft)' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
    <path d="M10 2 L 10 8 M 10 12 L 10 18 M 2 10 L 8 10 M 12 10 L 18 10" />
  </svg>
);

// Logo lockup — pot mark + serif wordmark
const Logo = ({ size = 90, mono = false, stack = true, label = 'CASA DA MÃE JOANA' }) => {
  const color = mono ? 'currentColor' : 'var(--rose)';
  return (
    <div style={{
      display: 'flex',
      flexDirection: stack ? 'column' : 'row',
      alignItems: 'center',
      gap: stack ? size * 0.12 : size * 0.2,
    }}>
      <BrandPot size={size} color={color} />
      <div className="serif-bold" style={{
        fontSize: size * 0.22,
        color,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
    </div>
  );
};

// Decorative branch (subtle) — abstract twigs
const BranchDeco = ({ width = 300, opacity = 0.4, flip = false }) => (
  <svg width={width} height={width * 0.6} viewBox="0 0 300 180" fill="none" stroke="var(--rose-pale)" strokeWidth="1.5" strokeLinecap="round" style={{ opacity, transform: flip ? 'scaleX(-1)' : 'none' }}>
    <path d="M10 90 C 60 85, 110 95, 160 88 C 210 82, 260 92, 295 88" />
    <path d="M40 90 C 35 75, 30 65, 25 55" />
    <path d="M80 88 C 78 100, 76 110, 72 122" />
    <path d="M120 92 C 116 76, 112 65, 108 56" />
    <path d="M170 86 C 172 100, 174 112, 178 124" />
    <path d="M220 90 C 216 76, 212 66, 206 54" />
    <path d="M260 90 C 262 102, 266 114, 270 126" />
  </svg>
);

const PolkaDots = ({ rows = 5, cols = 5, size = 12, gap = 6, color = 'currentColor', pattern = 'full' }) => {
  // pattern: 'full', 'fade-corner', 'half'
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let cls = '';
      if (pattern === 'fade-corner') {
        const dist = Math.max(r, c);
        if (dist >= rows - 1) cls = 'faded';
      } else if (pattern === 'half') {
        if (r + c >= rows) cls = 'faded';
      }
      cells.push(<span key={`${r}-${c}`} className={cls} />);
    }
  }
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, ${size}px)`,
      gridAutoRows: `${size}px`,
      gap: `${gap}px`,
      color,
    }}>
      {cells.map((cell, i) => (
        <span key={i} style={{
          display: 'block',
          background: 'currentColor',
          borderRadius: '50%',
          opacity: cell.props.className === 'faded' ? 0.35 : 0.95,
        }} />
      ))}
    </div>
  );
};

const WhatsAppIcon = ({ size = 16, color = '#25D366' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.6 6.3A7.85 7.85 0 0 0 12 4a7.95 7.95 0 0 0-6.74 12.18L4 21l4.93-1.29A7.95 7.95 0 0 0 12 20a7.95 7.95 0 0 0 8-7.95c0-2.13-.83-4.13-2.4-5.75ZM12 18.55a6.59 6.59 0 0 1-3.36-.92l-.24-.14-2.93.77.78-2.86-.16-.25a6.6 6.6 0 1 1 12.27-3.45A6.6 6.6 0 0 1 12 18.55Zm3.6-4.94c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.45.1-.13.2-.51.64-.62.77-.12.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.6-.53-1-1.18-1.12-1.38-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34l-.38-.01a.74.74 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .98.72 1.94.82 2.07.1.13 1.4 2.13 3.4 2.99.47.2.84.32 1.13.42.47.15.9.13 1.24.08.38-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.08-.18-.13-.38-.23Z"/>
  </svg>
);

const InstaIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.8" fill={color}/>
  </svg>
);



export { BrandPot, BrandHeart, BrandSparkle, Logo, BranchDeco, PolkaDots, WhatsAppIcon, InstaIcon };
