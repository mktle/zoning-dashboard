<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	// import { scaleLinear, max } from 'd3';

	// Parameters for the slider
	export let value = 150;
    export let maxRent = 3000;
    export let minRent = 0;

	let rentData = []
	onMount(async function() {
		rentData = await d3.csv("http://localhost:5173/src/routes/Rent_averages_BHA.csv", (d) => ({
		// CORS error when using a public https link. Maybe works once we publish/host on github
		// data = await d3.csv("https://github.com/mktle/zoning-dashboard/blob/main/data/rent_data/Rent_averages_BHA.csv", (d) => ({
			...d,
			Zip: +d.Zip,
			avg_per_bed: +d.avg_per_bed,
		}))
		console.log(rentData)
	})

	// Compute histogram
	function calculateHistogramData(data, binCount) {
        const bins = Array.from({ length: binCount }, () => 0);
        const binWidth = (maxRent - minRent) / binCount;
        data.forEach(d => {
            const binIndex = Math.min(Math.floor((d - minRent) / binWidth), binCount - 1);
            bins[binIndex]++;
        });
        return bins;
    }
	const binCount = 20; // Number of bins for the histogram
    const histogramData = calculateHistogramData(rentData, binCount);

	// Function to calculate x-position of histogram based on slider value
    function calculateHistogramPosition() {
        const totalWidth = 300; // Total width of histogram container (adjust as needed)
        const sliderWidth = 20; // Width of the slider container (adjust as needed)
        const sliderPosition = (value - minRent) / (maxRent - minRent);
        return (sliderPosition * (totalWidth - sliderWidth)) + sliderWidth / 2;
    }

</script>

<!-- <input type=range bind:value={value} min={minRent} max={maxRent}> -->
<!-- <span>{ value }</span> -->

<div class="slider-container">
	<input type=range bind:value={value} min={minRent} max={maxRent}>
	<span>{ value }</span>
</div>

<style>
	.slider-container {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 20%;
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	}
	input[type="range"]{
		width: 100%;
	}
	span {
		display: inline-block;
		padding: 0 .4em;
		border-radius: .3em;
		background: oklch(95% 2% 200);
	}
</style>