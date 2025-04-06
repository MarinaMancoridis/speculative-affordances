<style>
    @import url("$lib/global.css");
</style>

<script>
    import mapboxgl from "mapbox-gl";
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
    import { onMount } from "svelte";
    import localData from "./../data/mapping_inequality_redlining.json";

    mapboxgl.accessToken = "pk.eyJ1IjoibWFyaW5hLW1hbmNvcmlkaXMiLCJhIjoiY205NXBjZmx3MWNkZjJzcHc0dDVlYXFodCJ9.mS5MAGr-YmpGput97-3htA";

    onMount(async () => {
        const map = new mapboxgl.Map({
            container: 'map', // HTML element ID
            style: 'mapbox://styles/marina-mancoridis/cm95pzaws009901qt26z24os9', // Marina's grey map style
            center: [-71.1056, 42.3736], // Cambridge/Boston (longitude, latitude)
            zoom: 11.5,
            minZoom: 10,
            maxZoom: 18
        });

        await new Promise(resolve => map.on("load", resolve));
        
        map.addSource("redlining_data", {
            type: "geojson",
            data: localData
        });

        map.addLayer({
            id: "redlining_layer",
            type: "line",
            source: "redlining_data",
            paint: {
                "line-color": "#ad494e",
                "line-opacity": 0.5,
                "line-width": 2
            },
        });
    });
    
    
</script>

<h1>Speculative Affordances: FP2</h1>
<p>Lena Armstrong, Marina Mancoridis, Eagon Meng, Jon Rosario</p>
<br>
