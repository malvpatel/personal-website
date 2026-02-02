<script lang="ts">
	import { select, zoom } from 'd3';
	import type { Attachment } from 'svelte/attachments';
	import { type Snippet } from 'svelte';
	import ZoomIndicator from '../zoom-indicator/zoom-indicator.svelte';

	interface FamilyTreeProps {
		children?: Snippet<[]>;
	}

	let { children }: FamilyTreeProps = $props();

	const panAndZoom: Attachment<SVGElement | HTMLDivElement> = (el) => {
		const behavior = zoom<SVGAElement | HTMLDivElement, null>().on(
			'zoom',
			(event) => {
				const { transform } = event;
				console.log(transform);
				// el.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`;
			}
		);

		select(el).call(behavior);
	};

	// const createPanAndZoom = () => {
	// 	let instance: PanZoom | null = null;
	// 	const attach: Attachment<SVGElement | HTMLDivElement> = (el) => {
	// 		instance = panzoom(el);
	// 		return instance.dispose;
	// 	};
	// 	return {
	// 		attach,
	// 		zoomTo: (x: number, y: number, scale: number) => {
	// 			instance?.zoomTo(scale, x, y);
	// 		},
	// 		moveTo: (x: number, y: number) => {
	// 			instance?.moveTo(x, y);
	// 		}
	// 	};
	// };

	// const pAZHandle = createPanAndZoom();

	// setTimeout(() => {
	// 	pAZHandle.zoomTo(0, 0, 0.5);
	// }, 5000);
</script>

<div class="grid h-full grid-rows-[1fr_auto]">
	<svg class="col-span-full row-span-full h-full w-full">
		{@render children?.()}
	</svg>
	<div class="col-span-full row-span-full" {@attach panAndZoom}>
		<h1>HELLO WORLD</h1>
	</div>
	<div class="col-span-full row-2 flex h-12 justify-center">
		<ZoomIndicator />
	</div>
</div>

<!-- <div class="relative h-full">
	<svg class="h-full w-full">
		<g {@attach pzHandle.attach}>
			{@render children?.()}
		</g>
	</svg>
	<div class="absolute inset-0">
		<div class="h-20 w-30 bg-red-100">
			<p class="text-red-500">Hello World</p>
		</div>
	</div>
	<div class="absolute top-0 left-0 h-12 w-12">
		<Slider type="single" max={100} step={1} />
	</div>
</div> -->
