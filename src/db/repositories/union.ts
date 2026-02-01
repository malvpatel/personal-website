/**
 * Union Repository
 */

import sql from '../sql-template-tag';
import type {
	Union,
	UnionRow,
	CreateUnionInput,
	UpdateUnionInput
} from '../schema';
import { toUnion, toUnionRow } from '../schema';

// =============================================================================
// QUERIES
// =============================================================================

export async function findById(
	db: D1Database,
	id: number
): Promise<Result<Union | null, Error>> {
	try {
		const query = sql<UnionRow>`
			SELECT * FROM "union" WHERE id = ${id}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<UnionRow>();

		if (!result) {
			return { ok: true, data: null };
		}

		return { ok: true, data: toUnion(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find union by id: ${id}`, { cause: error })
		};
	}
}

export async function findByTreeId(
	db: D1Database,
	treeId: number
): Promise<Result<Union[], Error>> {
	try {
		const query = sql<UnionRow>`
			SELECT * FROM "union" WHERE tree_id = ${treeId}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.all<UnionRow>();

		if (!result.success) {
			return { ok: false, error: new Error('Query failed') };
		}

		return { ok: true, data: result.results.map(toUnion) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find unions for tree: ${treeId}`, {
				cause: error
			})
		};
	}
}

export async function findByPersonId(
	db: D1Database,
	personId: number
): Promise<Result<Union[], Error>> {
	try {
		const query = sql<UnionRow>`
			SELECT * FROM "union" 
			WHERE partner1_id = ${personId} OR partner2_id = ${personId}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.all<UnionRow>();

		if (!result.success) {
			return { ok: false, error: new Error('Query failed') };
		}

		return { ok: true, data: result.results.map(toUnion) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find unions for person: ${personId}`, {
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
	input: CreateUnionInput
): Promise<Result<Union, Error>> {
	try {
		const row = toUnionRow(input);
		// Note: we can't iterate blindly because of 'union' table name handling if we did dynamic sql
		// But explicit SQL is safer anyway

		const query = sql`
			INSERT INTO "union" (tree_id, partner1_id, partner2_id, union_type, status, start_date, end_date)
			VALUES (${row.tree_id}, ${row.partner1_id}, ${row.partner2_id}, ${row.union_type}, ${row.status}, ${row.start_date}, ${row.end_date})
			RETURNING *
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<UnionRow>();

		if (!result) {
			return { ok: false, error: new Error('Failed to create union') };
		}

		return { ok: true, data: toUnion(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error('Failed to create union', { cause: error })
		};
	}
}

export async function update(
	db: D1Database,
	id: number,
	input: UpdateUnionInput
): Promise<Result<Union, Error>> {
	const updates: string[] = [];
	const values: unknown[] = [];

	if (input.partner2Id !== undefined) {
		updates.push('partner2_id = ?');
		values.push(input.partner2Id);
	}
	if (input.unionType !== undefined) {
		updates.push('union_type = ?');
		values.push(input.unionType);
	}
	if (input.status !== undefined) {
		updates.push('status = ?');
		values.push(input.status);
	}
	if (input.startDate !== undefined) {
		updates.push('start_date = ?');
		values.push(input.startDate);
	}
	if (input.endDate !== undefined) {
		updates.push('end_date = ?');
		values.push(input.endDate);
	}

	if (updates.length === 0) {
		return { ok: false, error: new Error('No fields to update') };
	}

	updates.push("updated_at = datetime('now')");
	values.push(id);

	try {
		const queryStr = `
			UPDATE "union"
			SET ${updates.join(', ')}
			WHERE id = ?
			RETURNING *
		`;

		const result = await db
			.prepare(queryStr)
			.bind(...values)
			.first<UnionRow>();

		if (!result) {
			return { ok: false, error: new Error('Union not found') };
		}

		return { ok: true, data: toUnion(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to update union: ${id}`, { cause: error })
		};
	}
}

export async function remove(
	db: D1Database,
	id: number
): Promise<Result<boolean, Error>> {
	try {
		const query = sql`DELETE FROM "union" WHERE id = ${id}`;
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
			error: new Error(`Failed to delete union: ${id}`, { cause: error })
		};
	}
}

export const unionRepository = {
	findById,
	findByTreeId,
	findByPersonId,
	create,
	update,
	remove
};
