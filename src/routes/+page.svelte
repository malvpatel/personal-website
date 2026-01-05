<script lang="ts">
	import { onMount } from 'svelte';

	import * as f3 from '$lib/family-chart';
	import '$lib/family-chart/styles/family-chart.css';

	let { data } = $props();

	let chartContainer;

	onMount(() => {
		if (!chartContainer) return;
		create(data());

		function create(data) {
			const f3Chart = f3
				.createChart('#FamilyChart', data)
				.setTransitionTime(1000)
				.setCardXSpacing(250)
				.setCardYSpacing(150)
				.setSingleParentEmptyCard(true, { label: 'ADD' })
				.setShowSiblingsOfMain(false)
				.setOrientationVertical();

			const f3Card = f3Chart
				.setCardHtml()
				.setCardDisplay([['first name', 'last name'], ['birthday']])
				.setCardDim(null)
				.setMiniTree(true)
				.setStyle('imageRect')
				.setOnHoverPathToMain();

			const f3EditTree = f3Chart
				.editTree()
				.fixed(true)
				.setFields(['first name', 'last name', 'birthday', 'avatar'])
				.setEditFirst(true)
				.setCardClickOpen(f3Card);

			f3EditTree.setEdit();

			f3Chart.updateTree({ initial: true });
			f3EditTree.open(f3Chart.getMainDatum());

			f3Chart.updateTree({ initial: true });
		}

		function data() {
			return [
				{
					id: '0',
					rels: {},
					data: {
						'first name': 'Name',
						'last name': 'Surname',
						birthday: 1970,
						avatar:
							'https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg',
						gender: 'M'
					}
				}
			];
		}
	});
</script>

<div
	class="f3"
	id="FamilyChart"
	bind:this={chartContainer}
	style="width:100%;height:900px;margin:auto;background-color:rgb(33,33,33);color:#fff;"
></div>
