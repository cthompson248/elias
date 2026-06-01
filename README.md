# Elias

A Next.js boilerplate configured for GitHub and Vercel.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [GitHub](https://github.com) for source control
- [Vercel](https://vercel.com) for hosting and preview deployments

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start dev server         |
| `npm run build`| Create production build  |
| `npm run start`| Serve production build   |
| `npm run lint` | Run ESLint               |

## Deployment

Pushes to the default branch deploy to Vercel production. Pull requests get preview URLs automatically when the GitHub integration is connected.

Manual deploy:

```bash
vercel
```

Production deploy:

```bash
vercel --prod
```

## Project structure

```text
src/
  app/
    layout.tsx    # Root layout and metadata
    page.tsx      # Home page
    globals.css   # Global styles
public/           # Static assets
```
