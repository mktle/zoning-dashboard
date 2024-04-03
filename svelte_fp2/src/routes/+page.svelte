<h1>FP2 interactive map</h1>
<p> </p>

<svelte:head>
	<title>FP2</title>
	<meta name="description" content="FP2 interactive map" />
</svelte:head>

<script>
    import Slider from './rent_slider.svelte';
    let value = 1500;

    import 'mapbox-gl/dist/mapbox-gl.css';
    import mapboxgl from 'mapbox-gl';
    // import { Map } from "mapbox-gl";
    import { onMount, onDestroy } from "svelte";
    const accessToken = 'pk.eyJ1IjoiZXB0eXNpbmdlciIsImEiOiJjbHVoanlneWIycm14MmxvZTh2Y3VhYXFkIn0.lkhHKBe-C2_I9v2J-jJ2hg'; // Replace with your token

    let map;
    let mapContainer;
    let lng, lat, zoom;
    lng = -71.06;
    lat = 42.315;
    zoom = 11;

    onMount(() => {
        const initialState = { lng: lng, lat: lat, zoom: zoom };
        map = new mapboxgl.Map({
            container: mapContainer,
            accessToken: accessToken,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        });

        map.on('load', () => {
            map.addSource('demographics', {
                type: 'geojson',
                data: 'http://localhost:5173/src/routes/Boston_Neighborhoods.geojson'
            });
            map.addLayer(
                {
                    'id': 'demographics-fill',
                    'source':'demographics',
                    'type': 'fill',
                    'layout': {},
                    'paint': {
                        'fill-color': "hsla(135, 100%, 45%, 0.38)"
                    }
                }
            )
        });

    });

    // onDestroy(() => {
    //     map.remove();
    // });

</script>

<div class="map-wrap">
    <div class="map" bind:this={mapContainer} />
</div>

<style>
    .map {
        position: absolute;
        width: 100%;
        height: 75%;
    }
</style>

<Slider value={value}></Slider>

<!-- <script>
	export let value = 2000;
</script>
<input type=range bind:value={value}>
<span>{ value }</span>
<style>
	span {
		display: inline-block;
		padding: 0 .4em;
		border-radius: .3em;
		background: oklch(95% 2% 200);
	}
</style> -->

<!-- <script>
	import * as d3 from 'd3';
	import {onMount} from 'svelte';
	
	let data = [];
	onMount(async function() {
        data = await d3.csv('http://localhost:5173/src/routes/Rent_averages_BHA.csv', (d) => ({
		// data = await d3.csv('https://github.com/mktle/zoning-dashboard/blob/main/data/rent_data/Rent_averages_BHA.csv', (d) => ({
			...d,
			zip: +d.ZIP,
			avg_bed: +d.avg_per_bed,
			city: +d.City
		}));
		console.log(data);
	});

    let maxPrice = 3000;
    let minPrice = 0;
    let currentPrice = 1500;
    let rentalPrices = data.avg_per_bed;
    
    const updatePrice = (event) => {
        current_price = parseFloat(event.target.value);
    };
</script>
<div style="display: flex; align-items: center;">
    <input type="range" min={minPrice} max={maxPrice} value={currentPrice} on:input={updatePrice}/>
    <span style="margin-center: 10px;">${currentPrice}</span>
</div> -->
<!-- {#each rentalPrices as price}
  <div class="bar" style="width: 2px; height: {Math.min(price, currentPrice) * 10}px; background: blue;"></div>
{/each} -->
<!-- <style>
    .bar {
        float: left;
        margin: 0 1px;
    }
</style> -->

<!-- <script>
	import * as d3 from 'd3';
	import {onMount} from 'svelte';
	
	let data = [];
	onMount(async function() {
		data = await d3.csv('https://vega.github.io/vega-datasets/data/gapminder-health-income.csv', (d) => ({
			...d,
			income: +d.income,
			health: +d.health,
			population: +d.population
		}));
		console.log(data);
	});
	
	$: xScale = d3.scaleLinear()
		.domain([0, d3.max(data, (d) => d.health)])
		.range([0, 400]);
	
	$: colorScale = d3.scaleOrdinal()
		.domain(data.map(d => d.region))
		.range(d3.schemeTableau10)
</script>

{#each data as d}
	<div class="bar" style="width: {xScale(d.health)}px; background: {colorScale(d.region)}">
		{d.country}: {d.health}
	</div>
{/each}

<style>
	.bar {
		background: steelblue;
		padding: 3px;
		margin: 1px;
		text-align: right;
		color: white;
		width: 0px;
	}
</style> -->