import { fail } from '@sveltejs/kit';
import { loginSchema } from '@/schema';

import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	return { success: true };

	// return {
	// 	loginForm: await superValidate(zod4(loginSchema))
	// };
};

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const result = loginSchema.safeParse(Object.fromEntries(data.entries()));

		if (!result.success) {
			return fail(400, { error: result.error });
		}

		const { email } = result.data;

		const user = await locals.db.users.create(email);

		return { success: true, user };
	}
};
