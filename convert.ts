import * as fs from 'fs';

interface PersonRecord {
	id: string;
	surname: string;
	given: string;
	gender: string;
}

interface MarriageRecord {
	id: string;
	husband: string;
	wife: string;
}

interface FamilyChildRecord {
	family: string;
	child: string;
}

// Parse CSV content
function parseCSV(content: string): {
	persons: Map<string, PersonRecord>;
	marriages: MarriageRecord[];
	familyChildren: FamilyChildRecord[];
} {
	const lines = content.split('\n').filter((line) => line.trim());

	const persons = new Map<string, PersonRecord>();
	const marriages: MarriageRecord[] = [];
	const familyChildren: FamilyChildRecord[] = [];

	let section = '';

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		if (line.startsWith('Person,')) {
			section = 'person';
			continue;
		} else if (line.startsWith('Marriage,')) {
			section = 'marriage';
			continue;
		} else if (line.startsWith('Family,')) {
			section = 'family';
			continue;
		} else if (line.startsWith('Place,')) {
			continue;
		}

		if (section === 'person' && line.startsWith('[I')) {
			const parts = line.split(',');
			const id = parts[0].replace('[', '').replace(']', '');
			const surname = parts[1] || '';
			const given = parts[2] || '';
			const gender = parts[7] || 'unknown';

			persons.set(id, {
				id,
				surname,
				given,
				gender: gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'unknown'
			});
		} else if (section === 'marriage' && line.startsWith('[F')) {
			const parts = line.split(',');
			const id = parts[0].replace('[', '').replace(']', '');
			const husband = parts[1].replace('[', '').replace(']', '');
			const wife = parts[2].replace('[', '').replace(']', '');

			if (husband && wife) {
				marriages.push({ id, husband, wife });
			}
		} else if (section === 'family' && line.startsWith('[F')) {
			const parts = line.split(',');
			const family = parts[0].replace('[', '').replace(']', '');
			const child = parts[1].replace('[', '').replace(']', '');

			familyChildren.push({ family, child });
		}
	}

	return { persons, marriages, familyChildren };
}

// Convert person ID to numeric (remove 'I' prefix and convert to number)
function personIdToNumeric(id: string): number {
	return parseInt(id.replace('I', ''), 10);
}

// Escape single quotes for SQL
function escapeSql(str: string): string {
	return str.replace(/'/g, "''");
}

// Generate SQL seed file
function generateSQL(
	persons: Map<string, PersonRecord>,
	marriages: MarriageRecord[],
	familyChildren: FamilyChildRecord[]
): string {
	let sql = `-- Family Tree Database Seed File
-- Generated: ${new Date().toISOString()}
-- Records: ${persons.size} people, ${marriages.length} marriages

BEGIN TRANSACTION;

--------------------------------------------------------------------
-- INSERT ENTITIES (People)
--------------------------------------------------------------------

`;

	// Insert all persons
	persons.forEach((person) => {
		const id = personIdToNumeric(person.id);
		const firstName = escapeSql(person.given);
		const lastName = escapeSql(person.surname);
		const gender = person.gender;

		sql += `INSERT INTO entities (id, first_name, last_name, gender) VALUES (${id}, '${firstName}', '${lastName}', '${gender}');\n`;
	});

	sql += `
--------------------------------------------------------------------
-- INSERT SPOUSAL RELATIONSHIPS
--------------------------------------------------------------------

`;

	// Insert marriages (spouse relationships)
	marriages.forEach((marriage) => {
		if (marriage.husband && marriage.wife) {
			const spouse1 = personIdToNumeric(marriage.husband);
			const spouse2 = personIdToNumeric(marriage.wife);

			// Ensure spouse1_id < spouse2_id as per schema constraint
			const [lower, higher] = spouse1 < spouse2 ? [spouse1, spouse2] : [spouse2, spouse1];

			sql += `INSERT INTO spouses (spouse1_id, spouse2_id) VALUES (${lower}, ${higher});\n`;
		}
	});

	sql += `
--------------------------------------------------------------------
-- INSERT PARENT-CHILD RELATIONSHIPS
--------------------------------------------------------------------

`;

	// Build family to parents mapping
	const familyToParents = new Map<string, { husband: string; wife: string }>();
	marriages.forEach((m) => {
		familyToParents.set(m.id, { husband: m.husband, wife: m.wife });
	});

	// Insert parent-child relationships
	familyChildren.forEach((fc) => {
		const parents = familyToParents.get(fc.family);
		if (parents) {
			const childId = personIdToNumeric(fc.child);

			// Insert relationship for husband (if exists)
			if (parents.husband) {
				const parentId = personIdToNumeric(parents.husband);
				sql += `INSERT INTO parentages (parent_id, child_id, relationship_type) VALUES (${parentId}, ${childId}, 'biological');\n`;
			}

			// Insert relationship for wife (if exists)
			if (parents.wife) {
				const parentId = personIdToNumeric(parents.wife);
				sql += `INSERT INTO parentages (parent_id, child_id, relationship_type) VALUES (${parentId}, ${childId}, 'biological');\n`;
			}
		}
	});

	sql += `
COMMIT;

--------------------------------------------------------------------
-- SEED COMPLETE
-- Entities: ${persons.size}
-- Marriages: ${marriages.length}
-- Parent-child links: ${familyChildren.length * 2} (approximate)
--------------------------------------------------------------------
`;

	return sql;
}

// Main execution
function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.error('Usage: ts-node seed-generator.ts <input.csv> [output.sql]');
		process.exit(1);
	}

	const inputFile = args[0];
	const outputFile = args[1] || inputFile.replace('.csv', '_seed.sql');

	if (!fs.existsSync(inputFile)) {
		console.error(`Error: File ${inputFile} not found`);
		process.exit(1);
	}

	console.log(`Reading ${inputFile}...`);
	const content = fs.readFileSync(inputFile, 'utf-8');

	console.log('Parsing CSV...');
	const { persons, marriages, familyChildren } = parseCSV(content);

	console.log(
		`Found ${persons.size} persons, ${marriages.length} marriages, ${familyChildren.length} family-child relationships`
	);

	console.log('Generating SQL...');
	const sql = generateSQL(persons, marriages, familyChildren);

	console.log(`Writing to ${outputFile}...`);
	fs.writeFileSync(outputFile, sql);

	// Generate rollback file with specific IDs
	const rollbackFile = outputFile.replace('.sql', '_rollback.sql');

	// Collect all entity IDs
	const entityIds = Array.from(persons.keys()).map((id) => personIdToNumeric(id));
	const entityIdList = entityIds.join(', ');

	let rollbackSQL = `-- Family Tree Database Rollback File
-- Generated: ${new Date().toISOString()}
-- This will remove ONLY the data inserted from this seed file
-- Safe to run even if table has other existing data

BEGIN TRANSACTION;

--------------------------------------------------------------------
-- Delete parent-child relationships for these entities
--------------------------------------------------------------------

DELETE FROM parentages 
WHERE parent_id IN (${entityIdList}) 
   OR child_id IN (${entityIdList});

--------------------------------------------------------------------
-- Delete spousal relationships for these entities
--------------------------------------------------------------------

DELETE FROM spouses 
WHERE spouse1_id IN (${entityIdList}) 
   OR spouse2_id IN (${entityIdList});

--------------------------------------------------------------------
-- Delete the entities themselves
--------------------------------------------------------------------

DELETE FROM entities 
WHERE id IN (${entityIdList});

COMMIT;

--------------------------------------------------------------------
-- Rollback complete
-- Removed ${entityIds.length} entities and their relationships
--------------------------------------------------------------------
`;

	console.log(`Writing rollback to ${rollbackFile}...`);
	fs.writeFileSync(rollbackFile, rollbackSQL);

	console.log('Done!');
	console.log(`\nTo load this data into your database, run:`);
	console.log(`  sqlite3 your_database.db < ${outputFile}`);
	console.log(`\nTo rollback ONLY this seeded data, run:`);
	console.log(`  sqlite3 your_database.db < ${rollbackFile}`);
}

main();
