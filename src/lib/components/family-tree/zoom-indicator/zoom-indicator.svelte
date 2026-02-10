<script lang="ts">
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	// import Slider from '../../ui/slider/slider.svelte';
	import Button from '@/components/ui/button/button.svelte';

	interface ZoomIndicatorProps {
		zoomIn: () => void;
		zoomOut: () => void;
		zoomReset: () => void;
		scalePercentage: number;
	}

	let { zoomIn, zoomOut, zoomReset, scalePercentage }: ZoomIndicatorProps =
		$props();
</script>

<div class="flex min-w-60 items-center gap-2">
	<Button variant="ghost" size="icon" onclick={zoomOut}>
		<ZoomOut />
	</Button>
	<Button class="min-w-18" variant="ghost" size="sm" onclick={zoomReset}>
		{scalePercentage.toFixed(0)}%
	</Button>
	<!-- <Slider type="single" min={-90} max={1500} step={1} value={scalePercentage} /> -->
	<Button variant="ghost" size="icon" onclick={zoomIn}>
		<ZoomIn />
	</Button>
</div>
