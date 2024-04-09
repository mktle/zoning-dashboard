<h1>FP2 interactive map</h1>
<p> </p>

<svelte:head>
	<title>FP2</title>
	<meta name="description" content="FP2 interactive map" />
</svelte:head>

<script>
    // import Slider from './rent_slider.svelte';
    // let value = 1500;

    import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
    import mapboxgl from 'mapbox-gl';
    // import { Map } from "mapbox-gl";
    import { onMount } from "svelte";
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXB0eXNpbmdlciIsImEiOiJjbHVoanlneWIycm14MmxvZTh2Y3VhYXFkIn0.lkhHKBe-C2_I9v2J-jJ2hg';
    const accessToken = 'pk.eyJ1IjoiZXB0eXNpbmdlciIsImEiOiJjbHVoanlneWIycm14MmxvZTh2Y3VhYXFkIn0.lkhHKBe-C2_I9v2J-jJ2hg';
    let map;
    let mapContainer;
    let lng, lat, zoom;
    lng = -71.06;
    lat = 42.315;
    zoom = 11;

    onMount(async () => {
        const initialState = { lng: lng, lat: lat, zoom: zoom };
        map = new mapboxgl.Map({
            container: mapContainer,
            accessToken: accessToken,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        });
        await new Promise(resolve => map.on("load", resolve));

        map.addSource("Boston_Cambridge_Rent", {
            type: 'geojson',
            data: 'https://raw.githubusercontent.com/mktle/zoning-dashboard/main/svelte_fp2/data/geographic/Boston_Cambridge_rent.geojson'
        });
        
        map.addLayer({
            'id': 'boston_cambridge_rent',
            'source': 'Boston_Cambridge_Rent',
            'type': 'fill',
            'paint': {
                'fill-color': "hsla(135, 100%, 45%, 0.38)"
            },
            'layout': {},
        });
        map.addLayer({
            'id': 'boston_cambridge_rent_outline',
            'source': 'Boston_Cambridge_Rent',
            'type': 'line',
            'paint': {
                'line-color': "hsla(0, 100%, 0%, 0.5)"
            },
            'layout': {},
        });
    });

    function handleRentEnter() {
        // Store the current value of the rent slider
        const selectedRent = rentValue;
        // Make rent slider disappear
        rentValue = null;
        console.log(selectedRent)
    }

    let rentValue = 1500;
    let maxRent = 3000;
    let minRent = 0;
    let selectedRent = null
    let rentFilter = -1;

</script>

<div class="map-wrap">
    <div class="map" bind:this={mapContainer} />
</div>


<!-- <div class="slider-container">
    {#if value !== null}
        <Slider value={value} />
        <button on:click={handleRentEnter}>Enter</button>
    {/if}
</div> -->

<div class="slider-container">
	<label for="rent-slider">Maximum spending on rent: </label>
	<input type=range bind:value={rentValue} min={minRent} max={maxRent} name='rent-slider'>
	<span>{ rentValue }</span>
    {#if rentValue !== null}
        <rentValue={rentValue}/>
        <button on:click={handleRentEnter}>Enter</button>
    {/if}
	<!-- <label> "How much can you spend on rent?" </label>  -->
</div>


<style>
    /* @import url("$lib/global.css"); */
    .map {
        position: absolute;
        width: 99%;
        height: 75%;
    }

    /* .slider-container {
        position: absolute;
        bottom: 20px;
        left: 65%;
        z-index: 1000;
    } */
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