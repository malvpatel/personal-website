import { redirect } from "@sveltejs/kit";

const getSafeUser = (locals: App.Locals) => {

    const authenticated = !!locals.user;
    if (!authenticated) {
        return redirect(302, '/');
    }

    return {
        name: locals.user!.name,
        email: locals.user!.email
    };
};

export const load = async ({ locals }) => {

    return {
        user: getSafeUser(locals)
    };
};