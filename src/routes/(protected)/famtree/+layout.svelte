<script lang="ts">
	import favicon from '#assets/favicon.svg';

	import { ModeWatcher } from 'mode-watcher';

	import { authClient } from '#lib/auth/index.ts';

	import { Button } from '#lib/components/ui/button/index.ts';
	import { Separator } from '#lib/components/ui/separator/index.ts';

	import { refreshAll } from '$app/navigation';

	const { children } = $props();

	const staticData = {
		malvpatel: 'https://malvpatel.com',
		github: 'https://github.com/malvpatel/personal-website/',
		familyEcho: 'https://www.familyecho.com/'
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<header class="flex items-center gap-2 p-4">
		<a class="text-4xl text-primary" href="/">Famtree</a>
		<span class="grow"></span>
		<Button
			size="lg"
			onclick={() =>
				authClient.signOut({
					fetchOptions: {
						onSuccess(_ctx) {
							refreshAll();
						}
					}
				})}
			class="text-lg"
		>
			Logout
		</Button>
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
					<Button size="xs" variant="link" href={staticData.github}>
						Github
					</Button>
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
