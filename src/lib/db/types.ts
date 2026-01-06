/**
 * Database table TypeScript types for the family-tree schema
 * Generated from migrations/0001_initial_entity.sql
 */

export type Gender = 'male' | 'female' | 'nonbinary' | 'unknown';

export type RelationshipType = 'biological' | 'adopted' | 'step' | 'foster' | 'other';

/**
 * Row shape returned from the `entities` table
 */
export interface EntitiesRow {
	id: number;
	first_name: string;
	last_name: string;
	gender: Gender;
	birth_date: string | null;
	death_date: string | null;
	email: string | null;
	phone: string | null;
	address: string | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

/**
 * Insert shape for creating a new entity
 */
export type EntitiesInsert = {
	first_name: string;
	last_name: string;
	gender?: Gender;
	birth_date?: string | null;
	death_date?: string | null;
	email?: string | null;
	phone?: string | null;
	address?: string | null;
	notes?: string | null;
};

export type EntitiesUpdate = Partial<EntitiesInsert> & { id: number };

/**
 * Row shape for parentages (parent → child)
 */
export interface ParentagesRow {
	parent_id: number;
	child_id: number;
	relationship_type: RelationshipType;
	created_at: string;
	updated_at: string;
}

export type ParentagesInsert = {
	parent_id: number;
	child_id: number;
	relationship_type?: RelationshipType;
};

export type ParentagesUpdate = Partial<ParentagesInsert> & { parent_id: number; child_id: number };

/**
 * Row shape for spouses (one record per partnership)
 */
export interface SpousesRow {
	id: number;
	spouse1_id: number;
	spouse2_id: number;
	start_date: string | null;
	end_date: string | null;
	created_at: string;
	updated_at: string;
}

export type SpousesInsert = {
	spouse1_id: number;
	spouse2_id: number;
	start_date?: string | null;
	end_date?: string | null;
};

export type SpousesUpdate = Partial<SpousesInsert> & { id: number };
