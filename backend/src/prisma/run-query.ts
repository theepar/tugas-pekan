import {
  ConflictException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

export async function runQuery<T>(
  operation: () => Promise<T>,
  notFoundMessage: string,
  conflictMessage = "Data sudah digunakan.",
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") throw new ConflictException(conflictMessage);
      if (error.code === "P2025") throw new NotFoundException(notFoundMessage);
    }
    console.error("Database query failed:", (error as Error).message);
    throw new ServiceUnavailableException(
      "Database belum dapat diakses. Coba lagi nanti.",
    );
  }
}
