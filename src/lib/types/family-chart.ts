type Id = string;

interface EntityData {
	gender: 'M' | 'F' | (string & {});
}

export interface Entity<T extends EntityData = EntityData> {
	id: Id;
	data: T;
	rels: {
		parents: Id[];
		spouses: Id[];
		children: Id[];
	};
}

export interface CardLayout {
	x: number;
	y: number;
	width: number;
	height: number;
	textX?: number;
	textY?: number;
	imgWidth?: number;
	imgHeight?: number;
	imgX?: number;
	imgY?: number;
}

export const malav: Entity = {
	id: '1',
	data: {
		gender: 'M'
	},
	rels: {
		parents: [],
		spouses: [],
		children: []
	}
};
