<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import { siteDescription, siteOgImage, siteTitle, siteUrl, twitterHandle } from '$lib/config/site';
	import { resolve } from '$app/paths';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const Content = data.content;

	const postTitle = data.post.title ? `${data.post.title} | ${siteTitle}` : siteTitle;
	const postDescription = data.post.summary || siteDescription;
	const canonicalUrl = `${siteUrl}${resolve(`/posts/${data.post.slug}`)}`;
	const heroPath = data.post.heroImagePath ? `/uploads/${data.post.heroImagePath}` : siteOgImage;
	const ogImageUrl = `${siteUrl}${heroPath}`;
</script>

<svelte:head>
	<title>{postTitle}</title>
	<meta name="description" content={postDescription} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:title" content={postTitle} />
	<meta property="og:description" content={postDescription} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="article" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={postTitle} />
	<meta name="twitter:description" content={postDescription} />
	<meta name="twitter:image" content={ogImageUrl} />
	{#if twitterHandle}
		<meta name="twitter:site" content={twitterHandle} />
	{/if}
</svelte:head>

<header class="relative left-1/2 isolate -mt-24 w-screen -translate-x-1/2 overflow-hidden pt-24">
	{#if data.post.heroImagePath}
		<img
			src="/uploads/{data.post.heroImagePath}"
			alt=""
			class="absolute inset-0 h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-background"></div>
		<div class="relative z-10 mx-auto w-full max-w-5xl px-6 pt-120 pb-8">
			<h1 class="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				{data.post.title}
			</h1>
			<div class="meta flex flex-row justify-between">
				<span class="text-sm text-muted-foreground">by {data.post.author?.name}</span>
				<span class="flex items-center gap-1.5 text-sm text-muted-foreground"
					><CalendarIcon class="size-4" />{data.post.createdAt.toLocaleDateString()}<ClockIcon
						class="size-4"
					/>{data.post.createdAt.toLocaleTimeString()}</span
				>
			</div>
		</div>
	{:else}
		<div class="relative z-10 mx-auto w-full max-w-5xl px-6 pt-16 pb-8">
			<h1 class="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				{data.post.title}
			</h1>
			<div class="meta flex flex-row justify-between">
				<span class="text-sm text-muted-foreground">by {data.post.author?.name}</span>
				<span class="flex items-center gap-1.5 text-sm text-muted-foreground"
					><CalendarIcon class="size-4" />{data.post.createdAt.toLocaleDateString()}<ClockIcon
						class="size-4"
					/>{data.post.createdAt.toLocaleTimeString()}</span
				>
			</div>
		</div>
	{/if}
</header>

<div class="content-wrapper">
	<Content />
</div>
