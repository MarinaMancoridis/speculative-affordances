<style>
    @import url("$lib/global.css");
</style>

<script>
    import mapboxgl from "mapbox-gl";
    import * as d3 from "d3";
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
    import { onMount } from "svelte";
    import localData from "./../data/mapping_inequality_redlining.json";
    import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";

    mapboxgl.accessToken = "pk.eyJ1IjoibWFyaW5hLW1hbmNvcmlkaXMiLCJhIjoiY205NXBjZmx3MWNkZjJzcHc0dDVlYXFodCJ9.mS5MAGr-YmpGput97-3htA";
    
    let homes = [];
    let zillowData = [];
    let mergedData = [];
    let map = null;
    let mapViewChanged = 0;
    let timeScale = [0, 0];
    let valueScale = [0, 0];
    let timeIndex = 0;

    function getHomes (home) {
        let point = new mapboxgl.LngLat(+home.Longitude, +home.Latitude);
        let {x, y} = map.project(point);
        return {cx: x, cy: y};
    };

    // Sort times and values for faster filtering
    function parseZestimateHistory (data) {
        const points = data?.zillowData?.data?.property?.homeValueChartData[0]?.points || [];
        const times = d3.sort(points.map(({x, y}) => x));
        const values = d3.sort(points.map(({x, y}) => y));
        return [times, values];
    };

    // Cache the lookup for each year
    function calculateZestimateSince (times, values, scale) {
        let lookup = new Map();
        for (let i = scale[0]; i <= scale[1]; i++) {
            const yearStart = new Date(i, 0, 1).getTime();
            let value = valueScale[0];
            if (times) {
                for (let j = 0; j < times.length; j++) {
                    if (times[j] >= yearStart) {
                        value = values[j];
                        break;
                    }
                }
            }
            lookup.set(i, value);
        }
        return lookup;
    };

    // We can also cache this if there are performance issues
    function calculateAddressColor(home) {
        let color = "white";
        localData.features.some(f => {
            if (booleanPointInPolygon([home.Longitude, home.Latitude], f)) {
                color = f.properties?.fill || "white";
                return true;
            }
            return false;
        });
        return color;
    }

    // Establish scale across full history
    function zestimateHistoryScale ([times, values]) {
        const time_range = [new Date(d3.min(times)).getFullYear(), new Date(d3.max(times)).getFullYear()];
        const value_range = [d3.min(values), d3.max(values)];
        return [time_range, value_range];
    };

    $: map?.on("move", evt => mapViewChanged++);

    $: radiusScale = d3.scaleSqrt()
            .domain(valueScale)
            .range([0, 25]);

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

        let all_times = [];
        let all_values = [];

        homes = homes.map(item => {
            if (zillowData[item.Address]) {
                item.zestimate = zillowData[item.Address].zestimate;
                item.price = zillowData[item.Address].price;

                // color fill
                item.color = calculateAddressColor(item);

                // zestimate history API structure
                const [times, values] = parseZestimateHistory(zillowData[item.Address]);
                item.ztimes = times;
                item.zvalues = values;
                all_times = all_times.concat(times);
                all_values = all_values.concat(values);
            }
            return item;
        });

        // Calculate max range scales
        [timeScale, valueScale] = zestimateHistoryScale([all_times, all_values]);
        timeIndex = timeScale[1]; // Initialize to latest

        // One more pass to calculate time cutoffs
        homes = homes.map(item => {
            item.time_lookup = calculateZestimateSince(item.ztimes, item.zvalues, timeScale)
            return item;
        })

        map = new mapboxgl.Map({
            container: 'map', // HTML element ID
            style: 'mapbox://styles/marina-mancoridis/cm95pzaws009901qt26z24os9',
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

        // console.log(mergedData)

    });

</script>

<h1>Speculative Affordances: FP2</h1>
<p>Lena Armstrong, Marina Mancoridis, Eagon Meng, Jon Rosario</p>
<header>
    <h1>🚲 BikeWatch</h1>
    <label style="margin-left:auto">
        Zestimate since:
        <input style="width: 20vw" type="range" min="{timeScale[0]}" max="{timeScale[1]}" bind:value={timeIndex} />
        <time style="display: block; text-align: right">
            {timeIndex}
        </time>
    </label>
</header>
<br>

<div id="map">
	<svg>
        {#key mapViewChanged}
            {#each homes as home}
                <circle { ...getHomes(home) } r="{radiusScale(home.time_lookup.get(timeIndex))}" fill="{home.color}" fill-opacity="60%" stroke="black" stroke-opacity="60%">
                    <title>Address: {home.Address} Purchased by: {home.Name} Sold for: {home.price} Zestimate: {home.zestimate}</title>
                </circle> 
            {/each}
        {/key}
	</svg>
</div>
