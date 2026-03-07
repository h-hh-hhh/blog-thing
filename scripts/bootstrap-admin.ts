import 'dotenv/config';

import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

import * as schema from '../src/lib/server/db/schema.js';

async function main() {
	const name = process.env.ADMIN_NAME;
	const password = process.env.ADMIN_PASSWORD;
	const databasePath = process.env.DATABASE_PATH;

	if (!name || !password) {
		console.error('ADMIN_NAME and ADMIN_PASSWORD must be set in the environment');
		process.exit(1);
	}

	if (!databasePath) {
		console.error('DATABASE_PATH must be set in the environment');
		process.exit(1);
	}

	const sqlite = new Database(databasePath, { create: true });
	const db = drizzle(sqlite, { schema });

	const passwordHash = await bcrypt.hash(password, 12);

	await db
		.insert(schema.users)
		.values({
			name,
			passwordHash,
			role: 'admin'
		})
		.onConflictDoNothing({ target: schema.users.name });

	console.log(`Ensured admin user exists for name ${name}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
