<script lang="ts">
	import type { CardLayout } from '@/types/family-chart';
	let { layout }: { layout: CardLayout } = $props();
</script>

<g transform={`translate(${layout.x}, ${layout.y})`}>
	<rect width={layout.width} height={layout.height} fill="white" rx="8" ry="8" />
	<text
		x={layout.width / 2}
		y={layout.height / 2}
		text-anchor="middle"
		dominant-baseline="middle"
		font-size="16"
		fill="#374151"
	>
		Family Card
	</text>
</g>
