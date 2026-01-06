import { query, getRequestEvent } from '$app/server';

export const getTables = query(async () => {
	const platform = getRequestEvent().platform!;

	const data = await platform.env.FAMTREE.prepare(
		`
        SELECT name 
        FROM sqlite_master 
        WHERE type = 'table'
        ORDER BY name;
    `
	).all();

	if (!data.success) {
		return [];
	}

	return data.results;
});
