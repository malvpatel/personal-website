/**
 * Person Repository
 */

import sql from '../sql-template-tag';
import type {
	Person,
	PersonRow,
	CreatePersonInput,
	UpdatePersonInput
} from '../schema';
import { toPerson, toPersonRow, genderToCode } from '../schema';

// =============================================================================
// QUERIES
// =============================================================================

export async function findById(
	db: D1Database,
	id: number
): Promise<Result<Person | null, Error>> {
	try {
		const query = sql<PersonRow>`
			SELECT *
			FROM person
			WHERE id = ${id}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<PersonRow>();

		if (!result) {
			return { ok: true, data: null };
		}

		return { ok: true, data: toPerson(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find person by id: ${id}`, { cause: error })
		};
	}
}

export async function findByTreeId(
	db: D1Database,
	treeId: number
): Promise<Result<Person[], Error>> {
	try {
		const query = sql<PersonRow>`
			SELECT *
			FROM person
			WHERE tree_id = ${treeId}
			ORDER BY first_name, last_name
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.all<PersonRow>();

		if (!result.success) {
			return { ok: false, error: new Error('Query failed') };
		}

		return { ok: true, data: result.results.map(toPerson) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find persons for tree: ${treeId}`, {
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
	input: CreatePersonInput
): Promise<Result<Person, Error>> {
	try {
		const row = toPersonRow(input);
		const keys = Object.keys(row);
		const values = Object.values(row);

		// Dynamic insert based on what toPersonRow returns
		// Note: toPersonRow returns Omit<PersonRow, 'id' | 'created_at' | 'updated_at'>

		const placeholders = values.map(() => '?').join(', ');
		const columns = keys.join(', ');

		const queryStr = `
			INSERT INTO person (${columns})
			VALUES (${placeholders})
			RETURNING *
		`;

		const result = await db
			.prepare(queryStr)
			.bind(...values)
			.first<PersonRow>();

		if (!result) {
			return { ok: false, error: new Error('Failed to create person') };
		}

		return { ok: true, data: toPerson(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error('Failed to create person', { cause: error })
		};
	}
}

export async function update(
	db: D1Database,
	id: number,
	input: UpdatePersonInput
): Promise<Result<Person, Error>> {
	// Need to map input keys (camelCase) to db keys (snake_case)
	// We can use a partial mapper or just manual mapping here since input is partial

	const updates: string[] = [];
	const values: unknown[] = [];

	if (input.firstName !== undefined) {
		updates.push('first_name = ?');
		values.push(input.firstName);
	}
	if (input.lastName !== undefined) {
		updates.push('last_name = ?');
		values.push(input.lastName);
	}
	if (input.maidenName !== undefined) {
		updates.push('maiden_name = ?');
		values.push(input.maidenName);
	}
	if (input.gender !== undefined) {
		updates.push('gender = ?');
		values.push(genderToCode[input.gender]);
	}

	if (input.isLiving !== undefined) {
		updates.push('is_living = ?');
		values.push(input.isLiving ? 1 : 0);
	}
	if (input.dateOfBirth !== undefined) {
		updates.push('date_of_birth = ?');
		values.push(input.dateOfBirth);
	}
	if (input.dateOfDeath !== undefined) {
		updates.push('date_of_death = ?');
		values.push(input.dateOfDeath);
	}
	if (input.notes !== undefined) {
		updates.push('notes = ?');
		values.push(input.notes);
	}
	if (input.avatarUrl !== undefined) {
		updates.push('avatar_url = ?');
		values.push(input.avatarUrl);
	}

	if (updates.length === 0) {
		return { ok: false, error: new Error('No fields to update') };
	}

	updates.push("updated_at = datetime('now')");
	values.push(id);

	try {
		const queryStr = `
			UPDATE person
			SET ${updates.join(', ')}
			WHERE id = ?
			RETURNING *
		`;

		const result = await db
			.prepare(queryStr)
			.bind(...values)
			.first<PersonRow>();

		if (!result) {
			return { ok: false, error: new Error('Person not found') };
		}

		return { ok: true, data: toPerson(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to update person: ${id}`, { cause: error })
		};
	}
}

export async function remove(
	db: D1Database,
	id: number
): Promise<Result<boolean, Error>> {
	try {
		const query = sql`DELETE FROM person WHERE id = ${id}`;
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
			error: new Error(`Failed to delete person: ${id}`, { cause: error })
		};
	}
}

export const personRepository = {
	findById,
	findByTreeId,
	create,
	update,
	remove
};
