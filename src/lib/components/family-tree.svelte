<script lang="ts">
	import panzoom, { type PanZoom } from 'panzoom';
	import type { Attachment } from 'svelte/attachments';
	import { type Snippet } from 'svelte';

	interface FamilyTreeProps {
		children?: Snippet<[]>;
	}

	let { children }: FamilyTreeProps = $props();

	const createPanAndZoom = () => {
		let instance: PanZoom | null = null;
		const attach: Attachment<SVGElement | HTMLDivElement> = (el) => {
			instance = panzoom(el);
			return instance.dispose;
		};
		return {
			attach,
			zoomTo: (x: number, y: number, scale: number) => {
				instance?.zoomTo(scale, x, y);
			},
			moveTo: (x: number, y: number) => {
				instance?.moveTo(x, y);
			}
		};
	};

	const pzHandle = createPanAndZoom();
</script>

<div class="relative h-full w-full bg-neutral-600">
	<svg class="h-full w-full bg-slate-200">
		<g {@attach pzHandle.attach}>
			{@render children?.()}
		</g>
	</svg>
	<!-- <div class="absolute inset-0">
		<div class="h-20 w-30 bg-red-100">
			<p class="text-red-500">Hello World</p>
		</div>
	</div> -->
</div>

<!-- <svg
	viewBox="0 0 900 900"
	class="rounded-lg border border-gray-200 bg-linear-to-b from-indigo-50 to-white"
>
	<g {@attach enablePanAndZoom}>
		{@render children?.()}
	</g>
</svg> -->
