import { query, getRequestEvent } from '$app/server';
import { EntitiesRepo, type Entity, getEntitiesGraph } from './db';

interface FamilyChartPerson {
	id: string;
	data: {
		first_name: string;
		last_name?: string;
		birthday?: string;
		avatar?: string;
		gender: 'M' | 'F';
	};
	rels: {
		parents?: string[];
		spouses?: string[];
		children?: string[];
	};
}

export const getEntities = query('unchecked', async (ids: number[]) => {
	const { platform } = getRequestEvent();

	const entitiesRepo = new EntitiesRepo(platform!.env.FAMTREE);

	const data = await entitiesRepo.getByIds(ids, { withRelationships: false });

	if (data.isErr()) {
		console.log(data.error);
		return [];
	}

	return data.value;
});

// export const getEntities = query('unchecked', async (ids: number[]) => {
// 	const { platform } = getRequestEvent();

// 	const entities = await getEntitiesGraph(platform!.env.FAMTREE, ids.at(0)!, 1);

// 	if (entities.length === 0) {
// 		return [];
// 	}

// 	return transformEntitiesToFamilyChartPerson(entities);
// });

// function transformEntitiesToFamilyChartPerson(entities: Entity[]): FamilyChartPerson[] {
// 	return entities.map((entity) => ({
// 		id: entity.id.toString(),
// 		data: {
// 			first_name: entity.first_name,
// 			last_name: entity.last_name ?? undefined,
// 			birthday: entity.birth_date ?? undefined,
// 			avatar: entity.avatar ?? undefined,
// 			gender: entity.gender === 'male' ? 'M' : entity.gender === 'female' ? 'F' : 'M'
// 		},
// 		rels: {
// 			parents: entity.parents?.map(String),
// 			spouses: entity.spouses?.map(String),
// 			children: entity.children?.map(String)
// 		}
// 	}));
// }
