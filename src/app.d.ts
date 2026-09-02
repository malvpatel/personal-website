import type { User, Session } from 'better-auth';
import { createAuth } from '#lib/server/auth.ts';

// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Database } from './db';

// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}

		interface Locals {
			db: Database;
			user?: User;
			session?: Session;
			auth: ReturnType<typeof createAuth>;
		}
	}
}

export { };
