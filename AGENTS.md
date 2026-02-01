# Agentic Coding Guidelines - personal-website

This document provides essential information for AI agents operating in this repository.

## 1. Project Overview

A SvelteKit application built with Svelte 5, TypeScript, and Tailwind CSS. It uses Cloudflare D1 for the database and Vitest/Playwright for testing.

## 2. Essential Commands

### Build & Maintenance

- **Build**: `pnpm run build`
- **Lint**: `pnpm run lint` (runs Prettier and ESLint)
- **Format**: `pnpm run format` (runs Prettier write)
- **Type Check**: `pnpm run check` (svelte-check)
- **Sync**: `pnpm run prepare` (svelte-kit sync)

### Testing

- **Run all tests**: `pnpm run test` (Unit + E2E)
- **Unit Tests (Vitest)**: `pnpm run test:unit`
- **Run single unit test**: `pnpx vitest -t "test name"` or `pnpx vitest path/to/file.spec.ts`
- **E2E Tests (Playwright)**: `pnpm run test:e2e`
- **Vitest Browser Mode**: Uses Playwright as a provider for browser tests.

### Development

- **Dev Server**: `pnpm run dev` (starts Vite on port 3000) [DO NOT RUN THIS, assume it is already started]
- **Preview**: `pnpm run preview` (builds and runs wrangler dev) [DO NOT RUN THIS UNLESS EXPLICITY TOLD TO DO SO]
- **Cloudflare Typegen**: `pnpm run cf-typegen` (generates types for D1)

## 3. Code Style & Conventions

### Svelte 5 (Runes)

Always use Svelte 5 runes. Avoid legacy Svelte 4 syntax (e.g., `export let`).

- Use `$props()` for component properties.
- Use `$state()` for reactive variables.
- Use `$derived()` for computed state.
- Use `$effect()` for side effects (sparingly).
- Use `.svelte.ts` files for shared reactive logic (e.g., `src/lib/hooks/is-mobile.svelte.ts`).

### TypeScript & Types

- **Strict Mode**: The project is in strict TypeScript mode. Avoid `any`.
- **Global Types**: Defined in `src/global.d.ts`.
  - `Result<T, E>`: `{ ok: true, data: T } | { ok: false, error: E }`
  - `Prettify<T>`: Flattens complex types for better IDE tooltips.
  - `Brand<Base, Branding>`: For nominal typing.
- **Result Type**: Prefer returning `Result<T, E>` over throwing errors for expected failure cases.
  ```typescript
  return { ok: true, data: value };
  return { ok: false, error: new Error('message') };
  ```

### Imports & Path Aliases

- `@/*` aliases to `src/lib/*`. Use this for internal library imports.
- `$assets/*` aliases to `src/assets/*`.
- Standard SvelteKit `$lib/*` and `$app/*` aliases are also available.

### Styling (Tailwind CSS)

- Use Tailwind CSS for all styling.
- Use the `cn` utility for conditional classes and merging:
  ```typescript
  import { cn } from '@/utils';
  const classes = cn('base-class', condition && 'conditional-class', className);
  ```
- Components are based on shadcn-svelte (bits-ui) and located in `src/lib/components/ui/`.

### Database (Cloudflare D1)

- Use `sql-template-tag` for all SQL queries to ensure safety and proper typing.
- Queries should be tagged with `sql`:
  ```typescript
  import sql from './sql-template-tag';
  const query = sql`SELECT * FROM users WHERE id = ${id}`;
  ```
- Use `join` from `sql-template-tag` for lists in queries (e.g., `IN ${join(ids)}`).
- D1 bindings are available via `platform.env.FAMTREE` in server-side files.
- A database instance is available on `event.locals.db` (initialized in `hooks.server.ts`).

### Family Chart Library

- The project includes a significant local implementation of family tree logic in `src/lib/family-chart/`.
- This library uses D3.js and has a complex internal structure (core, features, renderers, store).
- When modifying this code, pay close attention to the `store` management and `renderer` patterns.

### Error Handling

- Use the global `Result<T, E>` type consistently across the codebase.
- Avoid broad `try/catch` blocks. Handle specific errors close to the source.
- Prefix unused variables with an underscore (e.g., `_err`) to satisfy lint rules.

## 4. File Structure & Naming

- **Components**: `kebab-case.svelte` (e.g., `family-card.svelte`).
- **Logic Files**: `camelCase.ts` or `kebab-case.ts`.
- **Reactive Logic**: Must use `.svelte.ts` extension if it contains runes.
- **Routes**: Standard SvelteKit directory-based routing in `src/routes`.
- **UI Components**: Located in `src/lib/components/ui/`. Follow the index-pattern for exports.

## 5. Linting & Formatting

- **Prettier**: Enforced via `npm run lint`. Ensure your editor is configured to use the project's `.prettierrc`.
- **ESLint**: Uses flat config (`eslint.config.js`).
- **Unused variables**: Disallowed unless prefixed with `_`.

## 6. Testing Best Practices

- **Unit Tests**: Place `.spec.ts` files next to the file they test or in `src/` (e.g., `demo.spec.ts`).
- **Component Tests**: Use `.svelte.spec.ts` for browser-based component tests.
- **E2E Tests**: Place in the `e2e/` directory.

## 7. Cloudflare Integration

- Configuration is in `wrangler.jsonc`.
- Use `platform.env.FAMTREE` to access the D1 database in server-side code.
- Types for the environment are generated into `src/worker-configuration.d.ts`.

---

_Note: This file is intended for AI agents. When in doubt, check existing patterns in the codebase._
