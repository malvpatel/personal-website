<script lang="ts">
	// import * as f3 from '@/family-chart';
	// import '@/family-chart/styles/family-chart.css';
	import type { PageData } from './$types';
	import type { Person, Union, ParentChild } from '../db/schema';
	import { FamilyTreeViewer } from '@/components/family-tree/viewer';
	import FamilyCard from '@/components/family-card.svelte';

	let { data }: { data: PageData } = $props();

	$effect(() => {
		console.log('Page data:', data);
	});

	function transformToF3Data(
		persons: Person[],
		unions: Union[],
		links: ParentChild[]
	) {
		const f3Data = persons.map((p) => {
			const personId = p.id;

			// Find spouses
			const spouses = unions
				.filter((u) => u.partner1Id === personId || u.partner2Id === personId)
				.map((u) => (u.partner1Id === personId ? u.partner2Id : u.partner1Id))
				.filter((id): id is number => id !== null)
				.map(String);

			// Find children (where I am the parent)
			const children = links
				.filter((l) => l.parentId === personId)
				.map((l) => String(l.childId));

			// Find parents (where I am the child)
			const parents = links
				.filter((l) => l.childId === personId)
				.map((l) => String(l.parentId));

			return {
				id: String(p.id),
				data: {
					'first name': p.firstName,
					'last name': p.lastName,
					birthday: p.dateOfBirth,
					avatar: p.avatarUrl,
					gender: (p.gender === 'male'
						? 'M'
						: p.gender === 'female'
							? 'F'
							: 'M') as 'M' | 'F'
				},
				rels: {
					spouses,
					children,
					parents
				}
			};
		});

		return f3Data;
	}

	let chartContainer: HTMLElement;

	// onMount(() => {
	// if (!data.persons.length) return;
	// const parsedF3Data = transformToF3Data(
	// 	data.persons,
	// 	data.unions,
	// 	data.links
	// );
	// // Find main person (try ID 1 since we re-seeded)
	// const mainPerson =
	// 	parsedF3Data.find((p) => p.id === '1') || parsedF3Data[0];
	// const f3Chart = f3
	// 	.createChart(chartContainer, parsedF3Data)
	// 	.setTransitionTime(1000)
	// 	.setCardXSpacing(250)
	// 	.setCardYSpacing(150)
	// 	.setSingleParentEmptyCard(true, { label: 'ADD' })
	// 	.setShowSiblingsOfMain(false)
	// 	.setOrientationVertical();
	// const f3Card = f3Chart
	// 	.setCardHtml()
	// 	.setCardDisplay([['first name', 'last name'], ['birthday']])
	// 	.setMiniTree(true)
	// 	.setStyle('imageRect')
	// 	.setOnHoverPathToMain();
	// const f3EditTree = f3Chart
	// 	.editTree()
	// 	.fixed()
	// 	.setFields(['first name', 'last name', 'birthday', 'avatar'])
	// 	.setEditFirst(true)
	// 	.setCardClickOpen(f3Card);
	// f3EditTree.setEdit();
	// f3Chart.updateTree({ initial: true });
	// if (mainPerson) {
	// 	// @ts-ignore - library typing issue
	// 	f3EditTree.open(mainPerson.id);
	// }
	// });
</script>

<main class="h-full">
	<FamilyTreeViewer
		data={[{ id: 1, firstName: 'John', lastName: 'Doe' }]}
	></FamilyTreeViewer>
</main>
