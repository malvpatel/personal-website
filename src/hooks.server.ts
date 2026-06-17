import type { Handle } from '@sveltejs/kit';
import { CloudflareD1 } from './db';

export const handle: Handle = ({ event, resolve }) => {
	event.locals.db = new CloudflareD1(event.platform!.env.FAMTREE);
	return resolve(event);
};
