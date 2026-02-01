/**
 * User Repository
 *
 * Data access layer for the user table.
 * All methods return Result<T, Error> for consistent error handling.
 */

import sql from '../sql-template-tag';
import type {
	User,
	UserRow,
	CreateUserInput,
	UpdateUserInput
} from '../schema';
import { toUser } from '../schema';

// =============================================================================
// TYPES
// =============================================================================

// Assuming D1Database is globally available via Cloudflare types
// If not, we might need to add it to global.d.ts or install @cloudflare/workers-types

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Find a user by their ID
 */
export async function findById(
	db: D1Database,
	id: number
): Promise<Result<User | null, Error>> {
	try {
		const query = sql<UserRow>`
			SELECT id, email, name, created_at, updated_at
			FROM user
			WHERE id = ${id}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<UserRow>();

		if (!result) {
			return { ok: true, data: null };
		}

		return { ok: true, data: toUser(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find user by id: ${id}`, { cause: error })
		};
	}
}

/**
 * Find a user by their email address
 */
export async function findByEmail(
	db: D1Database,
	email: string
): Promise<Result<User | null, Error>> {
	try {
		const query = sql<UserRow>`
			SELECT id, email, name, created_at, updated_at
			FROM user
			WHERE email = ${email}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<UserRow>();

		if (!result) {
			return { ok: true, data: null };
		}

		return { ok: true, data: toUser(result) };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to find user by email: ${email}`, {
				cause: error
			})
		};
	}
}

/**
 * Get all users (paginated)
 */
export async function findAll(
	db: D1Database,
	options: { limit?: number; offset?: number } = {}
): Promise<Result<User[], Error>> {
	const { limit = 100, offset = 0 } = options;

	try {
		const query = sql<UserRow>`
			SELECT id, email, name, created_at, updated_at
			FROM user
			ORDER BY created_at DESC
			LIMIT ${limit} OFFSET ${offset}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.all<UserRow>();

		if (!result.success) {
			return { ok: false, error: new Error('Query failed') };
		}

		return { ok: true, data: result.results.map(toUser) };
	} catch (error) {
		return {
			ok: false,
			error: new Error('Failed to fetch users', { cause: error })
		};
	}
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new user
 */
export async function create(
	db: D1Database,
	input: CreateUserInput
): Promise<Result<User, Error>> {
	try {
		const query = sql`
			INSERT INTO user (email, name)
			VALUES (${input.email}, ${input.name})
			RETURNING id, email, name, created_at, updated_at
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.first<UserRow>();

		if (!result) {
			return {
				ok: false,
				error: new Error('Failed to create user: no result returned')
			};
		}

		return { ok: true, data: toUser(result) };
	} catch (error) {
		// Handle unique constraint violation
		if (
			error instanceof Error &&
			error.message.includes('UNIQUE constraint failed')
		) {
			return {
				ok: false,
				error: new Error(`User with email "${input.email}" already exists`)
			};
		}

		return {
			ok: false,
			error: new Error('Failed to create user', { cause: error })
		};
	}
}

/**
 * Update an existing user
 */
export async function update(
	db: D1Database,
	id: number,
	input: UpdateUserInput
): Promise<Result<User, Error>> {
	// Build dynamic SET clause based on provided fields
	const updates: string[] = [];
	const values: unknown[] = [];

	if (input.email !== undefined) {
		updates.push('email = ?');
		values.push(input.email);
	}

	if (input.name !== undefined) {
		updates.push('name = ?');
		values.push(input.name);
	}

	if (updates.length === 0) {
		return { ok: false, error: new Error('No fields to update') };
	}

	// Add updated_at
	updates.push("updated_at = datetime('now')");

	// Add id for WHERE clause
	values.push(id);

	try {
		const queryStr = `
			UPDATE user
			SET ${updates.join(', ')}
			WHERE id = ?
			RETURNING id, email, name, created_at, updated_at
		`;

		const result = await db
			.prepare(queryStr)
			.bind(...values)
			.first<UserRow>();

		if (!result) {
			return { ok: false, error: new Error(`User with id ${id} not found`) };
		}

		return { ok: true, data: toUser(result) };
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes('UNIQUE constraint failed')
		) {
			return {
				ok: false,
				error: new Error(`User with email "${input.email}" already exists`)
			};
		}

		return {
			ok: false,
			error: new Error(`Failed to update user: ${id}`, { cause: error })
		};
	}
}

/**
 * Delete a user by ID
 */
export async function remove(
	db: D1Database,
	id: number
): Promise<Result<boolean, Error>> {
	try {
		const query = sql`
			DELETE FROM user
			WHERE id = ${id}
		`;

		const result = await db
			.prepare(query.sql)
			.bind(...query.values)
			.run();

		if (!result.success) {
			return { ok: false, error: new Error('Delete query failed') };
		}

		// result.meta.changes tells us how many rows were deleted
		const deleted = (result.meta?.changes ?? 0) > 0;

		return { ok: true, data: deleted };
	} catch (error) {
		return {
			ok: false,
			error: new Error(`Failed to delete user: ${id}`, { cause: error })
		};
	}
}

// =============================================================================
// REPOSITORY OBJECT (optional - if you prefer object style)
// =============================================================================

export const userRepository = {
	findById,
	findByEmail,
	findAll,
	create,
	update,
	remove
};
