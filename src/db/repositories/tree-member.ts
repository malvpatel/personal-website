/**
 * Tree Member Repository
 */

import sql from '../sql-template-tag';
import type {
	TreeMember,
	TreeMemberRow,
	CreateTreeMemberInput,
	UpdateTreeMemberInput
} from '../schema';
import { toTreeMember } from '../schema';

// =============================================================================
// QUERIES
// =============================================================================

export async function findByTreeAndUser(
	db: D1Database,
	treeId: number,
	userId: number
): Promise<Result<TreeMember | null, Error>> {
	try {
		const query = sql<TreeMemberRow>`
			SELECT id, tree_id, user_id, role, invited_at, accepted_at
			FROM tree_member
			WHERE tree_id = ${treeId} AND user_id = ${userId}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<TreeMemberRow>();

		if (!result) {
			return { ok: true, data: null };
		}

		return { ok: true, data: toTreeMember(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find member`, { cause: error })
		};
	}
}

export async function findByTreeId(
	db: D1Database,
	treeId: number
): Promise<Result<TreeMember[], Error>> {
	try {
		const query = sql<TreeMemberRow>`
			SELECT id, tree_id, user_id, role, invited_at, accepted_at
			FROM tree_member
			WHERE tree_id = ${treeId}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.all<TreeMemberRow>();

		if (!result.success) {
			return { ok: false, error: new Error('Query failed') };
		}

		return { ok: true, data: result.results.map(toTreeMember) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find members for tree: ${treeId}`, {
				cause: error
			})
		};
	}
}

// =============================================================================
// MUTATIONS
// =============================================================================

export async function addMember(
	db: D1Database,
	input: CreateTreeMemberInput
): Promise<Result<TreeMember, Error>> {
	try {
		const query = sql`
			INSERT INTO tree_member (tree_id, user_id, role, invited_at)
			VALUES (${input.treeId}, ${input.userId}, ${input.role}, datetime('now'))
			RETURNING id, tree_id, user_id, role, invited_at, accepted_at
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<TreeMemberRow>();

		if (!result) {
			return { ok: false, error: new Error('Failed to add member') };
		}

		return { ok: true, data: toTreeMember(result) };
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes('UNIQUE constraint failed')
		) {
			return {
				ok: false,
				error: new Error('User is already a member of this tree')
			};
		}
		return {
			ok: false,
			error: new Error('Failed to add member', { cause: error })
		};
	}
}

export async function updateMember(
	db: D1Database,
	id: number,
	input: UpdateTreeMemberInput
): Promise<Result<TreeMember, Error>> {
	const updates: string[] = [];
	const values: unknown[] = [];

	if (input.role !== undefined) {
		updates.push('role = ?');
		values.push(input.role);
	}

	if (input.acceptedAt !== undefined) {
		updates.push('accepted_at = ?');
		values.push(input.acceptedAt.toISOString());
	}

	if (updates.length === 0) {
		return { ok: false, error: new Error('No fields to update') };
	}

	values.push(id);

	try {
		const queryStr = `
			UPDATE tree_member
			SET ${updates.join(', ')}
			WHERE id = ?
			RETURNING id, tree_id, user_id, role, invited_at, accepted_at
		`;

		const result = await db
			.prepare(queryStr)
			.bind(...values)
			.first<TreeMemberRow>();

		if (!result) {
			return { ok: false, error: new Error('Member not found') };
		}

		return { ok: true, data: toTreeMember(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error('Failed to update member', { cause: error })
		};
	}
}

export async function removeMember(
	db: D1Database,
	treeId: number,
	userId: number
): Promise<Result<boolean, Error>> {
	try {
		const query = sql`
			DELETE FROM tree_member
			WHERE tree_id = ${treeId} AND user_id = ${userId}
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
			error: new Error('Failed to remove member', { cause: error })
		};
	}
}

export const treeMemberRepository = {
	findByTreeAndUser,
	findByTreeId,
	addMember,
	updateMember,
	removeMember
};
