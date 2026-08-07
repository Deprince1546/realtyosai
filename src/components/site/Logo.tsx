export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect
          x="1.1"
          y="1.1"
          width="10.4"
          height="10.4"
          rx="3.2"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.85"
        />
        <rect
          x="6.5"
          y="6.5"
          width="10.4"
          height="10.4"
          rx="3.2"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.6"
        />
      </svg>
      <span className="font-display text-[15px] tracking-[0.02em] text-foreground">RealtyOS</span>
    </span>
  );
}
