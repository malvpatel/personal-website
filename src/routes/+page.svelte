<script lang="ts">
	// import f3data from '$assets/fam.json';
	// import * as f3 from '@/family-chart';
	// import '@/family-chart/styles/family-chart.css';

	// import { getEntities } from '@/db/entities.remote.js';

	let { data } = $props();
</script>

<main>
	<pre>
		I will print json 
		{JSON.stringify(data)}
	</pre>
</main>

<!-- {#await getEntities([3])}
	<p>Loading data...</p>
{:then data}
	<div
		class="f3"
		id="FamilyChart"
		style="width:100%;height:900px;margin:auto;background-color:rgb(33,33,33);color:#fff;"
		{@attach (ele) => {
			let localF3Data = localStorage.getItem('f3Data');

			console.log('localF3Data', localF3Data);

			if (!localF3Data) {
				console.log('I was updated');
				localStorage.setItem('f3Data', JSON.stringify(f3data));
				localF3Data = localStorage.getItem('f3Data');
			}

			const parsedF3Data = JSON.parse(localStorage.getItem('f3Data')!);

			const f3Chart = f3
				.createChart(ele, parsedF3Data)
				.setTransitionTime(1000)
				.setCardXSpacing(250)
				.setCardYSpacing(150)
				.setSingleParentEmptyCard(true, { label: 'ADD' })
				.setShowSiblingsOfMain(false)
				.setOrientationVertical();

			const f3Card = f3Chart
				.setCardHtml()
				.setCardDisplay([
					['first name', 'last name']
					// ['birthday']
				])
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

			f3EditTree.setOnChange(() => {
				console.log(localStorage.getItem('f3Data'));

				localStorage.setItem('f3Data', JSON.stringify(f3Chart.store.getData()));
			});
		}}
	></div>
	<pre>{JSON.stringify(data, null, 2)}</pre>
{:catch error}
	<p>Error loading data: {error.message}</p>
{/await} -->
