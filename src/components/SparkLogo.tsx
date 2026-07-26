import sparkLogo from "@/assets/new-logo.png";

export function SparkLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      {/* Circle — forced white fill behind transparent PNG */}
      <div
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20 shadow-[var(--shadow-glow)]"
        style={{ backgroundColor: "#ffffff" }}
      >
        <img
          src={sparkLogo}
          alt="SPARK Tech AI Hub"
          className="h-full w-full object-contain"
          style={{ padding: "2px", background: "#ffffff" }}
        />
      </div>
      {/* Text */}
      <div className="min-w-0 leading-tight">
        <div className="truncate font-display text-base font-semibold tracking-tight">SPARK</div>
        <div className="truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tech AI Hub</div>
      </div>
    </div>
  );
}