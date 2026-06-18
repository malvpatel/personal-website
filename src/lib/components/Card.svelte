<script module>
	const cardWidth = 150;
	const cardHeight = 200;
</script>

<script lang="ts">
	import { upperFirst, type Position } from '$lib';
	interface CardProps {
		col: number;
		row: number;
		firstName: string;
		lastName: string | undefined;
	}

	let { col: x, row: y, firstName, lastName }: CardProps = $props();

	let fName = $derived(upperFirst(firstName));
	let lName = $derived(upperFirst(lastName ?? ''));
	let nameInitials = $derived(fName.charAt(0) + lName.charAt(0));

	function calculateTranslations(x: number, y: number): string {
		return `translate(${x} ${y})`;
	}
</script>

<g transform={calculateTranslations(x, y)}>
	<rect
		x="0"
		y="0"
		rx="8"
		width={cardWidth}
		height={cardHeight}
		fill="#ffffff"
		stroke-width="1"
		stroke="#6366f1"
	/>
	<circle cx="75" cy="75" r="50" fill="#4f46e5" opacity="0.1" />
	<circle cx="75" cy="75" r="45" fill="#6366f1" />
	<text x="75" y="90" text-anchor="middle" class="font-bold" font-size="32" fill="white">
		{nameInitials}
	</text>
	<text x="75" y="155" text-anchor="middle" font-size="24" font-weight="bold" fill="#1f2937">
		{fName}
	</text>
	{#if lName !== ''}
		<text x="75" y="175" text-anchor="middle" font-size="20" fill="#6b7280">{lName}</text>
	{/if}
</g>
