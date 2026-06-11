import "dotenv/config";
import { defineConfig } from "prisma/config";

// Lexon DATABASE_URL nga process.env (pa hedhur gabim nëse mungon gjatë build-it).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
