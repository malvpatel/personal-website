interface Data {
	id: number;
}

export class FamilyTree<T extends Data> {
	// #primary: T | null = null;

	private constructor() {}

	static from<T extends Data>(people: T[]): FamilyTree<T> {
		const tree = new FamilyTree<T>();

		// tree.#primary = people.at(0) ?? null;

		for (const person of people) {
			tree.addPerson(person);
		}

		return tree;
	}

	addPerson(person: T) {
		console.log('Adding person:', person);
	}

	svgCards() {
		return [{ x: 0, y: 0, width: 150, height: 100 }];
	}

	htmlCards() {
		return [{ x: 0, y: 0, width: 150, height: 100 }];
	}
}
