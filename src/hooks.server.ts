import type { Handle } from '@sveltejs/kit';
import { createCloudflareD1 } from './db';

export const handle: Handle = ({ event, resolve }) => {
	event.locals.db = createCloudflareD1(event.platform!.env.FAMTREE);
	return resolve(event);
};
