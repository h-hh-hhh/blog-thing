<script lang="ts">
	import FeaturedPostCard from '$lib/components/featured-post-card.svelte';
	import PostCard from '$lib/components/post-card.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import BookDashedIcon from '@lucide/svelte/icons/book-dashed';
	import { Button } from '$lib/components/ui/button';
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

{#if data.post?.length || 0}
	<div class="flex flex-col gap-6 py-6">
		<FeaturedPostCard post={data.post[0]} user={data.user}/>
		{#each data.post.slice(1) as post (post.slug)}
			<PostCard {post} user={data.user}/>
		{/each}
	</div>
{:else}
	<Empty.Root>
		<Empty.Header>
			<Empty.Media variant="icon">
				<BookDashedIcon />
			</Empty.Media>
			<Empty.Title>No Posts Yet</Empty.Title>
			<Empty.Description>
				There are no posts on this blog yet. {#if data.user} Get started by creating your first post.{/if}
			</Empty.Description>
		</Empty.Header>
		{#if data.user}
			<Empty.Content>
				<div class="flex gap-2">
					<Button href={resolve('/posts/new')}>Create Post</Button>
					<Button href={resolve('/posts/upload')} variant="outline">Upload Post from .md</Button>
				</div>
			</Empty.Content>
		{/if}
	</Empty.Root>
{/if}
