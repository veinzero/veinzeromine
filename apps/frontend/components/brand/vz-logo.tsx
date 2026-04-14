interface VZLogoProps {
  size?: number;
  id?: string;
  className?: string;
}

export function VZLogo({ size = 100, id = "default", className }: VZLogoProps) {
  const cyanGradient = `cg-${id}-${size}`;
  const goldGradient = `gg-${id}-${size}`;
  const glowFilter = `gf-${id}-${size}`;
  const softFilter = `gs-${id}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="VeinZero logo"
      role="img"
    >
      <defs>
        <linearGradient id={cyanGradient} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38F2CF" />
          <stop offset="100%" stopColor="#0CA88E" />
        </linearGradient>
        <linearGradient id={goldGradient} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F4C95D" />
          <stop offset="60%" stopColor="#FF8C6B" />
          <stop offset="100%" stopColor="#FF6B57" />
        </linearGradient>
        <filter id={glowFilter}>
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={softFilter}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <polygon points="50,3 94,26.5 94,73.5 50,97 6,73.5 6,26.5" fill="#0C1520" />
      <polygon
        points="50,3 94,26.5 94,73.5 50,97 6,73.5 6,26.5"
        fill="none"
        stroke={`url(#${cyanGradient})`}
        strokeWidth="1.5"
        opacity="0.85"
      />
      <polygon
        points="50,11 86,31 86,69 50,89 14,69 14,31"
        fill="none"
        stroke="#1E2D44"
        strokeWidth="0.7"
        opacity="0.5"
      />

      <line x1="6" y1="50" x2="94" y2="50" stroke="#38F2CF" strokeWidth="0.8" strokeDasharray="2 7" opacity="0.3" />
      <line x1="6" y1="26.5" x2="94" y2="73.5" stroke="#F4C95D" strokeWidth="0.5" strokeDasharray="1 9" opacity="0.18" />

      {[
        [50, 3],
        [94, 26.5],
        [94, 73.5],
        [50, 97],
        [6, 73.5],
        [6, 26.5]
      ].map(([cx, cy], index) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="2"
          fill="#38F2CF"
          opacity={index === 0 || index === 3 ? 1 : 0.6}
          filter={`url(#${softFilter})`}
        />
      ))}

      <path
        d="M 20,26 L 46,74 L 58,26"
        fill="none"
        stroke={`url(#${cyanGradient})`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowFilter})`}
      />

      <path
        d="M 51,26 L 80,26 L 31,74 L 60,74"
        fill="none"
        stroke={`url(#${goldGradient})`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowFilter})`}
      />

      <circle cx="63" cy="50" r="4" fill="#F4C95D" opacity="0.9" filter={`url(#${softFilter})`} />
      <circle cx="63" cy="50" r="1.5" fill="#0C1520" />
    </svg>
  );
}
