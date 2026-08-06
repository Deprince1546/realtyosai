export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect
          x="1.25"
          y="1.25"
          width="13.5"
          height="13.5"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.75"
        />
        <circle cx="8" cy="8" r="2.6" fill="currentColor" />
      </svg>
      <span className="font-display text-[15px] tracking-[0.02em] text-foreground">RealtyOS</span>
    </span>
  );
}
