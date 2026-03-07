<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { siteTitle } from '$lib/config/site';
	import { Button } from '$lib/components/ui/button';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import LoginForm from '$lib/components/ui/login-form.svelte';
	import UserGroup from '$lib/components/ui/user-group.svelte';
	import ModeSwitcher from '$lib/components/ui/mode-switcher.svelte';

	let { layoutLoginForm, layoutLogoutForm, user } = $props();

	const links = [{ href: '/', label: 'Home' }] as const;

	onMount(() => {
		if (!browser) return;
	});
</script>

<header class="sticky top-0 z-30 w-full border-b bg-card/80 backdrop-blur">
	<div class="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4 sm:px-6 lg:px-8">
		<a href={resolve('/')} class="text-lg font-semibold tracking-tight">
			{siteTitle}
		</a>

		<NavigationMenu.Root>
			<NavigationMenu.List>
				{#each links as link (link.href)}
					<NavigationMenu.Item>
						<Button variant="ghost" class="cursor-pointer" href={resolve(link.href)}>
							{link.label}
						</Button>
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<NavigationMenu.Root class="ml-auto">
			<NavigationMenu.List>
				<NavigationMenu.Item>
					{#if user}
						<UserGroup data={{ form: layoutLogoutForm, user: user }} />
					{:else}
						<LoginForm data={{ form: layoutLoginForm }} />
					{/if}
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<ModeSwitcher />
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
</header>
