// Loads environment variables from the .env file.
import "dotenv/config";

// Imports Prisma configuration helpers.
import { defineConfig, env } from "prisma/config";

// Defines the Prisma configuration.
export default defineConfig({
  // Location of the Prisma schema file.
  schema: "prisma/schema.prisma",

  // Migration configuration.
  migrations: {
    // Directory where Prisma migrations are stored.
    path: "prisma/migrations",
  },

  // Database connection configuration.
  datasource: {
    // Reads the database URL from the DATABASE_URL environment variable.
    url: env("DATABASE_URL"),
  },
});