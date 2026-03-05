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
	import XIcon from '@lucide/svelte/icons/x';

	//const props = $props();
	//let { data } = props;
</script>

<Card class="overflow-hidden">
	<div class="w-full p-4">
		<img
			src="/puneet.png"
			alt="Featured"
			class="aspect-video w-full rounded-xl border object-cover"
		/>
	</div>
	<CardHeader>
		<div class="flex flex-row gap-1">
			<Badge variant="outline">Tag 1</Badge>
			<Badge variant="outline">
				<button
					class="rounded-full ring-offset-background outline-none hover:bg-muted"
					aria-label="Remove tag"
				>
					<XIcon class="size-3" />
				</button>
				Tag 2
			</Badge>
			<Badge variant="outline-dashed" class="hover:bg-muted" role="button">
				<PlusIcon />
			</Badge>
		</div>
		<CardTitle class="text-3xl">Featured Post Title</CardTitle>
		<CardDescription>A very long featured post summary that describes the post.</CardDescription>
		<CardDescription>by admin</CardDescription>
	</CardHeader>
	<CardContent>
		<p class="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
	</CardContent>
	<CardFooter class="gap-2">
		<Button>Read Full Post</Button>
		<Button class="icon" variant="outline"><EditIcon /></Button>
	</CardFooter>
</Card>
