import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      {/* 404 badge */}
      <div className="relative">
        <span className="text-8xl font-bold tracking-tighter text-muted-foreground/20">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-violet-500 via-blue-500 to-cyan-400 opacity-60 blur-xl" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">
          The page you are looking for does not exist or has been moved. Let us
          get you back on track.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
