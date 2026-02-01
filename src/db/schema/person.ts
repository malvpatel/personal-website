/**
 * Person schema types and mappers
 */

// =============================================================================
// SHARED TYPES
// =============================================================================

/** Database stores single characters */
export type GenderCode = 'M' | 'F' | 'O' | 'U';

/** Application uses full words */
export type Gender = 'male' | 'female' | 'other' | 'unknown';

export const genderFromCode: Record<GenderCode, Gender> = {
	M: 'male',
	F: 'female',
	O: 'other',
	U: 'unknown'
};

export const genderToCode: Record<Gender, GenderCode> = {
	male: 'M',
	female: 'F',
	other: 'O',
	unknown: 'U'
};

// =============================================================================
// ROW TYPE (what the database returns)
// =============================================================================

export interface PersonRow {
	id: number;
	tree_id: number;
	first_name: string;
	last_name: string | null;
	maiden_name: string | null;
	gender: GenderCode;
	is_living: 0 | 1;
	date_of_birth: string | null;
	date_of_death: string | null;
	notes: string | null;
	avatar_url: string | null;
	created_at: string;
	updated_at: string;
}

// =============================================================================
// DOMAIN TYPE (what your app uses)
// =============================================================================

export interface Person {
	id: number;
	treeId: number;
	firstName: string;
	lastName: string | null;
	maidenName: string | null;
	gender: Gender;
	isLiving: boolean;
	dateOfBirth: string | null;
	dateOfDeath: string | null;
	notes: string | null;
	avatarUrl: string | null;
	createdAt: Date;
	updatedAt: Date;
}

// =============================================================================
// INPUT TYPES (for create/update operations)
// =============================================================================

export interface CreatePersonInput {
	treeId: number;
	firstName: string;
	lastName?: string;
	maidenName?: string;
	gender: Gender;
	isLiving?: boolean;
	dateOfBirth?: string;
	dateOfDeath?: string;
	notes?: string;
	avatarUrl?: string;
}

export interface UpdatePersonInput {
	firstName?: string;
	lastName?: string;
	maidenName?: string;
	gender?: Gender;
	isLiving?: boolean;
	dateOfBirth?: string;
	dateOfDeath?: string;
	notes?: string;
	avatarUrl?: string;
}

// =============================================================================
// MAPPERS
// =============================================================================

export function toPerson(row: PersonRow): Person {
	return {
		id: row.id,
		treeId: row.tree_id,
		firstName: row.first_name,
		lastName: row.last_name,
		maidenName: row.maiden_name,
		gender: genderFromCode[row.gender],
		isLiving: row.is_living === 1,
		dateOfBirth: row.date_of_birth,
		dateOfDeath: row.date_of_death,
		notes: row.notes,
		avatarUrl: row.avatar_url,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at)
	};
}

export function toPersonRow(
	input: CreatePersonInput
): Omit<PersonRow, 'id' | 'created_at' | 'updated_at'> {
	return {
		tree_id: input.treeId,
		first_name: input.firstName,
		last_name: input.lastName ?? null,
		maiden_name: input.maidenName ?? null,
		gender: genderToCode[input.gender],
		is_living: input.isLiving !== false ? 1 : 0,
		date_of_birth: input.dateOfBirth ?? null,
		date_of_death: input.dateOfDeath ?? null,
		notes: input.notes ?? null,
		avatar_url: input.avatarUrl ?? null
	};
}
