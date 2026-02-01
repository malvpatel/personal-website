/**
 * Tree Repository
 */

import sql from '../sql-template-tag';
import type {
	Tree,
	TreeRow,
	CreateTreeInput,
	UpdateTreeInput
} from '../schema';
import { toTree } from '../schema';

// =============================================================================
// QUERIES
// =============================================================================

export async function findById(
	db: D1Database,
	id: number
): Promise<Result<Tree | null, Error>> {
	try {
		const query = sql<TreeRow>`
			SELECT id, name, description, created_by, created_at, updated_at
			FROM tree
			WHERE id = ${id}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<TreeRow>();

		if (!result) {
			return { ok: true, data: null };
		}

		return { ok: true, data: toTree(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find tree by id: ${id}`, { cause: error })
		};
	}
}

/**
 * Find all trees a user belongs to (as owner, editor, or viewer)
 */
export async function findAllByUser(
	db: D1Database,
	userId: number
): Promise<Result<Tree[], Error>> {
	try {
		// Join tree_member to find trees linked to the user
		const query = sql<TreeRow>`
			SELECT t.id, t.name, t.description, t.created_by, t.created_at, t.updated_at
			FROM tree t
			INNER JOIN tree_member tm ON tm.tree_id = t.id
			WHERE tm.user_id = ${userId}
			ORDER BY t.updated_at DESC
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.all<TreeRow>();

		if (!result.success) {
			return { ok: false, error: new Error('Query failed') };
		}

		return { ok: true, data: result.results.map(toTree) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find trees for user: ${userId}`, {
				cause: error
			})
		};
	}
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function create(
	db: D1Database,
	input: CreateTreeInput
): Promise<Result<Tree, Error>> {
	try {
		// Note: The 'tree_auto_owner' trigger automatically adds the creator as an owner in tree_member
		const query = sql`
			INSERT INTO tree (name, description, created_by)
			VALUES (${input.name}, ${input.description || null}, ${input.createdBy})
			RETURNING id, name, description, created_by, created_at, updated_at
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<TreeRow>();

		if (!result) {
			return {
				ok: false,
				error: new Error('Failed to create tree: no result returned')
			};
		}

		return { ok: true, data: toTree(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error('Failed to create tree', { cause: error })
		};
	}
}

export async function update(
	db: D1Database,
	id: number,
	input: UpdateTreeInput
): Promise<Result<Tree, Error>> {
	const updates: string[] = [];
	const values: unknown[] = [];

	if (input.name !== undefined) {
		updates.push('name = ?');
		values.push(input.name);
	}

	if (input.description !== undefined) {
		updates.push('description = ?');
		values.push(input.description);
	}

	if (updates.length === 0) {
		return { ok: false, error: new Error('No fields to update') };
	}

	updates.push("updated_at = datetime('now')");
	values.push(id);

	try {
		const queryStr = `
			UPDATE tree
			SET ${updates.join(', ')}
			WHERE id = ?
			RETURNING id, name, description, created_by, created_at, updated_at
		`;

		const result = await db
			.prepare(queryStr)
			.bind(...values)
			.first<TreeRow>();

		if (!result) {
			return { ok: false, error: new Error(`Tree with id ${id} not found`) };
		}

		return { ok: true, data: toTree(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to update tree: ${id}`, { cause: error })
		};
	}
}

export async function remove(
	db: D1Database,
	id: number
): Promise<Result<boolean, Error>> {
	try {
		// Cascade delete will handle removing members, persons, etc.
		const query = sql`
			DELETE FROM tree
			WHERE id = ${id}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.run();

		if (!result.success) {
			return { ok: false, error: new Error('Delete query failed') };
		}

		return { ok: true, data: (result.meta?.changes ?? 0) > 0 };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to delete tree: ${id}`, { cause: error })
		};
	}
}

export const treeRepository = {
	findById,
	findAllByUser,
	create,
	update,
	remove
};
