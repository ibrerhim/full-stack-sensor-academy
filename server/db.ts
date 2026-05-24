import { PrismaClient } from "@prisma/client";

// Safe database connection initialization wrapping Prisma.
// Avoids fatal startup crashes if the connection string matches a placeholder or is temporarily unavailable.
let prismaClientInstance: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!prismaClientInstance) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn("Warning: DATABASE_URL is not defined. Ensure a valid PostgreSQL connection URI is passed.");
    }
    prismaClientInstance = new PrismaClient();
  }
  return prismaClientInstance;
}
