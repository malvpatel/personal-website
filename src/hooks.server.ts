import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit/hooks';
import { building } from '$app/env';
import { createAuth } from '#lib/server/auth.ts';
import { svelteKitHandler, isAuthPath } from 'better-auth/svelte-kit';
import { CloudflareD1 } from './db';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env?.famtreedb) {
		throw new Error(
			'D1 binding "famtreedb" not found - are you running with wrangler?'
		);
	}

	event.locals.auth = createAuth(event.platform.env.famtreedb);

	const { auth } = event.locals;
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle = sequence(handleBetterAuth);
