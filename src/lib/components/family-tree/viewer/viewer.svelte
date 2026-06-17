<script lang="ts">
	import { type Snippet } from 'svelte';
	import ZoomIndicator from '../zoom-indicator/zoom-indicator.svelte';
	import { createPanZoom } from '../zoom-indicator/pan-and-zoom.svelte';
	import { FamilyTree } from '../family-tree';

	interface Position {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	interface Person {
		id: number;
		firstName: string;
		lastName: string;
		// dateOfBirth: string;
		// avatarUrl: string;
		// gender: 'male' | 'female' | 'unknown';
	}

	interface FamilyTreeProps {
		people: Person[];
	}

	const { people }: FamilyTreeProps = $props();

	const ftree = $derived(FamilyTree.from(people));

	const handle = createPanZoom();
</script>

{#snippet svgcard({ x, y, width, height }: Position)}
	<g transform={`translate(${x}, ${y})`}>
		<rect {width} {height} fill="white" rx="8" ry="8" />
		<text
			x={width / 2}
			y={height / 2}
			text-anchor="middle"
			dominant-baseline="middle"
			font-size="16"
			fill="#374151"
		>
			Family Card
		</text>
	</g>
{/snippet}

{#snippet htmlcard({ x, y, width, height }: Position)}
	<div
		class="absolute"
		style={`left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px;`}
	>
		<p>I am HTML Card</p>
	</div>
{/snippet}

<div class="grid h-full grid-rows-[1fr_auto]">
	<svg class="col-span-full row-span-full h-full w-full">
		<g transform={handle.transformAttribute}>
			{#each ftree.svgCards() as svgRect}
				{@render svgcard(svgRect)}
			{/each}
		</g>
	</svg>
	<div
		class="col-span-full row-span-full overflow-hidden"
		{@attach handle.attach}
	>
		<div
			class="relative origin-top-left"
			style={`transform: ${handle.transformStyle}`}
		>
			{#each ftree.htmlCards() as card}
				{@render htmlcard(card)}
			{/each}
		</div>
	</div>
	<div class="col-span-full row-2 flex h-12 justify-center bg-background/40">
		<ZoomIndicator
			scalePercentage={handle.scalePercentage}
			zoomReset={() => handle.zoomReset()}
			zoomIn={() => handle.zoomIn(10)}
			zoomOut={() => handle.zoomOut(10)}
		/>
	</div>
</div>
