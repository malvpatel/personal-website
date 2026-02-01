/**
 * TreeMember schema types and mappers
 */

// =============================================================================
// SHARED TYPES
// =============================================================================

export type TreeMemberRole = 'owner' | 'editor' | 'viewer';

// =============================================================================
// ROW TYPE (what the database returns)
// =============================================================================

export interface TreeMemberRow {
	id: number;
	tree_id: number;
	user_id: number;
	role: TreeMemberRole;
	invited_at: string;
	accepted_at: string | null;
}

// =============================================================================
// DOMAIN TYPE (what your app uses)
// =============================================================================

export interface TreeMember {
	id: number;
	treeId: number;
	userId: number;
	role: TreeMemberRole;
	invitedAt: Date;
	acceptedAt: Date | null;
}

// =============================================================================
// INPUT TYPES (for create/update operations)
// =============================================================================

export interface CreateTreeMemberInput {
	treeId: number;
	userId: number;
	role: TreeMemberRole;
}

export interface UpdateTreeMemberInput {
	role?: TreeMemberRole;
	acceptedAt?: Date;
}

// =============================================================================
// MAPPERS
// =============================================================================

export function toTreeMember(row: TreeMemberRow): TreeMember {
	return {
		id: row.id,
		treeId: row.tree_id,
		userId: row.user_id,
		role: row.role,
		invitedAt: new Date(row.invited_at),
		acceptedAt: row.accepted_at ? new Date(row.accepted_at) : null
	};
}

export function toTreeMemberRow(
	input: CreateTreeMemberInput
): Omit<TreeMemberRow, 'id' | 'invited_at' | 'accepted_at'> {
	return {
		tree_id: input.treeId,
		user_id: input.userId,
		role: input.role
	};
}
