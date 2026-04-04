export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      {/* Pulsing gradient circle */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 via-blue-500 to-cyan-400 animate-pulse-glow blur-md" />
        <div className="absolute inset-1 rounded-full bg-background" />
        <div className="relative h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-violet-500" />
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">Loading</span>
        <span className="flex gap-0.5">
          <span
            className="inline-block h-1 w-1 rounded-full bg-muted-foreground"
            style={{ animation: "pulse-glow 1.4s ease-in-out infinite" }}
          />
          <span
            className="inline-block h-1 w-1 rounded-full bg-muted-foreground"
            style={{ animation: "pulse-glow 1.4s ease-in-out 0.2s infinite" }}
          />
          <span
            className="inline-block h-1 w-1 rounded-full bg-muted-foreground"
            style={{ animation: "pulse-glow 1.4s ease-in-out 0.4s infinite" }}
          />
        </span>
      </div>
    </div>
  );
}
