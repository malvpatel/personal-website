import { personRepository } from './repositories/person';
import { treeRepository } from './repositories/tree';
import { userRepository } from './repositories/user';
import { unionRepository } from './repositories/union';
import { parentChildRepository } from './repositories/parent-child';
import { treeMemberRepository } from './repositories/tree-member';

// Helper type to strip the first argument (db) from a function
type BoundRepo<T> = {
	[K in keyof T]: T[K] extends (db: D1Database, ...args: infer A) => infer R
		? (...args: A) => R
		: T[K];
};

export type Database = {
	person: BoundRepo<typeof personRepository>;
	tree: BoundRepo<typeof treeRepository>;
	user: BoundRepo<typeof userRepository>;
	union: BoundRepo<typeof unionRepository>;
	parentChild: BoundRepo<typeof parentChildRepository>;
	treeMember: BoundRepo<typeof treeMemberRepository>;
};

function bindRepo<T extends Record<string, any>>(
	db: D1Database,
	repo: T
): BoundRepo<T> {
	const bound: any = {};
	for (const key of Object.keys(repo)) {
		const prop = repo[key];
		if (typeof prop === 'function') {
			bound[key] = (...args: any[]) => prop(db, ...args);
		} else {
			bound[key] = prop;
		}
	}
	return bound;
}

export function createCloudflareD1(db: D1Database): Database {
	return {
		person: bindRepo(db, personRepository),
		tree: bindRepo(db, treeRepository),
		user: bindRepo(db, userRepository),
		union: bindRepo(db, unionRepository),
		parentChild: bindRepo(db, parentChildRepository),
		treeMember: bindRepo(db, treeMemberRepository)
	};
}
