# Inventory Management System (Apple Style)

A premium inventory management system built with Next.js 14, Bun, and Prisma.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Runtime**: Bun
- **Database**: Prisma with SQLite (Local) / Compatible with PostgreSQL (Production)
- **Styling**: Tailwind CSS 4 with Apple Design System
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Lab Requirements Met
- [x] **Lab 1**: GET `/inventory` with `low_stock` filtering and A-Z sorting.
- [x] **Lab 2**: POST `/inventory` with **TypeBox** validation.
- [x] **Lab 3**: PATCH `/inventory/:id/adjust` for relative stock changes.
- [x] **Lab 4**: DELETE `/inventory/:id` with quantity check (cannot delete if stock > 0).

## Vercel Deployment Note
This project uses SQLite for local development. To deploy on Vercel:
1. Provision a PostgreSQL database (e.g., Supabase, Neon, or Vercel Postgres).
2. Update the `DATABASE_URL` in Vercel environment variables.
3. Update `prisma/schema.prisma` to use `provider = "postgresql"`.
4. Remove the `adapter` configuration from `lib/prisma.ts` for standard Postgres usage or use a compatible adapter.

## Local Development
1. `bun install`
2. `bun x prisma migrate dev`
3. `bun prisma/seed.ts`
4. `bun run dev`
