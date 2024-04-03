<script>
	export let value = 150;
    export let maxRent = 3000;
    export let minRent = 0;
</script>

<input type=range bind:value={value} min={minRent} max={maxRent}>
<span>{ value }</span>

<style>
	span {
		display: inline-block;
		padding: 0 .4em;
		border-radius: .3em;
		background: oklch(95% 2% 200);
	}
</style>