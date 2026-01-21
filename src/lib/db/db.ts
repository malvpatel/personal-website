// Type definitions matching your JSON format

// interface EntityModel {
// 	id: number;
// 	first_name: string;
// 	last_name?: string;
// 	gender: string;
// 	birth_date?: string;
// 	death_date?: string;
// 	email?: string;
// 	phone?: string;
// 	address?: string;
// 	notes?: string;
// 	created_at?: string;
// 	updated_at?: string;
// 	avatar?: string;
// }

// interface EntityRelations {
// 	parents: string;
// 	children: string;
// 	spouses: string;
// }

// interface EntityWithRelationsData extends Entity {
// 	parents: string;
// 	children: string;
// 	spouses: string;
// }

// interface EntityWithRelationsId extends Entity {
// 	parents: number[];
// 	children: number[];
// 	spouses: number[];
// }

/**
 * Get a single person with all their relationships in JSON format
 */
export async function getEntitiesWithRelations(db: D1Database, ids: number[]): Promise<Entity[]> {
	const placeholders = ids.map(() => '?').join(',');

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
		.bind(...ids)
		.all<EntityWithRelationsData>();

	if (!success) {
		return [];
	}

	const parsedResults = results.map<EntityWithRelationsId>((row) => ({
		...row,
		parents: row.parents ? JSON.parse(row.parents) : [],
		children: row.children ? JSON.parse(row.children) : [],
		spouses: row.spouses ? JSON.parse(row.spouses) : []
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
