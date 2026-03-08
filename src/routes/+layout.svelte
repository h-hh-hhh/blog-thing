<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { ModeWatcher } from "mode-watcher";
	import { siteDescription, siteOgImage, siteTitle, siteUrl, twitterHandle } from '$lib/config/site';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>{siteTitle}</title>
	<meta name="description" content={siteDescription} />
	<link rel="canonical" href={siteUrl} />
	<link rel="icon" href={favicon} />

	<meta property="og:title" content={siteTitle} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:image" content={`${siteUrl}${siteOgImage}`} />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={siteTitle} />
	<meta name="twitter:description" content={siteDescription} />
	<meta name="twitter:image" content={`${siteUrl}${siteOgImage}`} />
	{#if twitterHandle}
		<meta name="twitter:site" content={twitterHandle} />
	{/if}
</svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<ModeWatcher />
	<Header layoutLoginForm={data.layoutLoginForm} layoutLogoutForm={data.layoutLogoutForm} user={data.user} />
	<main class="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 lg:px-8">
		{@render children()}
	</main>
	<Footer />
</div>
