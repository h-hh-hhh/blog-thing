<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/ui/header.svelte';
	import Footer from '$lib/components/ui/footer.svelte';
	import { ModeWatcher } from "mode-watcher";

	let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<ModeWatcher />
	<Header layoutLoginForm={data.layoutLoginForm} layoutLogoutForm={data.layoutLogoutForm} user={data.user} />
	<main class="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
		{@render children()}
	</main>
	<Footer />
</div>
