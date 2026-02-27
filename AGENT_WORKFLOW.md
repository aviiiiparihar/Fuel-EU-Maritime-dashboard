## AI Agents Used
- Cursor AI (primary coding agent)
- ChatGPT (prompt engineering + planning)

## Step-by-Step Prompt Workflow
1. Backend scaffold
   - Created `/backend` with TypeScript (strict), ESLint + Prettier, Jest + Supertest, and the initial hexagonal folder structure.
2. Domain modeling
   - Implemented DDD-inspired core domain models and domain services in `src/core/domain/` with no framework/ORM dependencies.
   - Added application use-cases in `src/core/application/` and repository port interfaces in `src/core/ports/`.
3. Database adapters
   - Added Prisma schema + migrations + seed for PostgreSQL (Supabase).
   - Implemented outbound repository adapters under `src/adapters/outbound/postgres/` using Prisma, mapped to the core ports.
4. API layer
   - Implemented inbound HTTP adapters (Express controllers) and server wiring in `src/infrastructure/server/`.
   - Added request validation and a global error handler.
5. Frontend scaffold
   - Created `/frontend` with Vite + React + TypeScript (strict), Tailwind, Axios, React Query, Recharts, and React Router.
   - Added a sidebar layout and page routing structure.
6. Routes page
   - Implemented route listing with filters and baseline selection using React Query.
7. Compare page
   - Implemented comparison table + Recharts bar chart with target intensity reference line and baseline labeling.
8. Banking page
   - Implemented ship/year search, KPI cards (CB/banked/adjusted), and banking/apply flows with React Query mutations.
9. Pooling page
   - Implemented pool creation form, ship multi-select, results table, and pool compliance summary indicator.
10. Documentation
   - Created root documentation (`README.md`, `AGENT_WORKFLOW.md`, `REFLECTION.md`) summarizing setup and workflow.

## Where AI Helped Most
- Architecture scaffolding
- Boilerplate generation
- API wiring
- UI scaffolding

## Where Manual Fixes Were Needed
- Debugging
- Supabase connection
- Styling tweaks
- Minor API fixes

