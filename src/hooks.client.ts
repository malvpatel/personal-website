import type { Handle } from "@sveltejs/kit/hooks";

const handleProtectedRoutes: Handle = async ({ event, resolve }) => {

    console.log(event.route.id);

    return resolve(event);
};

export const handle = handleProtectedRoutes;