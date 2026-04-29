# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **yarn** (committed `yarn.lock`). Node version is pinned in `.nvmrc` (24.9.0).

- `yarn dev` — start Next.js dev server on **port 8000** (Turbopack).
- `yarn build` — production build (Turbopack).
- `yarn start` — run the production build.
- `yarn lint` — run ESLint (`next/core-web-vitals` + `next/typescript`).
- `yarn format` — Prettier write over `src/**/*.{js,jsx,ts,tsx,css,json}`.

There is no test runner configured. A Husky `pre-commit` hook runs `yarn lint && yarn format`; don't bypass it.

Prettier is opinionated for this repo: `printWidth: 150`, double quotes, trailing commas, `arrowParens: "avoid"`, plus `prettier-plugin-tailwindcss` (class ordering is enforced).

Path alias: `@/*` → `./src/*`.

## Architecture

This is a multi-tenant Next.js 16 App Router app (React 19, TypeScript strict) for the **Axis** school-management product. Two distinct audiences live in the same app: school staff (`/staff/*`) and parents (`/parents/*`).

### Auth & session

Auth is cookie-based with a JWT stored in an `httpOnly` cookie named `token`. There is no NextAuth or client-side session store — session I/O is done through server actions in [src/app/actions/auth.ts](src/app/actions/auth.ts):

- `createSession(token, userType)` — sets the cookie and `redirect`s to `/staff` or `/parents`.
- `deleteSession()` — clears the cookie and redirects to `/auth/staff`.
- `getSessionToken()` — server-side reader; **redirects to `/` if no token**, so only call from authenticated contexts.
- `getSessionData()` — same but returns `{ user: null }` instead of redirecting; this is what layouts use.

Decoded JWT shape is `JWTPayload` in [src/types.ts](src/types.ts) — includes `schoolId`, `permissions: string[]`, `branchIds`, `armIds`, `subjectIds`, `isMain`, `isAdmin`. Treat `permissions` as the source of truth for gating UI.

Client-side, [src/hooks/useLoggedInUser.ts](src/hooks/useLoggedInUser.ts) fetches the token via the server action and decodes it locally. Permissions checks should go through this hook + the utilities in `src/lib/permissions/`, not by reading the cookie directly.

### Middleware & multi-tenant subdomains

[src/middleware.ts](src/middleware.ts) does three things:

1. **Subdomain rewrites** for parent onboarding. A request to `greenwood.axis.com/onboarding` (or `greenwood.localhost:3000/onboarding`) is rewritten to `/parents/greenwood/onboarding`. Main domains (`axis.com`, `app.axis.com`, `localhost:3000`) are excluded. When touching onboarding/parent routing, keep this in mind — the URL the user sees is not the URL Next.js renders.
2. **Root redirect** — `/` → `/auth/staff`.
3. **Auth gating** — if no token and the path starts with `/staff` or `/parent`, redirect to the corresponding auth route. Logged-in users hitting an auth route are bounced to `/staff/`.

The `matcher` explicitly excludes `api`, `_next/*`, `favicon.ico`, `icons`, `fonts`, and `*.png` — middleware does not run there.

### Data layer: API → queries → hooks

Server data is split into three parallel layers, one file per domain entity (admission, arm, assessment, attendance, branch, class, department, grading, level, parent, result, role, school, score, staff, student, subject, term, etc.):

- **[src/api/*.ts](src/api/)** — raw axios calls. Every request uses `api` from [src/lib/axios/axios-auth.ts](src/lib/axios/axios-auth.ts), which attaches `Bearer <token>` via a request interceptor and calls `deleteSession()` on 401/403. Public/unauthenticated calls use `axios-public.ts`. The consistent pattern is `try { ... } catch (error) { if (isAxiosError(error)) throw error.response?.data; throw error; }` — errors are re-thrown as the server's JSON payload so mutations can read server-provided messages.
- **[src/queries/*.ts](src/queries/)** — Tanstack Query key factories (e.g., `subjectKeys`). Keys that depend on params are functions returning readonly tuples; stable keys are `as const` arrays. Some files also export per-domain config constants (e.g., `REPORT_STATUS_CONFIG` in `queries/subject.ts`).
- **[src/hooks/queryHooks/use*.ts](src/hooks/queryHooks/)** — `useQuery`/`useMutation` wrappers. Mutations typically invalidate multiple related keys (e.g., adding a subject to a class invalidates both `subjectsByClass` and `classesByLevel`). When adding a mutation, audit for related caches in the same file.

`QueryClient` defaults ([src/lib/tanstack.ts](src/lib/tanstack.ts)): `staleTime: 5 * 60 * 1000`, `retry: 2`, `refetchOnWindowFocus: false`. Individual hooks commonly override `retry: false`.

Base URL comes from `NEXT_PUBLIC_API_BASE_URL`.

### Client state

Zustand stores live in [src/store/](src/store/) (`admission`, `breadcrumb`, `classes`, `onboarding`, `sidebar`, `staff`, `student`, `useParentStore`, etc.). Only `useSidebarStore` and `useOnboardingStore` are re-exported from `store/index.ts` — other stores are imported directly from their file.

### Permissions

[src/lib/permissions/](src/lib/permissions/) contains one file per product module (`attendance.ts`, `classes-and-subjects.ts`, `fees.ts`, `invoices.ts`, `stock.ts`, `settings.ts`, …). Each exports small predicates like `canViewClassesAndSubjects(permissions)` and `canManageClassesAndSubjects(permissions)` backed by the shared `hasPermission` helper in `index.ts`.

Two wrappers in [src/components/ModulePermissionsWrapper/](src/components/ModulePermissionsWrapper/) consume these predicates:

- `ModulePermissionsWrapper` — **full-page gate**. Renders a loading skeleton until the user loads, then either the children or a `PageEmptyState` with a link back to `/staff/`.
- `PermissionCheck` — **inline gate**. Renders children only if the predicate passes; renders nothing otherwise. Use this for buttons/sections inside an already-gated page.

When adding a new module, create a new `src/lib/permissions/<module>.ts` file with `canView*`/`canManage*` utilities and wrap the page with `ModulePermissionsWrapper`.

### Routing structure

- [src/app/staff/(core)/](src/app/staff/) — authenticated staff app; `(core)/layout.tsx` renders `Sidebar` + `Header` and mounts `OnboardingFlow` when the logged-in user has no `schoolId`. Subroutes include `attendance`, `classes-and-subjects`, `fee-collection`, `fees`, `invoices`, `profile`, `settings` (academic, general, invoice, permissions, result, security, stock, subscription), `stock`, `student-and-parent-record`.
- [src/app/parents/](src/app/parents/) — parent-facing app, including the subdomain-rewritten `[schoolSlug]/onboarding` route.
- [src/app/auth/](src/app/auth/) — `staff` and `parent` login/signup; these are the only routes that work without a token.
- [src/app/api/](src/app/api/) — Next.js route handlers: `countries`, `states`, `image-upload`, `upload-template`.
- [src/app/actions/](src/app/actions/) — server actions (`auth.ts`, `country.ts`, `upload-image.ts`).

### UI system

shadcn/ui (New York style, zinc base, Lucide icons) generates primitives into [src/components/ui/](src/components/ui/) — do not hand-edit these unless necessary; prefer composing feature components in the sibling folders (`Header`, `Sidebar`, `DataTable`, `Modal`, etc.). Toasts use `sonner` (`<Toaster position="bottom-right" richColors closeButton />` is mounted in the root layout). Tables use `@tanstack/react-table`. Charts use `recharts`.

Forms use **Formik + Yup** — validation schemas live in [src/schema/](src/schema/) by domain (`auth`, `parent`, `school`, `staff`, `student`, `role`, `academic`).

### Domain vocabulary

Enough domain concepts recur that recognizing them saves time:

- **Level** — a stage of schooling: `CRECHE | KINDERGARTEN | NURSERY | PRIMARY | JUNIOR_SECONDARY | SENIOR_SECONDARY`. Sort helper in [src/lib/utils.ts](src/lib/utils.ts) (`LEVEL_ORDER`) enforces display order across the app.
- **Class / Arm / Department** — a class contains arms (sections like "JSS 1 A"); SSS classes additionally have departments (Science/Arts/Commercial) that carry their own subject sets.
- **Term / Academic Session** — `FIRST | SECOND | THIRD`; sessions look like `2024/2025`.
- **Assessment / Grading / Result** — per-level configuration for scoring (CA1, CA2, Exam weights), grade bands (A/B/C with upper/lower bounds), and result calculation (`THIRD_TERM_ONLY` vs `CUMULATIVE`, promotion types `PROMOTE_ALL | MANUAL | BY_PERFORMANCE`).
- **Branch** — a school tenant can have multiple branches; many settings accept `branchSpecific` + `branchId` to override defaults per branch.

### File uploads

Uploads go to Digital Ocean Spaces via the S3 SDK — see [src/lib/digitalOceanSpaces.ts](src/lib/digitalOceanSpaces.ts) (env: `DIGITAL_OCEAN_SPACES_REGION/ENDPOINT/KEY/SECRET`). The `/api/image-upload` route and `src/app/actions/upload-image.ts` server action are the entry points. Report exports use `exceljs`, `xlsx`, `jspdf`, `html2canvas`, and `papaparse`.
