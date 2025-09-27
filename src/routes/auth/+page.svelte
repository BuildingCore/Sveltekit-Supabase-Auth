<script lang="ts">
	let email = '';
	let password = '';
	let isSignup = false;
	export let form: any;
</script>

<h1>Auth</h1>

{#if form?.error}
	<p style="color: red">{form.error}</p>
{/if}

<form method="POST" action={isSignup ? '?/signUp' : '?/login'}>
	<label>Email</label>
	<input type="email" bind:value={email} name="email" required />
	<label>Password</label>
	<input type="password" bind:value={password} name="password" autocomplete="current-password" required />
	<button type="submit">{isSignup ? 'Sign up' : 'Log in'}</button>
</form>

<label>
	<input type="checkbox" bind:checked={isSignup} /> Sign up instead
</label>
