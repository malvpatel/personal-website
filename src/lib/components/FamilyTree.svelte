<script module>
	let width = 1500;
	let height = 1500;
</script>

<script lang="ts">
	import panzoom, { type PanZoom } from 'panzoom';
	import type { Attachment } from 'svelte/attachments';
	import { untrack, type Snippet } from 'svelte';

	interface FamilyTreeProps {
		children?: Snippet<[]>;
	}
	let handle: PanZoom | null = $state(null);

	let { children }: FamilyTreeProps = $props();

	const enablePanAndZoom: Attachment<SVGElement> = (el) => {
		const instance = panzoom(el);
		handle = instance;
		return instance?.dispose;
	};
</script>

<div class="flex flex-row">
	<div class="flex-1 bg-teal-200">
		<h1>Malav Patel</h1>
	</div>
	<svg
		viewBox="0 0 900 900"
		class="flex-3 rounded-lg border border-gray-200 bg-linear-to-b from-indigo-50 to-white"
	>
		<g {@attach enablePanAndZoom}>
			{@render children?.()}
		</g>
	</svg>
</div>
