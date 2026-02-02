<script lang="ts">
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import Slider from '../../ui/slider/slider.svelte';
	import Button from '@/components/ui/button/button.svelte';

	let { zoom = $bindable(0) } = $props();

	function handleZoomIn() {
		zoom = Math.min(zoom + 10, 100);
	}

	function handleZoomOut() {
		zoom = Math.max(zoom - 10, 0);
	}

	$effect(() => {
		// You can add any side effects related to zoom changes here
		console.log('Zoom level changed to:', zoom);
	});
</script>

<div class="flex min-w-60 items-center gap-2">
	<Button variant="ghost" size="icon" onclick={handleZoomOut}>
		<ZoomOut />
	</Button>
	<Slider type="single" max={100} step={1} bind:value={zoom} />
	<Button variant="ghost" size="icon" onclick={handleZoomIn}>
		<ZoomIn />
	</Button>
</div>
