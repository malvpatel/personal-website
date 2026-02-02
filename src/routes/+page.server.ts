import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const treeId = 1;

	// Run queries in parallel
	const [personsResult, unionsResult, linksResult] = await Promise.all([
		locals.db.person.findByTreeId(treeId),
		locals.db.union.findByTreeId(treeId),
		locals.db.parentChild.findByTreeId(treeId)
	]);

	if (!personsResult.ok) throw error(500, personsResult.error.message);
	if (!unionsResult.ok) throw error(500, unionsResult.error.message);
	if (!linksResult.ok) throw error(500, linksResult.error.message);

	return {
		persons: personsResult.data,
		unions: unionsResult.data,
		links: linksResult.data
	};
};
