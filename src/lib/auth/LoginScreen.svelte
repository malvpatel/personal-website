<script lang="ts">
	import { refreshAll } from '$app/navigation';
	import { authClient } from '#lib/auth/index.ts';

	import { Button } from '#lib/components/ui/button/index.ts';
	import { Separator } from '#lib/components/ui/separator/index.ts';
	import {
		Field,
		FieldLabel,
		FieldGroup
	} from '#lib/components/ui/field/index.ts';
	import { Input } from '#lib/components/ui/input/index.ts';

	const id = $props.id();
</script>

<div class="grid h-svh">
	<main class="place-self-center px-8">
		<h1 class="font-serif text-4xl lg:text-6xl 2xl:text-8xl">
			FamTree <span class="text-sm">of Malav Patel</span>
		</h1>
		<p class="mt-2 text-justify">
			Hi, If you landed here it means you are a Family Tree Member.<br />
			Please login using your passkey to continue.
		</p>

		<Separator class="mt-8 px-8" />

		<div class="flex flex-col items-stretch gap-2 px-16 py-2">
			<Button
				onclick={() =>
					authClient.signIn.passkey({
						fetchOptions: {
							onSuccess(_ctx) {
								refreshAll();
								// goto('/famtree');
							}
						}
					})}
			>
				Login with Passkey
			</Button>
		</div>

		<!-- <form class="mt-2" method="POST">
			<FieldGroup>
				<Field class="gap-2">
					<FieldLabel class="text-lg" for="email-{id}">Email</FieldLabel>
					<div class="flex flex-wrap gap-x-2 gap-y-3 md:flex-nowrap">
						<Input
							class="grow md:basis-auto"
							name="email"
							id="email-{id}"
							type="email"
							placeholder="name@example.com"
							required
						/>
						<Button class="basis-full md:basis-1/4" type="submit">Login</Button>
					</div>
				</Field>
			</FieldGroup>
		</form> -->

		<Separator />
	</main>
</div>
