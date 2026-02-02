import {
	zoom,
	zoomIdentity,
	select,
	type ZoomBehavior,
	type ZoomTransform,
	type Selection
} from 'd3';
import type { Attachment } from 'svelte/attachments';

interface Transform {
	x: number;
	y: number;
	k: number;
}

export function createPanZoom() {
	let zoomBehavior: ZoomBehavior<SVGElement, unknown> | null = null;
	let selection: Selection<SVGElement, unknown, null, undefined> | null = null;

	const transform = $state<Transform>({
		x: 0,
		y: 0,
		k: 1
	});

	const attach: Attachment<SVGElement> = (node: SVGElement) => {
		selection = select(node);
		zoomBehavior = zoom<SVGElement, unknown>()
			.scaleExtent([0.1, 10])
			.on('zoom', (event: { transform: ZoomTransform }) => {
				transform.x = event.transform.x;
				transform.y = event.transform.y;
				transform.k = event.transform.k;
			});

		selection.call(zoomBehavior);

		return () => {
			if (selection && zoomBehavior) {
				selection.on('.zoom', null);
			}
			zoomBehavior = null;
			selection = null;
		};
	};

	function zoomTo(x: number, y: number, scale: number): void {
		if (!selection || !zoomBehavior) return;
		selection
			.transition()
			.duration(300)
			.call(zoomBehavior.transform, zoomIdentity.translate(x, y).scale(scale));
	}

	function reset(): void {
		if (!selection || !zoomBehavior) return;
		selection
			.transition()
			.duration(300)
			.call(zoomBehavior.transform, zoomIdentity);
	}

	function getTransform(): Transform {
		return { ...transform };
	}

	return {
		attach,
		transform,
		zoomTo,
		reset,
		getTransform
	};
}
