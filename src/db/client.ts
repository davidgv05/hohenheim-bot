import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../config.js";
import { logger } from "../lib/logger.js";
import * as schema from "./schema.js";

export const pool = new pg.Pool({ connectionString: config.DATABASE_URL, connectionTimeoutMillis: 5_000 });




pool.on("error", (err)=>{logger.error({err}, "Idle database connection failed");
})




export const db = drizzle({ client: pool, schema });
