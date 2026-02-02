import fs from 'node:fs';
import path from 'node:path';

const inputFile = path.join(process.cwd(), 'src/assets/fam_seed.sql');
const outputFile = path.join(process.cwd(), 'seed_compatible.sql');

if (!fs.existsSync(inputFile)) {
	console.error(`Input file not found: ${inputFile}`);
	process.exit(1);
}

const sqlContent = fs.readFileSync(inputFile, 'utf-8');
const lines = sqlContent.split('\n');

const newLines: string[] = [];

newLines.push('PRAGMA foreign_keys = OFF;');
newLines.push('BEGIN TRANSACTION;');

// 1. Create Default User and Tree
newLines.push(`
INSERT OR IGNORE INTO user (id, email, name) VALUES (1, 'admin@example.com', 'Admin User');
INSERT OR IGNORE INTO tree (id, name, description, created_by) VALUES (1, 'Patel Family Tree', 'Main family tree', 1);
INSERT OR IGNORE INTO tree_member (tree_id, user_id, role) VALUES (1, 1, 'owner');
`);

// 2. Process Lines
for (const line of lines) {
	if (line.trim().startsWith('--') || line.trim() === '') {
		continue;
	}

	if (line.includes('INSERT INTO entities')) {
		// INSERT INTO entities (id, first_name, last_name, gender) VALUES (88, 'Aarth', 'Amin', 'male');
		const match = line.match(/VALUES \((.+)\);/);
		if (match) {
			const values = match[1].split(',').map((v) => v.trim());
			const id = values[0];
			const firstName = values[1]; // already quoted
			const lastName = values[2]; // already quoted
			let gender = values[3]; // 'male' or 'female'

			// Normalize gender
			if (gender === "'male'") gender = "'M'";
			else if (gender === "'female'") gender = "'F'";
			else gender = "'O'"; // default/unknown

			newLines.push(
				`INSERT OR IGNORE INTO person (id, tree_id, first_name, last_name, gender, is_living) VALUES (${id}, 1, ${firstName}, ${lastName}, ${gender}, 1);`
			);
		}
	} else if (line.includes('INSERT INTO spouses')) {
		// INSERT INTO spouses (spouse1_id, spouse2_id) VALUES (1, 2);
		const match = line.match(/VALUES \((.+)\);/);
		if (match) {
			const values = match[1].split(',').map((v) => v.trim());
			const p1 = values[0];
			const p2 = values[1];
			newLines.push(
				`INSERT OR IGNORE INTO "union" (tree_id, partner1_id, partner2_id, union_type, status) VALUES (1, ${p1}, ${p2}, 'marriage', 'active');`
			);
		}
	} else if (line.includes('INSERT INTO parentages')) {
		// INSERT INTO parentages (parent_id, child_id, relationship_type) VALUES (1, 0, 'biological');
		const match = line.match(/VALUES \((.+)\);/);
		if (match) {
			const values = match[1].split(',').map((v) => v.trim());
			const parentId = values[0];
			const childId = values[1];
			const type = values[2]; // 'biological' already quoted

			newLines.push(
				`INSERT OR IGNORE INTO parent_child (parent_id, child_id, relationship_type) VALUES (${parentId}, ${childId}, ${type});`
			);
		}
	}
}

newLines.push('COMMIT;');
newLines.push('PRAGMA foreign_keys = ON;');

fs.writeFileSync(outputFile, newLines.join('\n'));
console.log(`Generated ${outputFile} with ${newLines.length} lines.`);
