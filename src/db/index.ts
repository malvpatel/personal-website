import type { Person, PersonWithRelations } from '../entities';
import sql, { join, Sql } from './sql-template-tag';

export interface Database {
	findPersonByIds: (
		ids: number[],
		options: { withRelations: false }
	) => Promise<Result<Person[], Error>>;
	// findPersonByIds(ids: number[], options: { withRelations: true }): [Error, PersonWithRelations[]];
}

export function createCloudflareD1(d1: D1Database): Database {
	return {
		findPersonByIds
	};

	async function findPersonByIds(
		ids: number[]
	): Promise<Result<Person[], Error>> {
		const query = sql<{
			id: number;
			firstName: string;
			lastName: string;
			gender: string;
			birthDate: string | null;
			createdAt: string;
			updatedAt: string;
		}>
		/* sql */ `
            SELECT
                p.id as id,
                p.first_name as firstName,
                p.last_name as lastName,
                p.gender as gender,
                p.birth_date as bithDate,
                p.created_at as createdAt,
                p.updated_at as updatedAt
            FROM
                persons p
            WHERE p.id IN ${join(ids)}
        `;

		return {
			ok: true,
			data: []
		};
	}
}

// const QUERY_PERSON_BY_IDS = sql<
// 	Array<{
// 		id: number;
// 		firstName: string;
// 		lastName: string;
// 		gender: string;
// 		birthDate: string;
// 		parents: number[];
// 		children: number[];
// 		spouses: number[];
// 	}>
// > /* sql */ `
//     SELECT
//         e.id AS id,
//         e.first_name AS firstName,
//         e.last_name AS lastName,
//         e.gender AS gender,
//         e.birth_date AS birthDate,
//         json_group_array (DISTINCT p_parents.parent_id)
//         FILTER (WHERE p_parents.parent_id IS NOT NULL) AS parents,
//         json_group_array (DISTINCT p_children.child_id)
//         FILTER (WHERE p_children.child_id IS NOT NULL) AS children,
//         json_group_array (
//             DISTINCT CASE
//                 WHEN s.spouse1_id = e.id THEN s.spouse2_id
//                 WHEN s.spouse2_id = e.id THEN s.spouse1_id
//             END
//         ) FILTER (WHERE s.id IS NOT NULL) AS spouses
//     FROM
//         entities e
//         LEFT JOIN parentages p_parents ON p_parents.child_id = e.id
//         LEFT JOIN parentages p_children ON p_children.parent_id = e.id
//         LEFT JOIN spouses s ON s.spouse1_id = e.id
//         OR s.spouse2_id = e.id
//     WHERE
//         e.id IN (${join([1, 2, 3, 4])})
//     GROUP BY
//         e.id,
//         e.first_name, e.last_name,
//         e.gender, e.birth_date;
// `;

// const queryPersonByIds = sql<{
// 	id: number;
// 	first_name: string;
// 	last_name: string;
// }>`SELECT id, first_name, last_name from persons WHERE id IN (${`?,?,?,?`})`;

// queryPersonByIds;

// function createCloudflareD1({ db }: { db: D1Database }): Database {
// 	const findPersonByIds: Database['findPersonByIds'] = (ids, option) => {
// 		const placeholders = Array.from({ length: ids.length }, () => '?').join(',');

// 		// const sql =
// 	};
// }
