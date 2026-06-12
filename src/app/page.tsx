import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-8 text-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Elias · Prototype
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Donor Interview
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/interview"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-zinc-900"
          >
            Open prototype
          </Link>
          <Link
            href="/design-system"
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/5 dark:border-white/15 dark:text-zinc-300 dark:hover:bg-white/5"
          >
            Design system
          </Link>
        </div>
      </div>
    </div>
  );
}
