import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // ให้ค่าสำรองเป็นรูปแบบ PostgreSQL เสมอเพื่อไม่ให้ Prisma Generate พัง
    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/postgres",
  },
});
