import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

const databasePath = process.env.DATABASE_PATH;

if (!databasePath) throw new Error('DATABASE_PATH is not set');

const client = new Database(databasePath);

export const db = drizzle(client, { schema });
