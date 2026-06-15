# Mar-Health

Premium healthcare and wellbeing landing page built with TanStack Start, React 19, TypeScript, Vite, Tailwind CSS v4, and shadcn/Radix-style UI primitives.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

The application runs on `http://localhost:3000` in development.

## Build Notes

- TanStack Start provides the SSR-ready React app shell and file-based routing.
- Tailwind CSS v4 is wired through the Vite plugin.
- The UI uses reusable Radix-style primitives with `class-variance-authority`, `tailwind-merge`, and `@radix-ui/react-slot`.
- The landing page follows the provided Mar-Health PRD with a large editorial hero, modular medical cards, animated reveal sections, and an interactive featured programs selector.
