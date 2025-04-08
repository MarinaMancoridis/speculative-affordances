<style>
    @import url("$lib/global.css");
</style>

<script>
    import mapboxgl from "mapbox-gl";
    import * as d3 from "d3";
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
    import { onMount } from "svelte";
    import localData from "./../data/mapping_inequality_redlining.json";

    mapboxgl.accessToken = "pk.eyJ1IjoibGVuYWFybXMiLCJhIjoiY205N3V0aGw2MGJnMDJsb2tiNDB1czFzaiJ9.bTzeSaHAUueU3tJHFNXyAA";
    
    let homes = [];
    let zillowData = [];
    let mergedData = [];
    let map = null;
    let mapViewChanged = 0;
    let hoveredIndex = -1;

    function getHomes (home) {
        let point = new mapboxgl.LngLat(+home.Longitude, +home.Latitude);
        let {x, y} = map.project(point);
        return {cx: x, cy: y};
    }

    $: map?.on("move", evt => mapViewChanged++);

    onMount(async () => {
        
        const jsonResponse = await fetch('/data/zillow_data.json');
        zillowData = await jsonResponse.json();

        homes = await d3.csv("/data/mass_records.csv", row => ({
            ...row,
            Latitude: Number(row.Latitude), 
            Longitude: Number(row.Longitude),
            Address: String(row.Address),
            Name: String(row.Name)
        }));

       homes = homes.map(item => {
            if (zillowData[item.Address]) {
                item.zestimate = zillowData[item.Address].zestimate;
                item.price = zillowData[item.Address].price;
            }
            return item;
        });

        map = new mapboxgl.Map({
            container: 'map', // HTML element ID
            style: 'mapbox://styles/mapbox/streets-v12',
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
            id: "grade_color_layer",
            type: "fill",
            source: "redlining_data",
            paint: {
                "fill-color": ["get", "fill"],
                "fill-opacity": 0.3,
                "fill-outline-color": "#ad494e"
            },
        });

        console.log(mergedData)

    });

</script>

<h1>Speculative Affordances: FP2</h1>
<p>Lena Armstrong, Marina Mancoridis, Eagon Meng, Jon Rosario</p>
<br>

<div id="map">
	<svg>
        {#key mapViewChanged}
            {#each homes as home}
                <circle { ...getHomes(home) } r="5" fill="steelblue">
                    <title>Address: {home.Address} Purchased by: {home.Name} Sold for: {home.price} Zestimate: {home.zestimate}</title>
                </circle> 
            {/each}
        {/key}
	</svg>
</div>
