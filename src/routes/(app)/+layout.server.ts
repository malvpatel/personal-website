import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await locals.db.users.getByID(1000);

	return {
		id: user.id,
		host: 'Malav Patel'
	};
};
