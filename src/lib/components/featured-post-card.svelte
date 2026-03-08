<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import EditIcon from '@lucide/svelte/icons/edit';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import XIcon from '@lucide/svelte/icons/x';
	import { resolve } from '$app/paths';

	const props = $props();
	let { post, user } = $derived(props);
</script>

<Card
	class="group relative cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-2 hover:scale-[1.02] hover:bg-accent/70 hover:shadow-xl"
>
	{#if post.heroImagePath}
		<div class="w-full p-6 pt-1 pb-0">
			<img
				src="{post.heroImagePath}"
				alt="Featured"
				class="aspect-video w-full rounded-xl border object-cover"
			/>
		</div>
	{/if}
	<CardHeader>
		<CardTitle class={post.heroImagePath ? "py-2 text-6xl" : "py-2 text-8xl"}>
			<h1>{post.title}</h1>
		</CardTitle>
		<div class="flex flex-row gap-1">
			{#each post.tag as tag (tag.slug)}
				<Badge class="cursor-default" variant="outline">
					{#if user && (user.role === 'admin' || user.id === post.author.id)}
						<button
							class="rounded-full ring-offset-background outline-none hover:bg-accent"
							aria-label="Remove tag"
						>
							<XIcon class="size-3 cursor-pointer" />
						</button>
					{/if}
					{tag.name}
				</Badge>
			{/each}
			{#if user && (user.role === 'admin' || user.id === post.author.id)}
				<Badge
					variant="outline-dashed"
					class="cursor-pointer bg-card hover:bg-accent"
					role="button"
				>
					<PlusIcon />
				</Badge>
			{/if}
		</div>
	</CardHeader>
	<CardContent>
		<p class="text-muted-foreground">{post.summary}</p>
	</CardContent>
	<CardFooter>
		<div class="flex w-full flex-row items-center justify-between">
			<div class="flex flex-col gap-1">
				<p class="text-left text-xs text-muted-foreground">by {post.author.name}</p>
				<CardDescription class="flex items-center gap-1.5 text-left text-xs"
					><CalendarIcon class="size-4" />{post.createdAt.toLocaleDateString()}<ClockIcon
						class="size-4"
					/>{post.createdAt.toLocaleTimeString()}</CardDescription
				>
			</div>
			<div class="flex gap-2">
				{#if user && (user.role === 'admin' || user.id === post.author.id)}
					<Button class="cursor-pointer" size="icon" variant="outline"><EditIcon /></Button>
				{/if}
				<Button class="cursor-pointer" href={resolve(`/posts/${post.slug}`)}
					>Read Full Post<ChevronRightIcon /></Button
				>
			</div>
		</div>
	</CardFooter>
</Card>
