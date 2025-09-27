<script lang="ts">
	import { onMount } from 'svelte';
	import { initInactivityWatcher } from '$lib/inactivity';

	onMount(() => {
		initInactivityWatcher();
	});
</script>

<slot />
