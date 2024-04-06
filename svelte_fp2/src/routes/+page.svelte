@import url("$lib/global.css")

<h1>FP2 interactive map</h1>
<p> </p>

<svelte:head>
	<title>FP2</title>
	<meta name="description" content="FP2 interactive map" />
</svelte:head>

<script>
    import Slider from './rent_slider.svelte';
    let value = 1500;

    import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
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
                // data: 'http://localhost:5173/src/routes/Boston_Neighborhoods.geojson'
                // data: 'https://github.com/mktle/zoning-dashboard/blob/main/svelte_fp2/src/routes/Boston_Neighborhoods.geojson'
                data: 'https://raw.githubusercontent.com/mktle/zoning-dashboard/main/svelte_fp2/src/routes/Boston_Neighborhoods.geojson'
                // data: 'https://raw.githubusercontent.com/mktle/zoning-dashboard/main/svelte_fp2/data/geographic/mapc_municipalities.geojson'
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

    function handleRentEnter() {
        // Store the current value of the rent slider
        const rentValue = value;
        // Make rent slider disappear
        value = null;
    }

    // onDestroy(() => {
    //     map.remove();
    // });

</script>

<div class="map-wrap">
    <div class="map" bind:this={mapContainer} />
</div>

<div class="slider-container">
    {#if value !== null}
        <Slider value={value} />
        <button on:click={handleRentEnter}>Enter</button>
    {/if}
</div>

<style>
    .map {
        position: absolute;
        width: 100%;
        height: 75%;
    }

    .slider-container {
        position: absolute;
        bottom: 20px;
        left: 65%;
        z-index: 1000;
    }
</style>

<!-- <Slider value={value}> </Slider> -->
