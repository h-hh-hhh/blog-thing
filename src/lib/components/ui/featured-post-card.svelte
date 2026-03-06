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

	//const props = $props();
	//let { data } = props;
</script>

<Card class="group relative overflow-hidden transition-all hover:shadow-md hover:bg-accent/70 cursor-pointer">
	<div class="w-full p-6 pt-1 pb-0">
		<img
			src="https://picsum.photos/800"
			alt="Featured"
			class="aspect-video w-full rounded-xl border object-cover"
		/>
	</div>
	<CardHeader>
		<CardTitle class="text-4xl py-2">Featured Post Title</CardTitle>
		<div class="flex flex-row gap-1">
			<Badge class="bg-card" variant="outline">Tag 1</Badge>
			<Badge class="bg-card" variant="outline">
				<button
					class="rounded-full ring-offset-background outline-none hover:bg-accent cursor-pointer"
					aria-label="Remove tag"
				>
					<XIcon class="size-3" />
				</button>
				Tag 2
			</Badge>
			<Badge variant="outline-dashed" class="bg-card cursor-pointer hover:bg-accent" role="button">
				<PlusIcon />
			</Badge>
		</div>
	</CardHeader>
	<CardContent>
		<p class="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
	</CardContent>
	<CardFooter>
		<div class="flex flex-row justify-between items-center w-full">
			<div class="flex flex-col gap-1">
				<p class="text-muted-foreground text-xs text-left">by admin</p>
				<CardDescription class="flex items-center gap-1.5 text-xs text-left"><CalendarIcon class="size-4" />2026-01-01<ClockIcon class="size-4" />14:00</CardDescription>
			</div>
			<div class="flex gap-2">
				<Button class="cursor-pointer" size="icon" variant="outline"><EditIcon /></Button>
				<Button class="cursor-pointer">Read Full Post<ChevronRightIcon /></Button>
			</div>
		</div>
	</CardFooter>
</Card>
