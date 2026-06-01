export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-black/5 px-6 py-4 dark:border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-sm font-semibold tracking-tight">Elias</span>
          <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <a
              href="https://github.com/cthompson248/elias"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Vercel
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-20">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Boilerplate
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            A clean starting point for your next project.
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Next.js, TypeScript, Tailwind CSS, GitHub, and Vercel — wired up and
            ready to ship. Edit{" "}
            <code className="rounded bg-black/5 px-1.5 py-0.5 text-sm dark:bg-white/10">
              src/app/page.tsx
            </code>{" "}
            to make it yours.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Read the docs
            </a>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-6 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
            >
              Deploy to Vercel
            </a>
          </div>
        </div>

        <section className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Next.js 16",
              description: "App Router, Server Components, and Turbopack dev server.",
            },
            {
              title: "GitHub",
              description: "Version control with automatic preview deploys on push.",
            },
            {
              title: "Vercel",
              description: "Production hosting optimized for Next.js applications.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-black/5 p-5 dark:border-white/10"
            >
              <h2 className="text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
