import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="text-8xl font-bold tracking-tighter text-muted-foreground/20">
          404
        </span>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            The page you are looking for does not exist or has been moved. Let us
            get you back on track.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Home className="size-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
