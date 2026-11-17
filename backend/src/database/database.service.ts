import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Pool, QueryResultRow } from "pg";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://pustaka:pustaka_dev@127.0.0.1:5544/pustaka",
    connectionTimeoutMillis: 5000,
    max: 5,
  });

  async onModuleInit() {
    this.pool.on("error", (error) =>
      console.error("PostgreSQL connection error:", error.message),
    );
    await this.pool.query("SELECT 1");
  }

  async query<T extends QueryResultRow>(sql: string, values: unknown[] = []) {
    try {
      return await this.pool.query<T>(sql, values);
    } catch (error) {
      if ((error as { code?: string }).code === "23505") throw error;
      console.error("Database query failed:", (error as Error).message);
      throw new ServiceUnavailableException(
        "Database belum dapat diakses. Coba lagi nanti.",
      );
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
