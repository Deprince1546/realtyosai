export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      <span className="bg-linear-to-b from-white via-white to-[oklch(0.72_0.01_260)] bg-clip-text text-transparent">
        Realty
      </span>
      <span className="bg-linear-to-b from-[oklch(0.92_0.10_92)] via-[oklch(0.80_0.14_88)] to-[oklch(0.62_0.11_80)] bg-clip-text text-transparent">
        OS
      </span>
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="RealtyOS"
        width={22}
        height={22}
        className="h-[22px] w-auto"
        loading="eager"
      />
      <Wordmark className="font-display text-[15px] tracking-[0.02em]" />
    </span>
  );
}
