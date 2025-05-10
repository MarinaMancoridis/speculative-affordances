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
    import DataCollection from "./datacollection.svelte";
    import FtcRefund from "./FtcRefund.svelte";
    import FinalTakeaways from "./final.svelte";
    import RedliningMap from "./redlining.svelte";
    import FairPrices from "./fairprices.svelte";
    import TitlePage from "./titlepage.svelte";
    import PastPresent from "./pastPresent.svelte";
    import Background from "./background.svelte";

    // Zestimate helpers
    import {
        parseZestimateHistory, 
        getLastSoldEvent, 
        calculateZestimateSince, 
        calculateAddressColor, 
        calculateFairPrice, 
        zestimateHistoryScale,
        matchSoldZestimate
    } from "$lib/zestimateHelpers.js"

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
    let map = null;
    let mapSwipe = null;
    let mapViewChanged = 0;
    let mapViewChangedSwipe = 0;
    let timeScale = [0, 0];
    let valueScale = [0, 0];
    let timeIndex = 0;
    
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

        // Virtual set to filter unique records
        homes = Array.from(new Set(homes.map(home => home.Address)))
            .map(address => homes.find(home => home.Address === address));

        // Calculate max range scales
        [timeScale, valueScale] = zestimateHistoryScale([all_times, all_values]);
        // timeIndex = timeScale[0]; // Initialize to latest
        timeIndex = (timeScale[1]+timeScale[0]) / 2 | 0 // JS sorcery for integer division

        // One more pass to calculate time cutoffs
        homes = homes.map(item => {
            
            item.time_lookup = calculateZestimateSince(item.ztimes, item.zvalues, timeScale, valueScale[0])
            if (item.dateLastSold) {
                const year = new Date(item.dateLastSold)
                // console.log("solded: ", year.getFullYear(), timeScale)
                for (let y=timeScale[0];y<year.getFullYear(); y++) {
                    // console.log(y, valueScale[0])
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
        
        // map.addSource("redlining_data", {
        //     type: "geojson",
        //     data: localData
        // });

        // Homes for Swiping Between Maps
        homesSwipe = await d3.csv(`${base}/data/mass_records.csv`, row => ({
            ...row,
            Latitude: Number(row.Latitude), 
            Longitude: Number(row.Longitude),
            Address: String(row.Address),
            Name: String(row.Name)
        }));

        // Fill Color
         homesSwipe = homesSwipe.map(itemSwipe => {
            if (zillowData[itemSwipe.Address]) {
                itemSwipe.color = calculateAddressColor(itemSwipe);
            }
            return itemSwipe;
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

<TitlePage 
    {cols} 
    {rows} 
    {replaceCount} 
    {modifiedImgs} 
    {originalImgs} 
    {rotatingImage} 
    {scrollToExplore}
/>




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
                <DataCollection />

                <NotIBoughtHomes {homes} />
                
                 <!-- <PastPresent/> -->
                 <Background {homes}/>

                <RedliningMap {mapViewChangedSwipe} {homesSwipe} {getHomesSwipe} />

            <EverythingIsGettingExpensive />

            <FairPrices 
                {timeScale} 
                {popupHome} 
                {timeIndex} 
                {map} 
                {getHomes} 
                {radiusScale} 
                {mapViewChanged} 
                {filteredHomes}
            />
            
            <FtcRefund />
            <FinalTakeaways />
              

        </div>
        </svelte:fragment>
    </Scrolly>
</div>
</div>