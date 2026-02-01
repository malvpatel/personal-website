import { error } from '@sveltejs/kit';
import { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const r = await locals.db.findPersonByIds([1], { withRelations: false });

	if (!r.ok) {
		return error(404, { message: `Id - ${1} does not exists` });
	}

	return r;
};

// export const load: PageServerLoad = async ({ locals: { db } }) => {
// 	const result = await db.findPersonByIds([1], { withRelations: false });

// 	if (!result.ok) {
// 		return error(404, { message: `Id - ${1} does not exists` });
// 	}

// 	return result;
// };
