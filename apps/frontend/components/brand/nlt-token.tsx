interface NLTTokenProps {
  size?: number;
  className?: string;
}

export function NLTToken({ size = 56, className }: NLTTokenProps) {
  const gradientId = `nltg-${size}`;
  const glowId = `nltglow-${size}`;

  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} aria-label="NLT token" role="img">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4C95D" />
          <stop offset="100%" stopColor="#FF6B57" />
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="30" cy="30" r="28" fill="#131D2E" />
      <circle cx="30" cy="30" r="28" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <circle cx="30" cy="30" r="22" fill="none" stroke="#1E2D44" strokeWidth="0.8" opacity="0.5" />
      <text
        x="30"
        y="35"
        textAnchor="middle"
        fontFamily="Oxanium"
        fontWeight="800"
        fontSize="15"
        fill={`url(#${gradientId})`}
        letterSpacing="1.5"
        filter={`url(#${glowId})`}
      >
        NLT
      </text>
    </svg>
  );
}
