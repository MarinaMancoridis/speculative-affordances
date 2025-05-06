<style>
    @import url("$lib/global.css");

    /* page and text background */
    :global(body) {
        color: #000;
        /* margin: 0em; */
        /* add horizontal padding so there's space on both sides */
        padding: 0em 2em;
        align-items: center;
        overflow-x: hidden;
        overscroll-behavior-y: none;
    }
</style>

<script>
    import mapboxgl from "mapbox-gl";
    import * as d3 from "d3";
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
    import { onMount, tick } from "svelte";
    import localData from "./../data/mapping_inequality_redlining.json";
    import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
    import { base } from '$app/paths';
    import Scrolly from "svelte-scrolly";
    import popupHome from "$lib/popup.js";
    import { getZoomParams, packHouseImages } from '$lib/houseZoom.js';
    import { getBubblesY, clamp01 } from "$lib/bubbleFall.js";
    import { computeReplaceCount } from "$lib/backgroundHouses.js";
    import { startTypewriter } from "$lib/typewriter.js";
    import { renderCorporateOwnershipChart } from "$lib/corporateOwnershipChart.js";
    import { rotatingImage } from '$lib/imageRotator.js';

    // Svelte Components
    import NotIBoughtHomes from "./NotIBoughtHomes.svelte";
    import EverythingIsGettingExpensive from "./EverythingIsGettingExpensive.svelte";
    import Intro from "./intro.svelte";
    import Somerville from "./somerville.svelte";
    import StickyChart from "./corpownership.svelte";

    // scroll states
    let scrollProgress = 0;
    const numSteps = 6;
    const rows = 10;
    const cols = 10;
    const totalCells = rows * cols;
    console.log("[corp-chart] script loaded");


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
    import redfinlogo from "./../data/redfin.png";
    import opendoorlogo from "./../data/opendoor.png";
    import zillowlogo from "./../data/zillow.png";
    import offerpadlogo from "./../data/offerpad.png";
    

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
    const { originalImgs, modifiedImgs } = packHouseImages(baseOriginals, baseModifieds);


    // pageProgress: 0 at top, 1 at bottom
    let pageProgress = 0;

    // zooming functionality         // in vh
    $: ({ scale, opacity } = getZoomParams(pageProgress));

    // bubble falling functionality
    let bubblesVisible = false;
    let bubblesY = [];
    const bubbleStart  = 0.0;  // don’t start moving until scrollProgress ≥ 0.4
    const bubbleEnd    = 0.4;  // reach "end" by scrollProgress = 0.6


    // trigger when the Major Players section comes into view
    function observeMajorPlayers() {
        const el = document.getElementById("major-players-section");
        if (!el) return;

        new IntersectionObserver(
        ([entry]) => bubblesVisible = entry.isIntersecting,
        { threshold: 0.1 }
        ).observe(el);
    }


    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        pageProgress = Math.min(scrollTop / docHeight, 1);
    }
    $: if (bubblesVisible) {
        // normalize into [0,1] over the window [bubbleStart, bubbleEnd]
        const prog = clamp01((pageProgress - bubbleStart) / (bubbleEnd - bubbleStart));
        bubblesY = getBubblesY(prog);
    } else {
        bubblesY = [];  // hide them when you're out of view
    }


    // compute how many images to replace
    $: replaceCount = computeReplaceCount(pageProgress, totalCells);

    function intersectionObserver(node) {
        const observer = new IntersectionObserver(
            ([entry]) => node.classList.toggle('active', entry.isIntersecting),
            { threshold: 0.1 }   // fire when just 10% is visible
        );
        observer.observe(node);
        return { destroy: () => observer.disconnect() };
    }

    // map and data states
    mapboxgl.accessToken = "pk.eyJ1IjoibWFyaW5hLW1hbmNvcmlkaXMiLCJhIjoiY205NXBjZmx3MWNkZjJzcHc0dDVlYXFodCJ9.mS5MAGr-YmpGput97-3htA";
    let homes = [];
    let homesSwipe = [];
    let zillowData = [];
    let mergedData = [];
    let map = null;
    let mapSwipe = null;
    let mapViewChanged = 0;
    let mapViewChangedSwipe = 0;
    let timeScale = [0, 0];
    let valueScale = [0, 0];
    let timeIndex = 0;

    // Config for threshold between sale to nearest zestimate
    const saleToZestimateDateThreshold = 4e9; // Roughly 45 days

    // Swiping between maps
    let beforeMap;
    let afterMap;
    
    function getHomes (home) {
        let point = new mapboxgl.LngLat(+home.Longitude, +home.Latitude);
        let {x, y} = map.project(point);
        return {cx: x, cy: y};
    };

    function getHomesSwipe (homeSwipe) {
        let pointS = new mapboxgl.LngLat(+homeSwipe.Longitude, +homeSwipe.Latitude);
        let {x, y} = mapSwipe.project(pointS);
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

    function calculateFairPrice(home) {
        let color = "white";
        localData.features.some(f => {
            if (home.difference < 0) {
                color = "#644E8F";
                return true;
            } else if (home.difference >= 0) {
                color = "goldenrod";
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
    $: mapSwipe?.on("move", evt => mapViewChangedSwipe++);

    $: radiusScale = d3.scaleSqrt()
            .domain(valueScale)
            .range([0, 25]);

    // Filter out homes that we don't have comparison data on
    let filteredHomes = [];

    onMount(async () => {
        await tick();
        console.log("[corp-chart] onMount fired");

        startTypewriter("typewriter", "What happens when a machine becomes a buyer?");

        updateProgress();                        // init
        window.addEventListener('scroll', updateProgress);
        observeMajorPlayers();

        // ------------ marina's corporate ownership chart ------------
        await tick();
        renderCorporateOwnershipChart(
            base,
            "corp-own-chartcorp-own-chart",
            "sticky-container",
            "chart-wrapper",
            "chart-tooltip"
        );
        
        // -------------------------------------------------------------------

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

                // zestimate history API structure
                const [times, values] = parseZestimateHistory(zillowData[item.Address]);
                item.ztimes = times;
                item.zvalues = values;
                all_times = all_times.concat(times);
                all_values = all_values.concat(values);

                function matchSoldZestimate(e, [times, values]) {
                    const d = (new Date(e["date"])).getTime()
                    const time = times[0]
                    if (!time) {
                        // console.log("No zestimates available")
                        return
                    }
                    const diff = d-time
                    if (diff<0) {
                        // console.log("Zestimate not recent enough"); 
                        return
                    }
                    let idx = 0;
                    for (let i=0; i<times.length; i++) {
                        const diff = d-times[i]
                        if (diff<0) {
                            idx = i
                            function msToTime(ms) {
                                let seconds = (ms / 1000).toFixed(1);
                                let minutes = (ms / (1000 * 60)).toFixed(1);
                                let hours = (ms / (1000 * 60 * 60)).toFixed(1);
                                let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
                                if (seconds < 60) return seconds + " Sec";
                                else if (minutes < 60) return minutes + " Min";
                                else if (hours < 24) return hours + " Hrs";
                                else return days + " Days"
                            }
                            if (Math.abs(diff)>saleToZestimateDateThreshold) return
                            // console.log("diff; ", msToTime(-diff))
                            break
                        }
                    }
                    return values[idx]
                    // console.log("date", d)
                }

                // recent sold event
                const recentSoldEvent = getLastSoldEvent(zillowData[item.Address]);
                if (recentSoldEvent) {
                    item.price = recentSoldEvent["price"];
                    item.dateLastSold = recentSoldEvent["date"];
                    const matchedZestimate = matchSoldZestimate(recentSoldEvent, [times, values])
                    if (!matchedZestimate) {
                        item.difference = undefined
                    }
                    else {
                        item.matchedZestimate = matchedZestimate
                        item.difference = parseFloat(item.price) - parseFloat(item.matchedZestimate)
                    }
                    // item.difference = parseFloat(item.price) - parseFloat(item.zestimate);
                } else {
                    item.price = undefined;
                    item.dateLastSold = undefined;
                }
                
                // color fill for redlining
                // item.color = calculateAddressColor(item);

                // color fill for fair prices 
                item.color = calculateFairPrice(item);


                // home attributes
                // console.log(JSON.stringify(zillowData[item.address])
                // item.zillowData = zillowData[item.Address];
                item.bedrooms = zillowData[item.Address].bedrooms;
                item.bathrooms = zillowData[item.Address].bathrooms;
                item.livingAreaValue = zillowData[item.Address].livingAreaValue;
                item.yearBuilt = zillowData[item.Address].yearBuilt;
                item.photoURL = zillowData[item.Address].responsivePhotos[0]["mixedSources"]["jpeg"].at(-1)["url"];
            }
            return item;
        });

        homes = Array.from(new Set(homes.map(home => home.Address)))
            .map(address => homes.find(home => home.Address === address));

        // Calculate max range scales
        [timeScale, valueScale] = zestimateHistoryScale([all_times, all_values]);
        timeIndex = timeScale[0]; // Initialize to latest

        // One more pass to calculate time cutoffs
        homes = homes.map(item => {
            
            item.time_lookup = calculateZestimateSince(item.ztimes, item.zvalues, timeScale)
            if (item.dateLastSold) {
                const year = new Date(item.dateLastSold)
                console.log("solded: ", year.getFullYear(), timeScale)
                for (let y=timeScale[0];y<year.getFullYear(); y++) {
                    console.log(y, valueScale[0])
                    item.time_lookup.set(y, valueScale[0])
                }
            }
            return item;
        })

        filteredHomes = homes.filter((home) => home.color !== "white")

        map = new mapboxgl.Map({
            container: 'map', // HTML element ID
            style: 'mapbox://styles/marina-mancoridis/cm95pzaws009901qt26z24os9',
            center: [-71.1056, 42.3736], // Cambridge/Boston (longitude, latitude)
            zoom: 10.75,
            minZoom: 10,
            maxZoom: 18
        });

        await new Promise(resolve => map.on("load", resolve));
        
        map.addSource("redlining_data", {
            type: "geojson",
            data: localData
        });

        // Homes for Swiping Between Maps
        homesSwipe = await d3.csv(`${base}/data/mass_records.csv`, row => ({
            ...row,
            Latitude: Number(row.Latitude), 
            Longitude: Number(row.Longitude),
            Address: String(row.Address),
            Name: String(row.Name)
        }));

         mapSwipe = new mapboxgl.Map({
            container: 'mapSwipe', // HTML element ID
            style: 'mapbox://styles/marina-mancoridis/cm95pzaws009901qt26z24os9',
            center: [-71.1056, 42.3736], // Cambridge/Boston (longitude, latitude)
            zoom: 11.5,
            minZoom: 10,
            maxZoom: 18
        });

        mapSwipe = new mapboxgl.Map({
            container: 'mapSwipe', // HTML element ID
            style: 'mapbox://styles/marina-mancoridis/cm95pzaws009901qt26z24os9',
            center: [-71.1056, 42.3736], // Cambridge/Boston (longitude, latitude)
            zoom: 11.5,
            minZoom: 10,
            maxZoom: 18
        });

        await new Promise(resolve => mapSwipe.on("load", resolve));

        mapSwipe.addSource("redlining_data", {
            type: "geojson",
            data: localData
        });

        mapSwipe.addLayer({
            id: "grade_color_layer",
            type: "fill",
            source: "redlining_data",
            paint: {
                "fill-color": ["get", "fill"],
                "fill-opacity": 0.5,
                "fill-outline-color": "#ad494e"
            },
        });

        const slider = document.getElementById("slider");
        const sliderValue = document.getElementById("slider-value");

        slider.addEventListener("input", function () {
            const value = parseInt(slider.value, 10);
            const opacity = value / 100;

            // Update Mapbox layer opacity
            mapSwipe.setPaintProperty("grade_color_layer", "fill-opacity", opacity);

            // Update visible label
            sliderValue.textContent = `${value}%`;
       });
    });
</script>

<div class="grid-bg">
    {#each Array(cols*rows) as _, i}
      <div
        class="grid-cell"
        style="background-image:
                 url({ i < replaceCount
                          ? modifiedImgs[i]
                          : originalImgs[i]
                      });
               ">
      </div>
    {/each}
</div>

<div class="title-section">
    <div class="rotator">
      <img src={$rotatingImage} alt="Rotating title image" />
    </div>
  
    <div class="title-text">
      <h1>AUTOMATION AND SPECULATION</h1>
      <p class="typewriter-line" id="typewriter"></p>
      <p>
        <b>Speculative Affordances, Final Project:</b>
        <br>
        <i>Lena Armstrong, Marina Mancoridis, Eagon Meng, Jon Rosario</i>
      </p>
    </div>
  
    <!-- now sibling of .title-text -->
    <button class="scroll-indicator" on:click={scrollToExplore} type="button">
      <span>Explore</span>
      <div class="arrow" style="margin-left:0.8rem;">↓</div>
    </button>
</div>




<div class="content-section">
    <div class="grid-container">

    <!-- ■■■ New “What is iBuying?” step ■■■ -->
    <Intro />
    
    <Scrolly bind:progress={scrollProgress} threshold={0.5} debounce>

        <Somerville
            {intersectionObserver}
            {house16}
            {scale}
            {opacity}
            {bubblesVisible}
            {bubblesY}
            zillowlogo={zillowlogo}
            opendoorlogo={opendoorlogo}
            offerpadlogo={offerpadlogo}
            redfinlogo={redfinlogo}
        />

        <!-- VIZ only shows once you've scrolled through all previous steps -->
        <svelte:fragment slot="viz">

        <div class="after-todo">
            <StickyChart/>

            <div class="post-chart">
                <br><br><br><br>
                <h1 style="text-align: center;">Data Collection— The Presence of iBuying in Boston</h1>
                <div style="max-width: 800px; margin: 0 auto; text-align: left;">
                    <p><b>How do you find a hidden market?</b> There is no public dataset of iBuying in the Greater Boston Area. While our previous chart focused more broadly on <i>corporate speculation</i> in Boston, our analysis wishes to look at iBuying in particular. 
                        
                    </p><p>Our analysis involved <b>creating our own dataset</b> of iBuying in the Greater Boston Area. To do this, we turned to the <a href="https://www.masslandrecords.com/">Mass Land Records</a>, searching for key names like Opendoor, Zillow, Redfin, and Offerpad—the big players in iBuying. This type of keyword matching is the approach that was used in <a href="https://dl.acm.org/doi/pdf/10.1145/3630106.3659027">prior research</a>. 
                    </p> 
                    <p>Using this simple but powerful method, we uncovered <b>407 homes purchased by iBuyers</b> between 2019 and 2025. Of course, this likely understates the true figure: not every transaction may cleanly announce itself in the records. In other words, the story of iBuying in Boston may be even bigger than these numbers suggest. </p>
                    <br><br>
                </div>

                <NotIBoughtHomes {homes} />
                
                <h1 id="redlining" style="text-align: center;">🏠 iBought Homes Contexutalized with Historically Redlined Districts 🏠</h1>    
                <div style="max-width: 800px; margin: 0 auto; text-align: left;">
                    <p>We're exploring not just where iBuying happens geographically, but <b>how it aligns with deeper patterns of inequality</b>. Beyond maps and neighborhoods, we're interested in understanding if iBuying intersects with historical discrimination.

                    </p><p> Redlining emerged prominently in the 1930s, driven by the Home Owners' Loan Corporation (HOLC). Through color-coded maps, the HOLC systematically labeled neighborhoods—often those home to minority communities—as <b><span style="color: #d9838d;">hazardous</span></b> or <b><span style="color: goldenrod">definitely declining areas</span></b>. These classifications effectively blocked residents from mortgages, credit, and equitable housing opportunities, creating lasting impacts still felt today.

                    </p><p>By examining iBuying through the lens of these historical markers, we aim to uncover whether modern real estate practices might be echoing—or even amplifying—past inequities. <b>Could today's tech-driven transactions be shaped by the  shadow of yesterday's redlining?</b> That's exactly what we're investigating.</p>
                        
                    <br><br>
                </div>

                <!-- wrapper that holds text on the left and legend on the right -->
                <div class="legend-text-wrapper" style="
                        display: flex;
                        gap: 2em;
                        align-items: flex-start;
                        margin-bottom: 2em;
                        font-size: 1.2em;
                    ">

                <!-- left: all your step-4 & last-step text + slider -->
                <!-- iBuying and redlining map -->
                <div id="mapSwipe">
                    <svg>
                        {#key mapViewChangedSwipe}
                            {#each homesSwipe as homeSwipe}
                                <circle { ...getHomesSwipe(homeSwipe) } r="12" fill="#F2F2F2" fill-opacity="100%" stroke="black" stroke-opacity="60%">
                                </circle> 
                                <text
                                    x={getHomesSwipe(homeSwipe).cx}
                                    y={getHomesSwipe(homeSwipe).cy}
                                    font-size="12"
                                    text-anchor="middle"
                                    dominant-baseline="middle"
                                > 🏠 </text>
                            {/each}
                        {/key}
                    </svg>
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
                                        border-radius: 0%; margin-right: 8px;"></span>Best</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #74c3e3; border: 1px solid #4f5152; 
                                        border-radius: 0%; margin-right: 8px;"></span>Still Desirable</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #ffff00; border: 1px solid #4f5152; 
                                        border-radius: 0%; margin-right: 8px;"></span>Definitely Declining</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #d9838d; border: 1px solid #4f5152; 
                                        border-radius: 0%; margin-right: 8px;"></span>Hazardous</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #000; border-radius: 0%; 
                                        margin-right: 8px;"></span>Industrial/Commercial</li>
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #fff; border: 1px solid #4f5152; 
                                        border-radius: 0%; margin-right: 8px;"></span>Not on Historic Maps</li>
                        
                        <br>
                        <label><b>Redlining Map Opacity: <b></label>
                        <input id="slider" type="range" min="0" max="75" step="1" value="50">
                    </div>
                </div>
            </div>
            <div style="max-width: 800px; margin: 0 auto; text-align: left;">
            <p>We find that iBought homes tend to be in areas that were historically redlined as <b><span style="color: #d9838d;">hazardous</span></b> and <b><span style="color: goldenrod">definitely declining areas</span></b>, suggesting long‑lasting effects of historical redlining.<br><br><br>
            </p></div>

            <EverythingIsGettingExpensive />

            <h1 style="text-align: center;">🏠 Are iBought Homes Sold for Fair Prices? 🏠</h1>
            <div style="max-width: 1100px; margin: 0 auto; text-align: left;">
                <p><b>Despite iBuyers claiming that they purchase homes at fair prices, they often buy homes for much less than their worth</b>. In 2022, FTC charged Opendoor with lying to people that they were getting market value for their homes and Opendoor agreed to pay $62 million. Since then, Opendoor has continued to expand to over 50+ markets, including Boston.</p> 
                <p>This visualization shows which iBought homes were sold for unfair prices and how Zestimates increase over time.</p>
            </div>

            <div class="legend-text-wrapper" style="
                    display: flex;
                    gap: 2em;
                    align-items: flex-start;
                    margin-bottom: 2em;
                    font-size: 1.2em;
                ">

            <!-- left side: map -->
            <div id="map">
                <div id="tooltip" style="position:absolute; display:none; background:white; border:1px solid black; padding:4px; font-size:12px; pointer-events:none; z-index:100;"></div>
                <svg>
                    {#key mapViewChanged}
                        {#each filteredHomes as home}
                            <circle { ...getHomes(home) } r="{radiusScale(home.time_lookup.get(timeIndex))}" fill={home.color} stroke="black" stroke-opacity="60%" on:click={()=>{popupHome(home, map)}}>
                                <title>
                                    iBuyer: {home.Name}. Zestimate: ${home.zestimate}. Zestimate at sale time: {home.matchedZestimate?`$${home.matchedZestimate}`:"unknown"}. {home.price ? `Sold for: $${home.price} on ${home.dateLastSold}` : "Unknown when last sold for"}. 
                                </title>
                            </circle> 
                        {/each}
                    {/key}
                </svg>
            </div>

            <div class="legend-text-wrapper">
                <div style="
                        background: #faf7fa;
                        color: #000;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        padding: 1em;
                        font-size: 0.95em;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    ">

                <label style="display: block; color: #333; font-weight: 500;">
                    <b>Zestimate Year:</b>
                    <input 
                    type="range" 
                    min="{timeScale[0]}" 
                    max="{timeScale[1]}" 
                    bind:value={timeIndex} 
                    style="width: 100%; accent-color: steelblue;"
                    />
                    <time style="display: block; text-align: right; font-size: 0.9em; color: #555; margin-top: 0.25em;">
                    {timeIndex}
                    </time>
                </label>

                 <b>Zestimate Value </b>
                        <ul style="list-style: none; padding: 0; margin: 0.5em 0;">
                        <li><span style="display: inline-block; width: 15px; height: 15px;
                                        background-color: white; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>$500,000</li>
                        <li><span style="display: inline-block; width: 20px; height: 20px;
                                        background-color: white; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>$1,000,000</li>
                        <li><span style="display: inline-block; width: 25px; height: 25px;
                                        background-color: white; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>$1,500,000</li>
                        <li><span style="display: inline-block; width: 30px; height: 30px;
                                        background-color: white; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>$2,000,000</li>
                
                <!-- <br><br> -->
                <!-- Slider to filter by difference -->
                <!-- <label style="display: block; color: #333; font-weight: 500;">  -->
                <!--    <b>Price Difference:</b>  -->
                <!--    <input type="range" id="difference-slider" min="0" max="2000000" value="0" step="50000" style="width: 100%; accent-color: steelblue;"/>  -->
                <!-- </label>  -->

                <br>
                <b>Was the selling price of the iBought Home <br> less than its Zestimate?</b> 
                    <ul style="list-style: none; padding: 0; margin: 0.5em 0;">
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: #644E8F; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>Sold for lower than Zestimate</li>
                        
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: goldenrod; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>Sold for greater than Zestimate</li>
                        <!-- <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: white; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>Sold for price unknown</li> -->

                </div>
                
            </div>
            </div>

            <div style="max-width: 900px; margin: 0 auto; text-align: left;">
                <p><i><b>Click any point</b></i> to see information about the home, selling price, and Zestimate value.</p>
                <p><i><b>Scroll on the map</b></i> to explore different parts of the Greater Boston Area.</p>
                <p><i><b>Use the slider</b></i> to see how Zestimate values change by year.</p>
            </div>
              
            <br><br><br><br>
            <div id="takeaways">
                <h3>Takeaways</h3>
                <ul>
                <li>iBuying is prevalent in Boston, especially for more afforadble housing.</li>
                <li>Redlining and discriminatory housing practices in the past continue to affect present housing and consquently AI real estate pricing models.</li>
                <li>iBought homes are not bought for fair prices.</li>
            </div>

            <br><br>
            <div id="action">
                <h3>What can we do?</h3>
                <ul>
                <li> Reconsider selling your home to iBuyers. If you do, make sure you are getting a fair price by checking its value through Zillow's <a id="action-links" href="https://www.zillow.com/how-much-is-my-home-worth/">Zestimate tool</a>.</li>
                <li> Reach out to <a id="action-links" href="https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-sends-nearly-62-million-refunds-sellers-deceived-online-real-estate-listing-service-opendoor">Federal Trade Commission</a> if you suspect that you have been given an unfair price by an iBuyer.</li>
                <li> Advocate for protections against automated speculation practices.</li>
            </div>

            <br><br>
            <div id="acks">
                <h3>Acknowledgements</h3>
                <p>This project was developed with guidance and feedback from the <a id="action-links" href="https://www.mapc.org/">Metropolitan Area Planning Commission (MAPC)</a>.</p>
            </div>

            <br><br>
            <div id="references">
                <h3>References</h3>
                <ul>
                <li> [1] <a class="ref" href="https://www.gao.gov/assets/gao-24-106643.pdf">https://www.gao.gov/assets/gao-24-106643.pdf</a></li>
                <li> [2] <a class="ref" href="https://www.onlinemarketplaces.com/articles/timeline-of-zillow-ibuying/">https://www.onlinemarketplaces.com/articles/timeline-of-zillow-ibuying/</a></li>
                <li> [3] <a class="ref" href="https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-sends-nearly-62-million-refunds-sellers-deceived-online-real-estate-listing-service-opendoor">https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-sends-nearly-62-million-refunds-sellers-deceived-online-real-estate-listing-service-opendoor</a> </li>
                <li> [4] <a class="ref" href="https://investor.opendoor.com/ir-resources/faqs">https://investor.opendoor.com/ir-resources/faqs</a></li>
                <li> [5] <a class="ref" href="https://dl.acm.org/doi/pdf/10.1145/3630106.3659027">https://dl.acm.org/doi/pdf/10.1145/3630106.3659027</a></li>
            </div>

        </div>
        </svelte:fragment>
    </Scrolly>
</div>
</div>
