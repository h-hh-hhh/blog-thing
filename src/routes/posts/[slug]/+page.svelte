<script lang="ts">
    let { data } = $props();
	
	// svelte-ignore state_referenced_locally
	const Content = data.content;
</script>

<article class="blog-post prose prose-slate dark:prose-invert max-w-none">
	<header>
		<h1>{data.post.title}</h1>
		<div class="meta">
			<span>By {data.post.author?.name}</span>
		</div>
	</header>

	<hr />

	<div class="content-wrapper">
		<Content />
	</div>

	<footer>
		<h3>Related Posts</h3>
	</footer>
</article>