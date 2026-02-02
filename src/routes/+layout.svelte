<script lang="ts">
	import '../app.css';
	import favicon from '$assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';

	import Button from '@/components/ui/button/button.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';

	let { children } = $props();

	const data = {
		malvpatel: 'malvpatel.com',
		github: 'https://github.com/malvpatel/personal-website/',
		familyEcho: 'https://www.familyecho.com/'
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<div class="flex min-h-dvh flex-col">
	<header class="flex items-center gap-2 p-4">
		<span class="text-4xl text-primary">Famtree</span>
		<span class="grow"></span>
		<span class="text-lg">Want to save your tree?</span>
		<Button size="lg" variant="default" class="text-xl">Login</Button>
	</header>
	<Separator />
	<div class="h-0 grow">
		{@render children()}
	</div>
	<Separator />
	<footer class="flex items-center gap-2 px-4 py-1">
		<nav class="contents">
			<ul class="contents">
				<li>
					<Button size="xs" variant="link" href={data.github}>Github</Button>
				</li>
				<li>
					Made by <Button size="xs" variant="link" href={data.malvpatel}>
						Malav Patel
					</Button>
				</li>
				<li>
					Orignal Insipritation from
					<Button size="xs" variant="link" href={data.familyEcho}>
						Family Echo
					</Button>
				</li>
			</ul>
		</nav>
	</footer>
</div>
