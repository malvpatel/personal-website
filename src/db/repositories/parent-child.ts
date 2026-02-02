/**
 * ParentChild Repository
 */

import sql from '../sql-template-tag';
import type {
	ParentChild,
	ParentChildRow,
	CreateParentChildInput,
	UpdateParentChildInput
} from '../schema';
import { toParentChild, toParentChildRow } from '../schema';

// =============================================================================
// QUERIES
// =============================================================================

export async function findByParentId(
	db: D1Database,
	parentId: number
): Promise<Result<ParentChild[], Error>> {
	try {
		const query = sql<ParentChildRow>`
			SELECT * FROM parent_child WHERE parent_id = ${parentId}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.all<ParentChildRow>();

		if (!result.success) {
			return { ok: false, error: new Error('Query failed') };
		}

		return { ok: true, data: result.results.map(toParentChild) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find children for parent: ${parentId}`, {
				cause: error
			})
		};
	}
}

export async function findByChildId(
	db: D1Database,
	childId: number
): Promise<Result<ParentChild[], Error>> {
	try {
		const query = sql<ParentChildRow>`
			SELECT * FROM parent_child WHERE child_id = ${childId}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.all<ParentChildRow>();

		if (!result.success) {
			return { ok: false, error: new Error('Query failed') };
		}

		return { ok: true, data: result.results.map(toParentChild) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find parents for child: ${childId}`, {
				cause: error
			})
		};
	}
}

export async function findByTreeId(
	db: D1Database,
	treeId: number
): Promise<Result<ParentChild[], Error>> {
	try {
		const query = sql<ParentChildRow>`
			SELECT pc.*
			FROM parent_child pc
			INNER JOIN person p ON pc.parent_id = p.id
			WHERE p.tree_id = ${treeId}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.all<ParentChildRow>();

		if (!result.success) {
			return { ok: false, error: new Error('Query failed') };
		}

		return { ok: true, data: result.results.map(toParentChild) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find relationships for tree: ${treeId}`, {
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
	input: CreateParentChildInput
): Promise<Result<ParentChild, Error>> {
	try {
		const row = toParentChildRow(input);

		const query = sql`
			INSERT INTO parent_child (parent_id, child_id, relationship_type)
			VALUES (${row.parent_id}, ${row.child_id}, ${row.relationship_type})
			RETURNING *
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<ParentChildRow>();

		if (!result) {
			return {
				ok: false,
				error: new Error('Failed to create parent-child link')
			};
		}

		return { ok: true, data: toParentChild(result) };
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes('UNIQUE constraint failed')
		) {
			return {
				ok: false,
				error: new Error('Relationship already exists')
			};
		}
		return {
			ok: false,
			error: new Error('Failed to create parent-child link', { cause: error })
		};
	}
}

export async function update(
	db: D1Database,
	id: number,
	input: UpdateParentChildInput
): Promise<Result<ParentChild, Error>> {
	if (input.relationshipType === undefined) {
		return { ok: false, error: new Error('No fields to update') };
	}

	try {
		const query = sql`
			UPDATE parent_child
			SET relationship_type = ${input.relationshipType}
			WHERE id = ${id}
			RETURNING *
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<ParentChildRow>();

		if (!result) {
			return { ok: false, error: new Error('Relationship not found') };
		}

		return { ok: true, data: toParentChild(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to update relationship: ${id}`, { cause: error })
		};
	}
}

export async function remove(
	db: D1Database,
	id: number
): Promise<Result<boolean, Error>> {
	try {
		const query = sql`DELETE FROM parent_child WHERE id = ${id}`;
		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.run();

		if (!result.success) {
			return { ok: false, error: new Error('Delete failed') };
		}

		return { ok: true, data: (result.meta?.changes ?? 0) > 0 };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to delete relationship: ${id}`, { cause: error })
		};
	}
}

export const parentChildRepository = {
	findByParentId,
	findByChildId,
	findByTreeId,
	create,
	update,
	remove
};
