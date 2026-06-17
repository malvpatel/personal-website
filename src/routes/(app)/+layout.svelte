<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';

	let { children, data } = $props();

	const staticData = {
		malvpatel: 'https://malvpatel.com',
		github: 'https://github.com/malvpatel/personal-website/',
		familyEcho: 'https://www.familyecho.com/'
	};
</script>

<div class="flex min-h-dvh flex-col">
	<header class="flex items-center gap-2 p-4">
		<a class="text-4xl text-primary" href="/">Famtree</a>
		<span class="grow"></span>
		<span class="text-lg">Want to save your tree?</span>
		<Button size="lg" href="/login" class="text-lg">Login</Button>
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
					<Button size="xs" variant="link" href={staticData.github}
						>Github</Button
					>
				</li>
				<li>
					Made by <Button size="xs" variant="link" href={staticData.malvpatel}>
						Malav Patel
					</Button>
				</li>
				<li>
					Orignal Insipritation from
					<Button size="xs" variant="link" href={staticData.familyEcho}>
						Family Echo
					</Button>
				</li>
			</ul>
		</nav>
	</footer>
</div>
