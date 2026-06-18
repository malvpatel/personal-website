<script>
	import Card from '$lib/components/Card.svelte';
	import FamilyTree from '../lib/components/FamilyTree.svelte';

	let name = $state('world');
	let last = $state('');
</script>

<svelte:head>
	<title>Malav Patel</title>
</svelte:head>
<div class="flex min-h-dvh flex-col">
	<header>
		<h1>Malav Patel</h1>
	</header>
	<main class="grow p-4">
		<FamilyTree>
			<Card col={0} row={0} firstName="prashant" lastName="patel" />
			<Card col={300} row={0} firstName="parul" lastName="patel" />
			<Card col={150} row={200} firstName="malav" lastName="patel" />
			<line x1="150" y1="100" x2="300" y2="100" stroke-width="2" stroke="black"></line>
			<line x1="225" y1="100" x2="225" y2="200" stroke-width="2" stroke="black"></line>
		</FamilyTree>
	</main>
</div>
