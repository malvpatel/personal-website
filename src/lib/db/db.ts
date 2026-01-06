// Type definitions matching your JSON format
export interface Entity {
	id: number;
	first_name: string;
	last_name?: string;
	gender: string;
	birth_date?: string;
	death_date?: string;
	email?: string;
	phone?: string;
	address?: string;
	notes?: string;
	created_at?: string;
	updated_at?: string;
	avatar?: string;
	parents: number[];
	children: number[];
	spouses: number[];
}

/**
 * Get a single person with all their relationships in JSON format
 */
export async function getEntitiesWithRelations(db: D1Database, ids: number[]): Promise<Entity[]> {
	const idList = ids;
	const placeholders = idList.map(() => '?').join(',');
	const bindings = idList;

	const sql = `
        SELECT
            e.id,
            e.first_name,
            e.last_name,
            e.gender,
            e.birth_date,
            json (
                json_group_array (DISTINCT p_parents.parent_id) FILTER (
                    WHERE
                        p_parents.parent_id IS NOT NULL
                )
            ) AS parents,
            json (
                json_group_array (DISTINCT p_children.child_id) FILTER (
                    WHERE
                        p_children.child_id IS NOT NULL
                )
            ) AS children,
            json (
                json_group_array (
                    DISTINCT CASE
                        WHEN s.spouse1_id = e.id THEN s.spouse2_id
                        WHEN s.spouse2_id = e.id THEN s.spouse1_id
                    END
                ) FILTER (
                    WHERE
                        s.id IS NOT NULL
                )
            ) AS spouses
        FROM
            entities e
            LEFT JOIN parentages p_parents ON p_parents.child_id = e.id
            LEFT JOIN parentages p_children ON p_children.parent_id = e.id
            LEFT JOIN spouses s ON s.spouse1_id = e.id
            OR s.spouse2_id = e.id
        WHERE
            e.id IN (${placeholders})
        GROUP BY
            e.id,
            e.first_name,
            e.last_name,
            e.gender,
            e.birth_date;
        `;

	const { results, success } = await db
		.prepare(sql)
		.bind(...bindings)
		.all<Entity>();

	if (!success) {
		return [];
	}

	const parsedResults = results.map((row) => ({
		...row,
		parents: row.parents ? JSON.parse(row.parents as unknown as string) : [],
		children: row.children ? JSON.parse(row.children as unknown as string) : [],
		spouses: row.spouses ? JSON.parse(row.spouses as unknown as string) : []
	}));

	return parsedResults;
}

export async function getEntitiesGraph(db: D1Database, id: number, depth = 2): Promise<Entity[]> {
	const sql = `
        WITH RECURSIVE family(id, level) AS (
            VALUES (?1, 0)
            UNION
            SELECT DISTINCT p.parent_id, family.level + 1
            FROM family JOIN parentages p ON p.child_id = family.id
            WHERE family.level + 1 <= ?2
            UNION
            SELECT DISTINCT p.child_id, family.level + 1
            FROM family JOIN parentages p ON p.parent_id = family.id
            WHERE family.level + 1 <= ?2
            UNION
            SELECT DISTINCT CASE WHEN s.spouse1_id = family.id THEN s.spouse2_id ELSE s.spouse1_id END, family.level + 1
            FROM family JOIN spouses s ON s.spouse1_id = family.id OR s.spouse2_id = family.id
            WHERE family.level + 1 <= ?2
        )
        SELECT
        e.id, e.first_name, e.last_name, e.gender, e.birth_date,
        json_group_array(DISTINCT p_parents.parent_id) FILTER (WHERE p_parents.parent_id IS NOT NULL) AS parents,
        json_group_array(DISTINCT p_children.child_id) FILTER (WHERE p_children.child_id IS NOT NULL) AS children,
        json_group_array(DISTINCT CASE WHEN s.spouse1_id = e.id THEN s.spouse2_id ELSE s.spouse1_id END) FILTER (WHERE s.id IS NOT NULL) AS spouses
        FROM entities e
        LEFT JOIN parentages p_parents ON p_parents.child_id = e.id
        LEFT JOIN parentages p_children ON p_children.parent_id = e.id
        LEFT JOIN spouses s ON s.spouse1_id = e.id OR s.spouse2_id = e.id
        WHERE e.id IN (SELECT DISTINCT id FROM family)
        GROUP BY e.id, e.first_name, e.last_name, e.gender, e.birth_date;
    `;

	const { results, success } = await db.prepare(sql).bind(id, depth).all<Entity>();

	if (!success) {
		return [];
	}

	const parsedResults = results.map((row) => ({
		...row,
		parents: row.parents ? JSON.parse(row.parents as unknown as string) : [],
		children: row.children ? JSON.parse(row.children as unknown as string) : [],
		spouses: row.spouses ? JSON.parse(row.spouses as unknown as string) : []
	}));

	return parsedResults;
}

// /**
//  * Get multiple people with their relationships
//  */
// export async function getPeople(db: D1Database, personIds: string[]): Promise<PersonData[]> {
// 	const results: PersonData[] = [];

// 	for (const id of personIds) {
// 		const person = await getPerson(db, id);
// 		if (person) {
// 			results.push(person);
// 		}
// 	}

// 	return results;
// }

// /**
//  * Get all people in the database
//  */
// export async function getAllPeople(db: D1Database): Promise<PersonData[]> {
// 	// Get all entity IDs
// 	const entities = await db.prepare('SELECT id FROM entities ORDER BY id').all();

// 	const personIds = entities.results.map((e: any) => toPersonId(e.id));
// 	return getPeople(db, personIds);
// }

// /**
//  * Get a family subtree starting from a root person
//  * Includes the person, their descendants, and optionally ancestors
//  */
// export async function getFamilyTree(
// 	db: D1Database,
// 	rootPersonId: string,
// 	includeAncestors: boolean = false,
// 	maxDepth: number = 10
// ): Promise<PersonData[]> {
// 	const visited = new Set<string>();
// 	const result: PersonData[] = [];

// 	async function traverse(personId: string, depth: number, direction: 'down' | 'up' | 'both') {
// 		if (depth > maxDepth || visited.has(personId)) {
// 			return;
// 		}

// 		visited.add(personId);
// 		const person = await getPerson(db, personId);

// 		if (!person) {
// 			return;
// 		}

// 		result.push(person);

// 		// Traverse down to children
// 		if (direction === 'down' || direction === 'both') {
// 			if (person.rels.children) {
// 				for (const childId of person.rels.children) {
// 					await traverse(childId, depth + 1, 'down');
// 				}
// 			}
// 		}

// 		// Traverse up to parents
// 		if (direction === 'up' || direction === 'both') {
// 			if (person.rels.parents) {
// 				for (const parentId of person.rels.parents) {
// 					await traverse(parentId, depth + 1, 'up');
// 				}
// 			}
// 		}

// 		// Include spouses at same level
// 		if (person.rels.spouses) {
// 			for (const spouseId of person.rels.spouses) {
// 				if (!visited.has(spouseId)) {
// 					const spouse = await getPerson(db, spouseId);
// 					if (spouse) {
// 						visited.add(spouseId);
// 						result.push(spouse);
// 					}
// 				}
// 			}
// 		}
// 	}

// 	const direction = includeAncestors ? 'both' : 'down';
// 	await traverse(rootPersonId, 0, direction);

// 	return result;
// }

// /**
//  * Search for people by name
//  */
// export async function searchPeople(db: D1Database, searchTerm: string): Promise<PersonData[]> {
// 	const searchPattern = `%${searchTerm}%`;

// 	const results = await db
// 		.prepare(
// 			`SELECT id FROM entities
//        WHERE first_name LIKE ? OR last_name LIKE ?
//        ORDER BY last_name, first_name
//        LIMIT 50`
// 		)
// 		.bind(searchPattern, searchPattern)
// 		.all();

// 	const personIds = results.results.map((e: any) => toPersonId(e.id));
// 	return getPeople(db, personIds);
// }
