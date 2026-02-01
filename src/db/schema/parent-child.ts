/**
 * ParentChild schema types and mappers
 */

// =============================================================================
// SHARED TYPES
// =============================================================================

export type RelationshipType = 'biological' | 'adopted' | 'step' | 'foster';

// =============================================================================
// ROW TYPE (what the database returns)
// =============================================================================

export interface ParentChildRow {
	id: number;
	parent_id: number;
	child_id: number;
	relationship_type: RelationshipType;
	created_at: string;
}

// =============================================================================
// DOMAIN TYPE (what your app uses)
// =============================================================================

export interface ParentChild {
	id: number;
	parentId: number;
	childId: number;
	relationshipType: RelationshipType;
	createdAt: Date;
}

// =============================================================================
// INPUT TYPES (for create/update operations)
// =============================================================================

export interface CreateParentChildInput {
	parentId: number;
	childId: number;
	relationshipType?: RelationshipType;
}

export interface UpdateParentChildInput {
	relationshipType?: RelationshipType;
}

// =============================================================================
// MAPPERS
// =============================================================================

export function toParentChild(row: ParentChildRow): ParentChild {
	return {
		id: row.id,
		parentId: row.parent_id,
		childId: row.child_id,
		relationshipType: row.relationship_type,
		createdAt: new Date(row.created_at)
	};
}

export function toParentChildRow(
	input: CreateParentChildInput
): Omit<ParentChildRow, 'id' | 'created_at'> {
	return {
		parent_id: input.parentId,
		child_id: input.childId,
		relationship_type: input.relationshipType ?? 'biological'
	};
}
