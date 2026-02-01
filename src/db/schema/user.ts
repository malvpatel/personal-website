/**
 * User schema types and mappers
 */

// =============================================================================
// ROW TYPE (what the database returns)
// =============================================================================

export interface UserRow {
	id: number;
	email: string;
	name: string;
	created_at: string;
	updated_at: string;
}

// =============================================================================
// DOMAIN TYPE (what your app uses)
// =============================================================================

export interface User {
	id: number;
	email: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

// =============================================================================
// INPUT TYPES (for create/update operations)
// =============================================================================

export interface CreateUserInput {
	email: string;
	name: string;
}

export interface UpdateUserInput {
	email?: string;
	name?: string;
}

// =============================================================================
// MAPPERS
// =============================================================================

export function toUser(row: UserRow): User {
	return {
		id: row.id,
		email: row.email,
		name: row.name,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at)
	};
}

export function toUserRow(
	input: CreateUserInput
): Omit<UserRow, 'id' | 'created_at' | 'updated_at'> {
	return {
		email: input.email,
		name: input.name
	};
}
