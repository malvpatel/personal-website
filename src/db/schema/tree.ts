/**
 * Tree schema types and mappers
 */

// =============================================================================
// ROW TYPE (what the database returns)
// =============================================================================

export interface TreeRow {
	id: number;
	name: string;
	description: string | null;
	created_by: number;
	created_at: string;
	updated_at: string;
}

// =============================================================================
// DOMAIN TYPE (what your app uses)
// =============================================================================

export interface Tree {
	id: number;
	name: string;
	description: string | null;
	createdBy: number;
	createdAt: Date;
	updatedAt: Date;
}

// =============================================================================
// INPUT TYPES (for create/update operations)
// =============================================================================

export interface CreateTreeInput {
	name: string;
	description?: string;
	createdBy: number;
}

export interface UpdateTreeInput {
	name?: string;
	description?: string;
}

// =============================================================================
// MAPPERS
// =============================================================================

export function toTree(row: TreeRow): Tree {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		createdBy: row.created_by,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at)
	};
}

export function toTreeRow(
	input: CreateTreeInput
): Omit<TreeRow, 'id' | 'created_at' | 'updated_at'> {
	return {
		name: input.name,
		description: input.description ?? null,
		created_by: input.createdBy
	};
}
