<style>
    @import url("$lib/global.css");
</style>

<script>
    import mapboxgl from "mapbox-gl";
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
    import { onMount } from "svelte";

    mapboxgl.accessToken = "pk.eyJ1IjoibWFyaW5hLW1hbmNvcmlkaXMiLCJhIjoiY205NXBjZmx3MWNkZjJzcHc0dDVlYXFodCJ9.mS5MAGr-YmpGput97-3htA";

    onMount(() => {
		const map = new mapboxgl.Map({
			container: 'map', // HTML element ID
			style: 'mapbox://styles/marina-mancoridis/cm95pzaws009901qt26z24os9', // Marina's grey map style
			center: [-71.1056, 42.3736], // Cambridge/Boston (longitude, latitude)
			zoom: 12,
			minZoom: 10,
			maxZoom: 18
		});
	});

    await new Promise(resolve => map.on("load", resolve));
    map.addSource("boston_route", {
			type: "geojson",
			data: "https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D"
    });
    
</script>

<h1>Speculative Affordances: FP2</h1>
<p>Lena Armstrong, Marina Mancoridis, Eagon Meng, Jon Rosario</p>
