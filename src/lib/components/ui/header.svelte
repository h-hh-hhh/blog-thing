<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { siteTitle } from '$lib/config/site';
	import { Button } from '$lib/components/ui/button';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { Toggle } from '$lib/components/ui/toggle';
	import LoginForm from '$lib/components/ui/loginform.svelte';

	let { layoutLoginForm, user } = $props();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/auth/login', label: 'Log in' }
	] as const;
	let isDark = $state(true);

	const applyTheme = (dark: boolean) => {
		if (!browser) return;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	};

	onMount(() => {
		if (!browser) return;
		const stored = localStorage.getItem('theme');
		isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
		applyTheme(isDark);
	});

	$effect(() => {
		applyTheme(isDark);
	});
</script>

<header class="sticky top-0 z-30 w-full border-b bg-card/80 backdrop-blur">
	<div class="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4 sm:px-6 lg:px-8">
		<a href={resolve('/')} class="text-sm font-semibold tracking-tight">
			{siteTitle}
		</a>

		<NavigationMenu.Root>
			<NavigationMenu.List>
				{#each links as link (link.href)}
					<NavigationMenu.Item>
						<Button variant="ghost" href={resolve(link.href)}>
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
						<span class="text-sm text-muted-foreground">{user.email}</span>
					{:else}
						<LoginForm data={{ form: layoutLoginForm }} />
					{/if}
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<Toggle variant="outline" size="sm" aria-label="Toggle dark mode" bind:pressed={isDark}>
						{#if isDark}
							<SunIcon />
						{:else}
							<MoonIcon />
						{/if}
					</Toggle></NavigationMenu.Item
				>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
</header>
