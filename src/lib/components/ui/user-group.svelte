<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { logoutSchema } from '$lib/db/schema';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';

	const props = $props();
	let { data } = props;

	const form = superForm(data.form, {
		id: 'logout-layout',
		validators: zod4Client(logoutSchema),
		applyAction: true
	});

	const { form: formData, enhance, delayed } = form;
</script>

<NavigationMenu.Root>
	<NavigationMenu.List>
		<span class="text-sm text-muted-foreground">{data.user.email}</span>
		<form action="/auth/logout" method="POST" use:enhance>
			<input type="hidden" name="csrf" value={$formData.csrf} />
			<Button class="cursor-pointer" type="submit" variant="outline" size="sm" disabled={$delayed}>
				{$delayed ? 'Signing out...' : 'Sign Out'}
			</Button>
		</form>
	</NavigationMenu.List>
</NavigationMenu.Root>
