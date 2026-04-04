export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 animate-pulse">
      {/* Header row: icon placeholder + title */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      </div>

      {/* Body lines */}
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
        <div className="h-3 w-4/6 rounded bg-muted" />
      </div>

      {/* Footer action area */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-8 w-24 rounded-md bg-muted" />
      </div>
    </div>
  );
}
