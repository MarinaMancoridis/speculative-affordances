<style>
    @import url("$lib/global.css");
    :global(.scrolly) {
        display: block !important;
        --scrolly-gap: 2em;
    }

    /* page and text background */
    :global(body) {
        background: #fff7f7;
        color: #000;
        /* margin: 0em; */
        /* add horizontal padding so there's space on both sides */
        padding: 0em 2em;
        font-family: 'Roboto', sans-serif;
        align-items: center;
        overflow-x: hidden;
        overscroll-behavior-y: none;
    }

    /* each step just lives in the normal document flow */
    :global(.scrolly-step) {
        margin-bottom: var(--scrolly-gap);
    }

    :global(.scrolly-step .step-text) {
        font-size: 1.2em;
        line-height: 2;
        /* width: 33.333%; */
        margin: 0 auto;
        background: #f7fffe;
        padding: 2em;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(201, 73, 179, 0.1);
        color: #000;
        
        /* disable flex inherited from parent */
        flex: none;
        min-width: auto;
        display: block;
    }

    /* scrolly paragraphs */
    :global(.scrolly-step p) {
        /* confine to middle third */
        /* width: 33.333%; */
        margin: 0 auto;
        
        /* blue-white background just behind the text */
        background: #fff7f7;
        padding: 0em;
        box-sizing: border-box;
        
        /* optional rounded corners and shadow */
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        
        /* ensure text is dark */
        color: #000;
    }

    /* center & constrain your main content */
    .content-section {
        min-height: 100vh;
        margin: 0 auto;
        /* max-width prevents over‑stretching on very large screens */
        max-width: 1200px;
        /* optional extra inner padding */
        padding: 1em 1em;
    }

    /* keep your existing scrolly gap */
    :global(.scrolly) {
        --scrolly-gap: 0em;
    }

    .grid-bg {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows:    repeat(10, 1fr);
        gap: 0;
        pointer-events: none;
        z-index: 0;
    }

    .grid-cell {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        transition: background-image 0.1s ease-in;  /* quick cascade */
    }

    /* 3) Everything else floats above at z‑index 1+ */
    .content, .title-section {
        position: relative;
        z-index: 1;
    }

    /* 4) Your full‑screen title */
    .title-section {
        /* 1) Make it full viewport width */
        position: relative;
        width: 100vw;
        /* 3) Keep your full‑height + pink BG */
        height: 100vh;
        background: #2d2d2d;

        /* 4) Center your text */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ffffff; 
    }

    .scroll-indicator {
        border: none;
        outline: none;

        /* allow clicks now */
        pointer-events: auto;
        cursor: pointer;

        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);

        display: inline-flex;
        flex-direction: column;
        align-items: center;
        color: #4f384c;

        background: white;
        padding: 1.2em 1.6em;
        border-radius: 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);

        font-size: 1rem;
        z-index: 2;
    }

    /* remove the second pointer‑events: none you had here */

    .scroll-indicator span,
    .scroll-indicator .arrow {
        display: inline-block;
        animation: bounce 2s infinite;
    }

    .scroll-indicator .arrow {
        font-size: 1.5rem;
        margin-top: 0.2em;
        animation-delay: 0.1s;
    }

    /* keyframes for that gentle bounce */
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }


    /* push the viz well below the last step */
    :global(.scrolly-viz) {
        display: block;
        margin-top: 3em;
    }

    :global(.text-side) {
        font-size: 1.2em;
    }

    /* increase the horizontal space between text‑side and legend‑side */
    :global(.scrolly-step:last-child) {
        margin-bottom: 10em;
    }

    :global(.todo-box) {
        background: #582546;          /* black background */
        color: #fff;               /* white text */
        width: 60%;                /* 60% of its container */
        margin: 2em auto;          /* vertical spacing + center horizontally */
        padding: 1.5em;            /* inner breathing room */
        box-sizing: border-box;
        border-radius: 6px;        /* optional rounded corners */
        font-size: 1.2em;          /* match your other text size */
        line-height: 1.5;
        margin-bottom: 10em;
        margin-top: 10em;
    }

    :global(.todo-box strong) {
        display: block;            /* TODO: on its own line */
        margin-bottom: 0.5em;
    }

    .grid-container {
        position: relative;
    }

    /* 5×5 grid full‑screen, faded behind */
    .house-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        pointer-events: none;    /* so the grid doesn't block scrolling or clicks */
        opacity: 0.5;           /* adjust overall fade */
        z-index: 0;              /* behind all your steps */
    }

    .house-cell {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;          /* emoji size */
    }

    /* make sure your scrolly content and todo-box sit above the grid */
    .grid-container :global(.scrolly-step),
    .grid-container :global(.todo-box) {
        position: relative;
        z-index: 1;
        /* background should be opaque (e.g. #fff7f7 or #582546) so text is legible */
    }

    :global(.scrolly-step.spacer) {
        /* height = enough scroll to go from 0→25 houses; you can tweak */
        height: 250vh;
    }

    /* ensure container is the stacking context */
    .grid-container { position: relative; }

    /* overlay only the first three real steps */
    :global(.scrolly-step.overlay-step) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        width: 60%;              /* or whatever width you like */
        margin: 0;               /* remove default margins */
        background: #fff7f7;     /* match your step-text bg */
        padding: 2em;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .house-grid.hidden {
        opacity: 0;
        transition: opacity 0.5s ease-out;
        pointer-events: none;
    }

    .grid-section {
        height: 100vh;
        background: white;
        display: grid;
        grid-template-columns: repeat(100, 1fr);
        grid-template-rows:    repeat(100, 1fr);
        /* remove any gap so it's a solid block of emojis */
        gap: 0;
    }

    /* each cell centers its emoji */
    .grid-cell {
        display: flex;
        justify-content: center;
        align-items: center;
        /* scale the emoji so it's legible but not too huge—adjust as you like */
        font-size: 0.8vw;
        line-height: 1;
    }
    .after-todo {
        position: relative;
        z-index: 1;              /* above the fixed grid-bg */
        
        /* full‑width break‑out */
        width: 100vw;
        left: 50%;
        margin-left: -50vw;
        
        /* include padding in that 100vw & 100vh */
        box-sizing: border-box;
        
        /* white background */
        background: white;
        
        /* always at least fill the viewport */
        min-height: 100vh;
        
        /* vertical breathing room */
        padding: 4em 2em;
    }

</style>

<script>
    import mapboxgl from "mapbox-gl";
    import * as d3 from "d3";
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
    import { onMount } from "svelte";
    import localData from "./../data/mapping_inequality_redlining.json";
    import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
    import { base } from '$app/paths';
    import Scrolly from "svelte-scrolly";

    // scroll states
    let scrollProgress = 0;
    const numSteps = 6;
    const rows = 10;
    const cols = 10;
    const totalCells = rows * cols;

    // 1) Import all 25 originals and 25 modifieds
    import house1   from "./../data/house1.png";
    import house2   from "./../data/house2.png";
    import house3   from "./../data/house3.png";
    import house4   from "./../data/house4.png";
    import house5   from "./../data/house5.png";
    import house6   from "./../data/house6.png";
    import house7   from "./../data/house7.png";
    import house8   from "./../data/house8.png";
    import house9   from "./../data/house9.png";
    import house10  from "./../data/house10.png";
    import house11  from "./../data/house11.png";
    import house12  from "./../data/house12.png";
    import house13  from "./../data/house13.png";
    import house14  from "./../data/house14.png";
    import house15  from "./../data/house15.png";
    import house16  from "./../data/house16.png";
    import house17  from "./../data/house17.png";
    import house18  from "./../data/house18.png";
    import house19  from "./../data/house19.png";
    import house20  from "./../data/house20.png";
    import house21  from "./../data/house21.png";
    import house22  from "./../data/house22.png";
    import house23  from "./../data/house23.png";
    import house24  from "./../data/house24.png";
    import house25  from "./../data/house25.png";

    import house1mod  from "./../data/house1-modified.png";
    import house2mod  from "./../data/house2-modified.png";
    import house3mod  from "./../data/house3-modified.png";
    import house4mod  from "./../data/house4-modified.png";
    import house5mod  from "./../data/house5-modified.png";
    import house6mod  from "./../data/house6-modified.png";
    import house7mod  from "./../data/house7-modified.png";
    import house8mod  from "./../data/house8-modified.png";
    import house9mod  from "./../data/house9-modified.png";
    import house10mod from "./../data/house10-modified.png";
    import house11mod from "./../data/house11-modified.png";
    import house12mod from "./../data/house12-modified.png";
    import house13mod from "./../data/house13-modified.png";
    import house14mod from "./../data/house14-modified.png";
    import house15mod from "./../data/house15-modified.png";
    import house16mod from "./../data/house16-modified.png";
    import house17mod from "./../data/house17-modified.png";
    import house18mod from "./../data/house18-modified.png";
    import house19mod from "./../data/house19-modified.png";
    import house20mod from "./../data/house20-modified.png";
    import house21mod from "./../data/house21-modified.png";
    import house22mod from "./../data/house22-modified.png";
    import house23mod from "./../data/house23-modified.png";
    import house24mod from "./../data/house24-modified.png";
    import house25mod from "./../data/house25-modified.png";

    // 2) Pack them into arrays
    const baseOriginals = [
        house1, house2, house3, house4, house5,
        house6, house7, house8, house9, house10,
        house11, house12, house13, house14, house15,
        house16, house17, house18, house19, house20,
        house21, house22, house23, house24, house25
    ];
    const baseModifieds = [
        house1mod, house2mod, house3mod, house4mod, house5mod,
        house6mod, house7mod, house8mod, house9mod, house10mod,
        house11mod, house12mod, house13mod, house14mod, house15mod,
        house16mod, house17mod, house18mod, house19mod, house20mod,
        house21mod, house22mod, house23mod, house24mod, house25mod
    ];
    const originalImgs = [
        ...baseOriginals,
        ...baseOriginals,
        ...baseOriginals,
        ...baseOriginals
    ];
    const modifiedImgs = [
        ...baseModifieds,
        ...baseModifieds,
        ...baseModifieds,
        ...baseModifieds
    ];

    // start at 33% down, finish at 100%
    const startScroll = 0.2;
    const endScroll   = 0.5;

    // pageProgress: 0 at top, 1 at bottom
    let pageProgress = 0;

    // compute how many images to replace
    $: replaceCount =
        pageProgress <= startScroll ? 0
    : pageProgress >= endScroll   ? totalCells
    : Math.floor(
        (pageProgress - startScroll)
        / (endScroll - startScroll)
        * totalCells
        );
    
    // update pageProgress whenever you scroll
    function updateProgress() {
        const scrollTop = window.scrollY;
        // total scrollable height = doc height minus viewport
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        pageProgress = Math.min(scrollTop / docHeight, 1);
    }

    // map and data states
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

    function scrollToExplore() {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }

    // Sort times and values for faster filtering
    function parseZestimateHistory (data) {
        const points = data?.zillowData?.data?.property?.homeValueChartData[0]?.points || [];
        const times = d3.sort(points.map(({x, y}) => x));
        const values = d3.sort(points.map(({x, y}) => y));
        return [times, values];
    };

    // Gets the most recent "sold" event, if it exists
    function getLastSoldEvent (home) {
        const priceHistory = home["priceHistory"];
        if (priceHistory) {
            for (const historicalEvent of priceHistory) {
                if (historicalEvent["event"] === "Sold") {
                    return historicalEvent;
                }
            }
        }
        return undefined;
    }

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
        updateProgress();                        // init
        window.addEventListener('scroll', updateProgress);

        // Get Zillow Data
        const jsonResponse = await fetch(`${base}/data/zillow_data.json`)
        zillowData = await jsonResponse.json();

        // Get Mass Records Data
        homes = await d3.csv(`${base}/data/mass_records.csv`, row => ({
            ...row,
            Latitude: Number(row.Latitude), 
            Longitude: Number(row.Longitude),
            Address: String(row.Address),
            Name: String(row.Name)
        }));

        let all_times = [];
        let all_values = [];

        // Combine Mass Records & Zillow Data
        homes = homes.map(item => {
            if (zillowData[item.Address]) {
                item.zestimate = zillowData[item.Address].zestimate;
                const recentSoldEvent = getLastSoldEvent(zillowData[item.Address]);
                if (recentSoldEvent) {
                    item.price = recentSoldEvent["price"];
                    item.dateLastSold = recentSoldEvent["date"];
                } else {
                    item.price = undefined;
                    item.dateLastSold = undefined;
                }
                
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

        // map.addLayer({
            // id: "grade_color_layer",
            // type: "fill",
            // source: "redlining_data",
            // paint: {
                // "fill-color": ["get", "fill"],
                // "fill-opacity": 0.5,
                // "fill-outline-color": "#ad494e"
            // },
        // });

        mapFairPrices = new mapboxgl.Map({
            container: 'map', // HTML element ID
            style: 'mapbox://styles/marina-mancoridis/cm95pzaws009901qt26z24os9',
            center: [-71.1056, 42.3736], // Cambridge/Boston (longitude, latitude)
            zoom: 11.5,
            minZoom: 10,
            maxZoom: 18
        });

    });

</script>

<div class="grid-bg">
    {#each Array(totalCells) as _, i}
      <div
        class="grid-cell"
        style="background-image:
          url({ i < replaceCount ? modifiedImgs[i] : originalImgs[i] });"
      ></div>
    {/each}
</div>

<div class="title-section">
    <h1 id="title">AUTOMATION AND SPECULATION</h1>
    <p><b>Speculative Affordances, FP3:</b> <i>Lena Armstrong, Marina Mancoridis, Eagon Meng, Jon Rosario</i></p>

    <button class="scroll-indicator" on:click={scrollToExplore} type="button">
        <span>Explore</span>
        <div class="arrow">↓</div>
    </button>
</div>

<div class="content-section">
    <div class="grid-container">
    <Scrolly bind:progress={scrollProgress} threshold={0.5} debounce>
         <!-- ■■■ Spacer to drive the grid animation ■■■ -->
        <div class="scrolly-step spacer"></div>

        <!-- ■■■ REAL STEP 1 (will only show after spacer scroll) ■■■ -->
        <div class="scrolly-step overlay-step">
            <p class="step-text">
           <b>TO DO: </b> Intro
            </p>
        </div>

        <!-- ■■■ REAL STEP 2 ■■■ -->
        <div class="scrolly-step overlay-step">
            <p class="step-text">
            <b>TO DO: iBuying Definition</b> iBuying, or "instant buying," refers to companies using algorithms to quickly purchase …
            </p>
        </div>

        <div class="scrolly-step overlay-step">
            <p class="step-text">
            <b>TO DO: iBuyers</b> Zillow, Opendoor, Redfin, and Offerpad purchased 1% of all U.S. Homes in 2021
            </p>
        </div>

        <div class="scrolly-step overlay-step">
            <p class="step-text">
            <b>TO DO:</b> In 2022, FTC charged Opendoor with lying to people that they were getting market value for their homes
            </p>
        </div>

        <div class="scrolly-step overlay-step">
            <p class="step-text">
            <b>TO DO:</b> Opendoor agreed to pay $62 million 
            </p>
        </div>

        <div class="scrolly-step overlay-step">
            <p class="step-text">
            <b>TO DO:</b> Since then, Opendoor has continued to expand to over 50+ markets, including Boston
            </p>
        </div>

        <!-- VIZ only shows once you've scrolled through all previous steps -->
        <svelte:fragment slot="viz">

            <div class="after-todo">    

            <h1>What percent of homes in Boston are iBought?*</h1>
            <p> TO DO: add interactive question</p>
            <p> TO DO: *Note: we searched for iBought homes using (cite sources), but there may be every more iBought homes that we were not able to find</p>
            <p> TO DO: add visualization for iBuying over time with number of homes (y-axis) and year (x-axis) with annotations of Zillow, Opendoor, Redfin, and Offerpad events</p>
            
            <br><br>
            <h1>Which of these homes is iBought?</h1>
            <p>To Do: Add clickable images and question answer</p>
            
            <br><br>
            <h1>Anatomy of an Average iBought Home</h1>
             <p>GOAL: add clickable home to learn facts</p>
            <p>To Do: Add average price</p>
            <p>To Do: Add average number of bedrooms</p>
            <p>To Do: Add average number of bathrooms</p>
            <p>To Do: Add average number of square feet</p>
            <p>To Do: Add average year built</p>
            <p>To Do: Add aditional features that are more unique to iBought homes</p>
            <p>To Do: Add takeaway -> Affordable housing is targeted!</p>
            <p>To Do: Add info about how iBought homes are typically sold to investors not occupant-owners</p>
            <br><br>

            <h1 id="redlining">🏠 iBought Homes Contexutalized with Historically Redlined Districts 🏠</h1>    
            
            <!-- wrapper that holds text on the left and legend on the right -->
            <div class="legend-text-wrapper" style="
                    display: flex;
                    gap: 2em;
                    align-items: flex-start;
                    margin-bottom: 2em;
                    font-size: 1.2em;
                ">

                <!-- left: all your step-4 & last-step text + slider -->
                <div>
                    <p>TO DO: add slider instead to show where iBought homes are then add redlining map on top as part of slider (see https://rachelblowes.github.io/FP2-Interactive-Map/)</p>
                    <p>TO DO: eventual goal to add drop down with gentrification measures (i.e., number of Airbnbs, Landis, Freeman) and corporate ownership by <b>census tract</b> to toggle between</p>
                    <p>TO DO: separate Zestimates into another visualization that is a bar chart changing by time (reuse Zestimate slider) with y-axis (average Zestimate) and x-axis (types of redlined zones)</p>
                    <p>TO DO: takeaway is that there are historical implications of redlining that still infuence housing pricing and Zestimates</p>
                </div>

                <div class="legend-text-wrapper">
                <p><i><b>Hover over any point</b></i> to see information about the home, selling price, and Zestimate value.</p>
                <p><i><b>Scroll on the map</b></i> to explore different parts of the Greater Boston Area.</p>
                <p><i><b>Use the slider</b></i> to see how Zestimate values change by year.</p>
                
                <p>
                    Notice that homes in
                    <b><span style="color:#d9838d;">hazardous</span></b> and
                    <b><span style="color:goldenrod;">definitely declining</span></b>
                    areas tend to have lower Zestimates and more volatility, suggesting the
                    long‑lasting effects of historical redlining.
                </p>

                <br><br>
                <label style="display: block; margin-top: 1em; color: #333; font-weight: 500;">
                    <b>Zestimate Year:</b>
                    <input 
                    type="range" 
                    min="{timeScale[0]}" 
                    max="{timeScale[1]}" 
                    bind:value={timeIndex} 
                    style="width: 100%; accent-color: #644E8F; margin-top: 0.25em;"
                    />
                    <time style="display: block; text-align: right; font-size: 0.9em; color: #555; margin-top: 0.25em;">
                    {timeIndex}
                    </time>
                </label>
                </div>

                <!-- right: the legend box -->
                <div class="legend-side" style="flex: 0 0 300px;">
                    <div style="
                        background: #faf7fa;
                        color: #000;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        padding: 1em;
                        font-size: 0.95em;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    ">
                        <b>Historic Redlining Map<br/>HOLC District Categories</b>
                        <ul style="list-style: none; padding: 0; margin: 0.5em 0;">
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #76a865; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>Best</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #74c3e3; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>Still Desirable</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #ffff00; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>Definitely Declining</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #d9838d; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>Hazardous</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #000; border-radius: 50%; 
                                        margin-right: 8px;"></span>Industrial/Commercial/Non-Residential</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #fff; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>Not on Historic Maps</li>
                        </ul>
                        <strong>Features</strong>
                        <ul style="list-style: none; padding: 0; margin-top: 0.5em;">
                        <li>Circle = iBought Home</li>
                        <li>Size of circle = Zestimate ($$$)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- main redlining map -->
            <div id="map">
                <div id="tooltip" style="position:absolute; display:none; background:white; border:1px solid black; padding:4px; font-size:12px; pointer-events:none; z-index:100;"></div>
                <svg>
                    {#key mapViewChanged}
                        {#each homes as home}
                            <circle { ...getHomes(home) } r="{radiusScale(home.time_lookup.get(timeIndex))}" fill="{home.color}" fill-opacity="60%" stroke="black" stroke-opacity="60%">
                                <title>
                                    iBuyer: {home.Name}. Zestimate: ${home.zestimate}. {home.price ? `Sold for: $${home.price} on ${home.dateLastSold}` : "Unknown when last sold for"}. 
                                </title>
                            </circle> 
                        {/each}
                    {/key}
                </svg>
            </div>

            <br><br>
            <!-- fair prices map -->
            <h1> Are iBought Homes Bought for Fair Prices? </h1>
            <p> TO DO: add another visualization with iBought homes (highlight homes if were sold for less than market value)</p>
            <p> TO DO: add more interactive, customized tool tips with image, address, iBuyer, sold for, Zestimate, and potentially other features</p>
            <p> TO DO: add filter by price difference between sold for and Zestimate (reach goal to filter by features like number of bedrooms)</p>

            <br><br>
            <h1>Takeaways</h1>
            <p> TO DO: iBuying is increasing in Boston</p>
            <p> TO DO: Historical info affects present and AI models</p>
            <p> TO DO: iBought homes are not bought for fair prices (more affordable housing is especially vulnerable)</p>

            <br><br>
            <h1>What can we do?</h1>
            <p> TO DO: Reconsider selling your home to iBuyers and if you do, make sure you are getting a fair price (see this resource)</p>
            <p> TO DO: Reach out to FTC (here) if you might qualify for reimbursement from Opendoor</p>
            <p> TO DO: Advocate for better measures of housing (here)</p>
            <p> TO DO: Better protections against speculation (peititon here)</p>

        </div>
        </svelte:fragment>
    </Scrolly>
</div>
</div>
