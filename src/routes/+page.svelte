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
			style: 'mapbox://styles/mapbox/streets-v12', // map style
			center: [-71.1056, 42.3736], // Cambridge/Boston (longitude, latitude)
			zoom: 12,
			minZoom: 10,
			maxZoom: 18
		});
	});
</script>

<h1>Speculative Affordances: FP2</h1>
<p>Lena Armstrong, Marina Mancoridis, Eagon Meng, Jon Rosario</p>
