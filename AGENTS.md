# Project guide

## Technology choices

Use the following stack for this project:

| Area | Choice | Current status |
| --- | --- | --- |
| Frontend | React 19 | Installed |
| Build tool | Vite | Configured |
| Language | TypeScript | Configured |
| Routing | TanStack Router, file-based | Configured; router-only single-page app (`/`, `/pipeline`, `/replay`) |
| Data fetching | TanStack Query v5+ | Not installed — every value in the app is local |
| Styling | Tailwind CSS | Version 4 through the Vite plugin, bridged to the design tokens in `src/styles.css` |
| UI components | shadcn/ui | Configured (`components.json`); Radix primitives in `src/components/ui` |
| Icons | Lucide Icons (`lucide-react`) | Installed; wrapped by `src/components/design/Icon.tsx` |
| Formatting and linting | Biome | Configured in `biome.json` |
| Hosting | Cloudflare | Preferred target; deployment not yet configured |
| Package manager | npm | Use the existing `package-lock.json` |

These statuses describe the initial scaffold. Check the repository before assuming an intended dependency or deployment integration is available.

## Implementation conventions

- Keep the existing router-only architecture. Introducing TanStack Start or server-side rendering is a separate architecture decision.
- Define routes in `src/routes`. Do not manually edit `src/routeTree.gen.ts`; regenerate it with the routing tools.
- Use TanStack Query for remote data fetching, caching, and mutations when needed. Add the dependency and provider when implementing those features.
- Use Tailwind CSS for styling, shadcn/ui for reusable UI components, and Lucide for icons. Install and configure missing pieces as features require them.
- The visual language comes from the Claude Design project *Waqas Yousafzai CV Design System*. Its tokens and component classes are vendored verbatim into `src/styles/` and are excluded from Biome so they can be re-synced cleanly; `src/components/design/` holds the TypeScript ports of its components. Change a token there, not at the call site.
- shadcn/ui covers the primitives that map onto Radix (button, dialog, tabs, switch, tooltip). Each generated file is restyled onto the design system's `ds-*` classes rather than shadcn's default palette — keep that pattern when adding more.
- Follow `biome.json` for formatting, linting, and import organization. Do not introduce ESLint or Prettier without a project requirement.
- Use npm for dependency changes and keep `package-lock.json` in sync.
- Target Cloudflare for hosting. Select and document the specific Cloudflare service when deployment is implemented, including support for direct navigation to client-side routes.

## Existing commands

- `npm run dev` — start the development server on port 3000.
- `npm run generate-routes` — regenerate the route tree.
- `npm run build` — produce a production build with Vite.
- `npm run preview` — preview the production build locally.
- `npm run check` — run Biome checks.
- `npm run lint` — run Biome linting.
- `npm run format` — check formatting; pass `-- --write` to apply formatting.

For application changes, run the relevant Biome checks and a production build. The build script does not run a separate TypeScript type check; use `npx tsc --noEmit` when validating TypeScript changes. No automated test script is currently configured.

## Git

- Before making notable changes, suggest creating a dedicated branch. Use a concise name with conventional prefix such as `feat/`, `fix/`, `docs/`. 
- When opening a pull request:
  - Submit a formal review directly to GitHub's PR review system (e.g., via `gh pr review <PR_NUMBER> --comment -b "..."`).
  - Maintain a consistent review format:
    - **File changed**
    - **Type of Change**
    - **Diff Analysis**
    - **Review Assessment**
  - Ask whether the branch's commits should be squashed before merging.
  - Present review summary to the user in a MD on the IDE and obtain explicit sign-off before executing the merge. Delete the MD file after merge.