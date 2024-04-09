<h1>FP2 interactive map</h1>
<p> </p>

<svelte:head>
	<title>FP2</title>
	<meta name="description" content="FP2 interactive map" />
</svelte:head>

<script>
    import Slider from './rent_slider.svelte';
    let rentValue = 1500;
    let selectedRent = 3000;
    let maxRent = 3000;
    let minRent = 0;
    let rentFilter = -1;

    function handleRentEnter() {
        console.log(rentValue)
        // Store the current value of the rent slider
        selectedRent = rentValue;
        // Make rent slider disappear
        rentValue = null;
        console.log(selectedRent)
        hasEntered = true
    }


    import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
    import mapboxgl from 'mapbox-gl';
    // import { Map } from "mapbox-gl";
    import { onMount, afterUpdate } from "svelte";
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXB0eXNpbmdlciIsImEiOiJjbHVoanlneWIycm14MmxvZTh2Y3VhYXFkIn0.lkhHKBe-C2_I9v2J-jJ2hg';
    const accessToken = 'pk.eyJ1IjoiZXB0eXNpbmdlciIsImEiOiJjbHVoanlneWIycm14MmxvZTh2Y3VhYXFkIn0.lkhHKBe-C2_I9v2J-jJ2hg';
    let map;
    let mapContainer;
    let lng, lat, zoom;
    lng = -71.06;
    lat = 42.315;
    zoom = 11;
    // Define layerId as a reactive variable
    let fillLayerId;
    let lineLayerId;
    let hasEntered = false

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
        
        fillLayerId = 'boston_cambridge_rent';
        lineLayerId = 'ineligible_region';
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

        afterUpdate(() => {
            if (map && fillLayerId && hasEntered) {
                map.on('mouseenter', fillLayerId, (e) => {
                    map.getCanvas().style.cursor = 'pointer';
                    const neighborhood = e.features[0].properties.neighborhood;
                    const avgRent = e.features[0].properties.avg_per_bed;
                    // Show average rent per neighborhood
                    console.log(`Neighborhood: ${neighborhood}, Avg Rent: ${avgRent}`);
                });
                // Reset cursor when mouse leaves the layer
                map.on('mouseleave', fillLayerId, () => {
                    map.getCanvas().style.cursor = '';
                });
            }
        });

    });

    $: {
        if (map && fillLayerId) {
            map.setPaintProperty(fillLayerId, 'fill-color', [
                'case',
                ['>', ['get', 'avg_per_bed'], selectedRent],
                'red',
                'hsla(135, 100%, 45%, 0.38)'
            ]);
        }
    }

        // Show rent data when hovering over neighborhoods
    // map.on('mouseenter', fillLayerId, function (e) {
        // console.log("Hello")
        // map.getCanvas().style.cursor = 'pointer';

        // const features = map.queryRenderedFeatures(e.point, { layers: [fillLayerId] });
        // if (!features.length) {
        //     return;
        // }

        // const feature = features[0];
        // const popup = new mapboxgl.Popup()
        //     .setLngLat(e.lngLat)
        //     .setHTML(`<h3>${feature.properties}</h3><p>Avg. rent per bedroom: ${feature.properties.avg_per_bed}</p>`)
        //     .addTo(map);
    // });

    // map.on('mouseleave', fillLayerId, function () {
    //     map.getCanvas().style.cursor = '';
    // });

</script>

<div class="map-wrap">
    <div class="map" bind:this={mapContainer} />
</div>


<div class="slider-container">
    {#if rentValue !== null}
        <Slider bind:rentValue={rentValue} />
        <button on:click={handleRentEnter}>Enter</button>
    {/if}
</div>

<style>
    /* @import url("$lib/global.css"); */
    .map {
        position: absolute;
        width: 99%;
        height: 75%;
    }

    .slider-container {
        position: absolute;
        bottom: 20px;
        left: 65%;
        z-index: 1000;
    }
</style>
