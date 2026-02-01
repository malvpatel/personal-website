/**
 * Union schema types and mappers
 * Note: Table is named "union" (quoted) in SQL because UNION is a reserved keyword
 */

// =============================================================================
// SHARED TYPES
// =============================================================================

export type UnionType = 'marriage' | 'partnership' | 'unknown';
export type UnionStatus = 'active' | 'divorced' | 'widowed' | 'separated';

// =============================================================================
// ROW TYPE (what the database returns)
// =============================================================================

export interface UnionRow {
	id: number;
	tree_id: number;
	partner1_id: number;
	partner2_id: number | null;
	union_type: UnionType;
	status: UnionStatus;
	start_date: string | null;
	end_date: string | null;
	created_at: string;
	updated_at: string;
}

// =============================================================================
// DOMAIN TYPE (what your app uses)
// =============================================================================

export interface Union {
	id: number;
	treeId: number;
	partner1Id: number;
	partner2Id: number | null;
	unionType: UnionType;
	status: UnionStatus;
	startDate: string | null;
	endDate: string | null;
	createdAt: Date;
	updatedAt: Date;
}

// =============================================================================
// INPUT TYPES (for create/update operations)
// =============================================================================

export interface CreateUnionInput {
	treeId: number;
	partner1Id: number;
	partner2Id?: number;
	unionType?: UnionType;
	status?: UnionStatus;
	startDate?: string;
	endDate?: string;
}

export interface UpdateUnionInput {
	partner2Id?: number;
	unionType?: UnionType;
	status?: UnionStatus;
	startDate?: string;
	endDate?: string;
}

// =============================================================================
// MAPPERS
// =============================================================================

export function toUnion(row: UnionRow): Union {
	return {
		id: row.id,
		treeId: row.tree_id,
		partner1Id: row.partner1_id,
		partner2Id: row.partner2_id,
		unionType: row.union_type,
		status: row.status,
		startDate: row.start_date,
		endDate: row.end_date,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at)
	};
}

export function toUnionRow(
	input: CreateUnionInput
): Omit<UnionRow, 'id' | 'created_at' | 'updated_at'> {
	return {
		tree_id: input.treeId,
		partner1_id: input.partner1Id,
		partner2_id: input.partner2Id ?? null,
		union_type: input.unionType ?? 'marriage',
		status: input.status ?? 'active',
		start_date: input.startDate ?? null,
		end_date: input.endDate ?? null
	};
}
