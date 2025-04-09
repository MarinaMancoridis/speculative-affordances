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
    import { base } from '$app/paths';

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
        
        const jsonResponse = await fetch(`${base}/data/zillow_data.json`)
        zillowData = await jsonResponse.json();

        homes = await d3.csv(`${base}/data/mass_records.csv`, row => ({
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

<p><b>Speculative Affordances, FP2:</b> <i>Lena Armstrong, Marina Mancoridis, Eagon Meng, Jon Rosario</i></p>
<h1> 🏠 Contextualizing iBuying Practices in Historically Redlined Districts</h1>
<div style="display: flex; gap: 2em; align-items: flex-start; flex-wrap: wrap;">
<p style="flex: 1; min-width: 250px; font-size: 1.10em;">
  In this illustration, we contextualize <b>iBuying practices</b> within historically redlined districts. <b>iBuying</b>, or "instant buying," refers to companies using algorithms to quickly purchase and resell homes, often with minimal human involvement. <b>Zestimate</b> is Zillow’s proprietary estimate of a home’s market value, based on public data and machine learning. Each circle represents a home — <i>hover over any point</i> to see information about the home, selling price, and Zestimate value. <i>Scroll on the map</i> to explore different parts of the Greater Boston Area. <i>Use the slider</i> to see how Zestimate values change by year. 
  Notice that homes in <span style="color: hotpink;">hazardous</span> and <span style="color: goldenrod;">definitely declining</span> areas tend to have lower Zestimates and slightly more volatility, 
  providing weak evidence that the economics effects of historical redlining may be long-lasting.
</p>

  <div style="border: 1px solid #ccc; border-radius: 8px; padding: 1em; font-size: 0.95em; max-width: 300px; flex-shrink: 0;">
    <strong>Legend: HOLC District Categories</strong>
    <ul style="list-style: none; padding: 0; margin-top: 0.5em;">
      <li><span style="display: inline-block; width: 12px; height: 12px; background-color: green; border-radius: 50%; margin-right: 8px;"></span> Best</li>
      <li><span style="display: inline-block; width: 12px; height: 12px; background-color: #74c3e3; border-radius: 50%; margin-right: 8px;"></span> Still Desirable</li>
      <li><span style="display: inline-block; width: 12px; height: 12px; background-color: #f5dd42; border-radius: 50%; margin-right: 8px;"></span> Definitely Declining</li>
      <li><span style="display: inline-block; width: 12px; height: 12px; background-color: hotpink; border-radius: 50%; margin-right: 8px;"></span> Hazardous</li>
      <li><span style="display: inline-block; width: 12px; height: 12px; background-color: #4f5152; border-radius: 50%; margin-right: 8px;"></span> Industrial/Non-Residential</li>
    </ul>
  </div>
</div>

<label style="margin-left: auto; color: #333; font-weight: 500;">
  Zestimate since:
  <input 
    type="range" 
    min="{timeScale[0]}" 
    max="{timeScale[1]}" 
    bind:value={timeIndex} 
    style="width: 20vw; accent-color: #4a90e2; margin-top: 0.25em;"
  />
  <time style="display: block; text-align: right; font-size: 0.9em; color: #555; margin-top: 0.25em;">
    {timeIndex}
  </time>
</label>


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
