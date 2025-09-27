<script lang="ts">
	async function logout() {
		try {
			await fetch('/api/logout', { method: 'POST' });
		} finally {
			location.href = '/auth';
		}
	}
	</script>

<h2>Protected area (/app)</h2>
<p>If you can see this, you’re logged in.</p>
<button on:click={logout}>Log out</button>
