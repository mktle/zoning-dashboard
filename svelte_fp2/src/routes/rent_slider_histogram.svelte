<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	// import { scaleLinear, max } from 'd3';

	// Parameters for the slider
	export let value = 150;
    export let maxRent = 3000;
    export let minRent = 0;

	// Compute histogram
	function calculateHistogramData(data, binCount) {
        const bins = Array.from({ length: binCount }, () => 0);
        const binWidth = (maxRent - minRent) / binCount;
        data.forEach(d => {
            const binIndex = Math.min(Math.floor((d - minRent) / binWidth), binCount - 1);
			console.log("Here")
            bins[binIndex]++;
        });
        return bins;
    }

	let rentData = []
	let avgPerBed = []
	onMount(async function() {
		rentData = await d3.csv("http://localhost:5173/src/routes/Rent_averages_BHA.csv", (d) => ({
		// CORS error when using a public https link. Maybe works once we publish/host on github
		// data = await d3.csv("https://github.com/mktle/zoning-dashboard/blob/main/data/rent_data/Rent_averages_BHA.csv", (d) => ({
			...d,
			Zip: +d.Zip,
			avg_per_bed: +d.avg_per_bed,
		}))
		console.log(rentData)
		avgPerBed = rentData.map(d => d.avg_per_bed);
		// console.log(avgPerBed)
		const binCount = 20; // Number of bins for the histogram
		const histogramData = calculateHistogramData(avgPerBed, binCount);
		console.log("asdfad")
		console.log(histogramData)
		console.log("asdfasdf")

	})

	const binCount = 20; // Number of bins for the histogram
	// console.log(avgPerBed)
    const histogramData = calculateHistogramData(avgPerBed, binCount);
	// console.log(histogramData)

	// Function to calculate x-position of histogram based on slider value
    function calculateHistogramPosition() {
        const totalWidth = 300; // Total width of histogram container (adjust as needed)
        const sliderWidth = 20; // Width of the slider container (adjust as needed)
        const sliderPosition = (value - minRent) / (maxRent - minRent);
        return (sliderPosition * (totalWidth - sliderWidth)) + sliderWidth / 2;
    }

</script>

<div class="container">
	<!-- Histogram container -->
	<div class="histogram-container">
		<svg width="30%" height="10%">
			{#each histogramData as count, i}
				<rect x={i * 30} y={200 - count} width="20" height={count} fill="steelblue" />
			{/each}
		</svg>
	</div>
	<!-- Slider container -->
	<div class="slider-container">
		<input type=range bind:value={value} min={minRent} max={maxRent}>
		<span>{ value }</span>
	</div>
</div>

<style>
	.container {
        position: fixed;
		bottom: 0;
		left: 50%;
    }
	.container {
        position: fixed;
		bottom: 0;
		left: 50%;
    }
</style>