interface User {
	id: number;
	email: string;
}

export interface Database {
	users: {
		create(email: string): Promise<User>;
		getByID(id: number): Promise<User>;
		getByEmail(email: string): Promise<User>;
	};
}

export class DatabaseError extends Error {
	constructor(sql: string, params: unknown[], message: string) {
		super(message);
		this.name = 'DatabaseError';
	}
}

export class CloudflareD1 implements Database {
	#db: D1Database;

	constructor(db: D1Database) {
		this.#db = db;
	}

	users = {
		create: async (email: string) => {
			const result = await this.#db
				.prepare(`INSERT INTO users (email) VALUES (?) RETURNING id, email`)
				.bind(email)
				.first();

			if (!result) {
				throw new Error('Failed to create user');
			}

			return result as unknown as User;
		},
		getByID: async (id: number) => {
			const result = await this.#db
				.prepare('SELECT id, email FROM users WHERE id = ?')
				.bind(id)
				.first();

			if (!result) {
				throw new Error(`User with ID ${id} not found`);
			}

			return result as unknown as User;
		},
		getByEmail: async (email: string) => {
			const result = await this.#db
				.prepare('SELECT id, email FROM users WHERE email = ?')
				.bind(email)
				.first();

			if (!result) {
				throw new Error(`User with email ${email} not found`);
			}

			return result as unknown as User;
		}
	};
}
