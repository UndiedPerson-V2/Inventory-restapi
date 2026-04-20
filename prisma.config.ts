import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.STORAGE_POSTGRES_PRISMA_URL || process.env.POSTGRES_PRISMA_URL || "",
    directUrl: process.env.STORAGE_POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL_NON_POOLING || "",
  },
});
