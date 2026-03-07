<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/db/schema';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let open = $state(false);

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form, {
		id: 'login-layout',
		validators: zod4Client(loginSchema),
		applyAction: false,
		invalidateAll: false,
		onResult: async ({ result }) => {
			if (result.type === 'failure' && result.data) {
				form.errors.set(result.data.form.errors);
				form.message.set(result.data.form.message);
			} else if (result.type === 'success') {
				open = false;
				await invalidateAll();
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button class="cursor-pointer" variant="ghost" size="sm">Sign In</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-100">
		<Dialog.Header>
			<Dialog.Title>Login</Dialog.Title>
			<Dialog.Description>Enter your name below to login to your account.</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="/auth/login" use:enhance class="space-y-5">
			<input type="hidden" name="csrf" value={$formData.csrf} />
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<Input
							type="text"
							placeholder="Your name"
							{...props}
							bind:value={$formData.name}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input
							type="password"
							placeholder="••••••••"
							{...props}
							bind:value={$formData.password}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Dialog.Footer class="pt-2">
				<Button type="submit" size="sm" class="w-full cursor-pointer" disabled={$delayed}>
					{$delayed ? 'Authenticating...' : 'Sign In'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
