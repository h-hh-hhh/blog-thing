<script lang="ts">
    let { data } = $props();
	
	// svelte-ignore state_referenced_locally
	const Content = data.content;
</script>

<div class="max-w-3xl mx-auto py-10">
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
</div>
