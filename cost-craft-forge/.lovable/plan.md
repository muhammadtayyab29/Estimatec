# EstimaTec — Build Plan

A frontend-only SaaS prototype with three role-based portals (Admin, Estimator, Agent), fully mocked data, and a simulated AI estimation pipeline.

## Stack adaptation
The project template uses **TanStack Start + TanStack Router** (not React Router v6 + CRA/Vite-only as your prompt assumed). I'll adapt:
- Routing → file-based routes under `src/routes/` (e.g. `src/routes/admin/dashboard.tsx`)
- Auth context + role guards via `beforeLoad` in pathless layout routes (`_admin`, `_estimator`, `_agent`)
- TypeScript (the template is TS — keeping JS-only is not practical here)
- Toasts via the bundled `sonner`
- Tailwind v4 tokens in `src/styles.css`

## Color palette — white & brown (per your final instruction)
Overriding the dark navy palette from the prompt body. Light, warm, premium feel:
- Background: warm off-white `#FAF7F2`
- Surface: pure white with subtle brown border
- Primary brown: `#6B4423` (deep walnut)
- Accent brown: `#A0744A` (caramel)
- Soft tan: `#E8DCC8`
- Success: `#5A7D3A` (olive), Warning: `#C8841A`, Danger: `#B33A2C`
- Text: `#2A1F17` (espresso), Muted: `#8B7355`
- Portal accent tints (on sidebar headers): Admin = deep espresso gradient, Estimator = walnut gradient, Agent = warm tan gradient
- Glassmorphism kept but light (white blur with brown borders)
- Fonts: Inter + JetBrains Mono

## Pages (22 total)

**Shared**
1. `/login` — role pills, mock credentials, animated bg

**Admin portal** (`/admin/*`, espresso sidebar)
2. Dashboard — 4 KPIs, bar + donut charts, recent projects, quick actions
3. All Projects — table, filters, new project modal, assign agent
4. All Quotations — table with approve/reject
5. User Management — table, invite modal, role badges
6. Agent Assignments — agent cards + assignment table, auto-assign
7. Activity Log — timeline, filters
8. Settings — Profile / System / API tabs

**Estimator portal** (`/estimator/*`, walnut sidebar)
9. Dashboard — KPIs, my projects, quick action cards, pipeline replay
10. My Projects — scoped table, new project modal
11. Drawing Upload — react-dropzone, simulated progress
12. AI Estimation Runner — 6-step animated pipeline w/ confetti, preview card
13. My Quotations — table
14. Full CSI Quotation View — accordion table, chart, AI detection card
15. Activity timeline
16. Settings

**Agent portal** (`/agent/*`, tan sidebar)
17. Dashboard — KPIs, assigned project cards, review queue
18. Assigned Projects — read-only table
19. Quotation Review — CSI table + sticky approve/flag/comment toolbar + comments thread
20. Flagged Items — table
21. Notes & Comments — card layout w/ expandable threads
22. Activity timeline
23. Settings

## Services & mock data
- `src/services/` — auth, project, upload, estimation (setTimeout chain simulating WS), quotation, user, agent, activity, cci
- `src/data/mockData.ts` — 10 projects, 10 users, 20 activity entries, full CSI quotation, flagged items, comments, CCI zip table, pipeline step config
- Each service returns Promise w/ 400–800ms delay
- All easily swappable to real FastAPI later (one file each)

## Components
- `src/components/shared/` — CSITable, StatCard, Toast wrapper, Modal, ChartCard, PipelineStepper, ConfettiBurst, BadgeStatus, Sidebar primitives
- Portal layouts: `AdminLayout`, `EstimatorLayout`, `AgentLayout` (each = pathless route w/ `beforeLoad` guard + colored sidebar)

## Auth & route protection
- `AuthContext` stores mock user + token in localStorage
- Pathless layout routes `_admin.tsx`, `_estimator.tsx`, `_agent.tsx` each:
  - Redirect to `/login` if unauthenticated
  - Redirect to own dashboard if wrong role
- Login form auto-fills demo creds on role pill click

## Scope notes
This is a **very large** build (~22 pages, ~30+ components, mock services, charts, animations). I'll build it in one pass but pages will share components heavily to stay maintainable. The result will be a polished, navigable prototype — every page reachable, every button wired to mock services, all toasts and modals working.

## Confirmation needed
1. **Palette**: confirming white + brown (light theme), overriding the dark navy from the prompt body.
2. **TanStack Start + TypeScript** instead of CRA + plain JS — required by the template.
3. **Scope**: build all 22 pages now in one pass? (Large but doable.)

Reply "go" (or with changes) and I'll start building.