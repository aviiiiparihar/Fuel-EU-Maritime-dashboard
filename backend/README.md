# Backend

## Prisma + Supabase PostgreSQL

This project uses Prisma with Supabase Postgres.

### 1) Configure environment variables

Copy `.env.example` to `.env` and fill in the two URLs from Supabase:

- **`DATABASE_URL`**: Supabase **Connection pooling** (PgBouncer) connection string (Transaction pooler).
  - Make sure the query includes `pgbouncer=true`.
  - Recommended: add `connection_limit=1`.
- **`DIRECT_URL`**: Supabase **Direct connection** connection string (non-pooler).
  - Prisma uses this for migrations to avoid PgBouncer limitations.

You can find both in Supabase at **Project Settings → Database → Connection string**.

### 2) Generate Prisma client

```bash
npx prisma generate
```

### 3) Run migrations against Supabase

```bash
npm run prisma:migrate
```

### 4) Seed initial data

```bash
npm run prisma:seed
```

