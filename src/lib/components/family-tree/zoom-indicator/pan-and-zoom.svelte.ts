import { select, zoom, zoomIdentity } from 'd3';
import type { D3ZoomEvent } from 'd3';
import type { Attachment } from 'svelte/attachments';

type PanZoomProps = {
	scaleExtent?: [number, number];
};

type AllowableElements = HTMLDivElement | SVGGElement;
type Selection = ReturnType<typeof select<AllowableElements, unknown>>;
type ZoomEvent = D3ZoomEvent<AllowableElements, unknown>;

function createPanZoom(props: PanZoomProps = {}) {
	const scaleExtent = props.scaleExtent ?? [0.1, 16];

	let transform = $state.raw(zoomIdentity);
	const scalePercentage = $derived((transform.k - 1) * 100);

	let selection: Selection | undefined = undefined;
	const zoomBehavior = zoom<AllowableElements, unknown>()
		.scaleExtent(scaleExtent)
		.on('zoom', (event: ZoomEvent) => {
			transform = event.transform;
		});

	const attach: Attachment<AllowableElements> = (node) => {
		selection = select(node);

		selection.call(zoomBehavior);

		return () => {
			selection?.on('.zoom', null);
		};
	};

	return {
		attach,
		get transform() {
			return transform;
		},
		get transformStyle() {
			return `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`;
		},
		get transformAttribute() {
			return transform.toString();
		},
		get scalePercentage() {
			return scalePercentage;
		},
		zoomReset() {
			selection?.call(zoomBehavior.scaleTo, 1);
		},
		zoomIn(percentage = 10) {
			selection?.call(
				zoomBehavior.scaleTo,
				(this.scalePercentage + percentage) * 0.01 + 1
				// transform.k * (1 + percentage * 0.01)
			);
		},
		zoomOut(percentage = 10) {
			selection?.call(
				zoomBehavior.scaleTo,
				(this.scalePercentage - percentage) * 0.01 + 1
				// transform.k * (1 - percentage * 0.01)
			);
		}
	};
}

export { createPanZoom };
