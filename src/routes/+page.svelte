<style>
    @import url("$lib/global.css");

    :global(.scrolly) {
        display: block !important;
        --scrolly-gap: 2em;
    }

    /* page and text background */
    :global(body) {
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
        background: #f8f8f8;
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
        padding: 0em;
        
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
        z-index: 0;
        pointer-events: none;
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

    .post-chart {
        font-family: 'Roboto', sans-serif;
        font-size:1.0em;
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
        height: 10vh;
    }

    /* ensure container is the stacking context */
    .grid-container { position: relative; }

    /* overlay only the first three real steps */
    :global(.scrolly-step.overlay-step) {
        /* remove absolute positioning */
        position: relative;
        top: auto; left: auto; transform: none;

        /* space them out vertically */
        margin: 5vh auto;   /* e.g. 5% of viewport height above & below each step */
        width: 60%;
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

    #typewriter {
        /* font-family: 'Tangerine', serif; */
        font-family: "Source Code Pro", monospace;
        font-size: 1.5rem;
        color: #ffffff;
        margin-top: 1em;
        white-space: nowrap;
        overflow: hidden;
        border-right: 2px solid rgba(255,255,255,0.75);
        animation: blink-caret 0.75s step-end infinite;
    }

    @keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: rgba(255,255,255,0.75); }
    }

    .zoom-house-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        padding: 2em;
        box-sizing: border-box;
    }

    .zoom-house-container.right {
        justify-content: flex-end;
    }

    .zoom-house-container.left {
        justify-content: flex-start;
    }

    .zoom-house-container.center {
        justify-content: center;
    }


    .zoom-house-image,
    .zoom-house-step .zoom-house-container .zoom-house-text {
        width: 40%;
        background: #f8f8f8;
        padding: 2em;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        font-size: 1.25em;
        line-height: 1.7;
        color: #333333;
        border: 1px solid rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
    }

    /* Note styling */
    .zoom-house-text .note {
        margin-top: auto;
        font-size: 0.75em;
        font-style: italic;
        color: #666;
        padding-top: 1em;
    }

    /* Remove unwanted background from paragraphs */
    .zoom-house-text p {
        background: transparent !important;
    }

    .zoom-house-text p + p {
        margin-top: 1em; /* Adjust the value as needed */
    }

    .zoom-house-image {
        width: 50%;
        height: 100%;
        transform: scale(0.1);
        opacity: 0;
        transition: transform 0.8s ease-in-out, opacity 0.8s ease-in-out;
    }

    .zoom-house-text {
        width: 50%;
        padding: 2em;
        background: #fff7f7;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Active state for zoomed-in effect */
    .zoom-house-step.active .zoom-house-image {
        transform: scale(1);
        opacity: 1;
    }

    .zoom-house-step {
        /* make the step fill the viewport so it can enter/exit properly */
        min-height: 100vh;
        display: flex;
        align-items: center;
        /* now the container children will lay out inside this full-height box */
    }

    .zoom-panel {
        position: absolute;
        /* compute these in the style attribute… */
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
    }
    .zoom-panel img {
        width: 100%;
        height: 100%;
        transform-origin: center center;
    }


    /* make your text sit on the right half */
    .text-step {
        display: flex;
        align-items: center;
    }

    /* force the .step-text to take up 40% of its parent,
    push itself to the right, and leave 1em of breathing room */
    .text-step .step-text {
        width: 40%;              
        margin: 0 1em 0 auto;    /* top/right/bottom/left → right-margin=1em, left-margin=auto */
        box-sizing: border-box;   /* include any padding inside that 40% */
    }

    img#zoom-house {
        position: fixed;
        left: 1.5%;
        top: 45%;
        transform-origin: left center;
        /* we'll override transform+opacity inline */
        pointer-events: none;
        z-index: 100;          /* on top of your grid & content */
        width: 50vw;           /* half the screen width */
        height: auto;
    }

    #zoom-house {
        flex: 0 0 50%;
        transform-origin: left center;
        pointer-events: none;
        width: 50vw;
        height: auto;
        position: fixed;
        left: 1.5%;
        top: 45%;
    }

    img.outline {
        filter:
            drop-shadow(10px 0 0 #d3a3a3)
            drop-shadow(-10px 0 0 #d3a3a3)
            drop-shadow(0 10px 0 #d3a3a3)
            drop-shadow(0 -10px 0 #d3a3a3);
    }

    .bubbles {
        position: fixed;
        top: 0;
        right: 10vw;
        width: 35vw;
        height: 100vh;
        pointer-events: none;
        z-index: 10;
    }

    .bubbles .bubble {
        position: absolute;
        width: 10vw;                /* bigger circle */
        height: 10vw;
        background: #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        /* stronger drop-shadow under each bubble */
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    }

    /* now space them at 30% increments across that 35vw strip */
    .bubbles .bubble:nth-child(1) { left: 0%;  }
    .bubbles .bubble:nth-child(2) { left: 30%; }
    .bubbles .bubble:nth-child(3) { left: 60%; }
    .bubbles .bubble:nth-child(4) { left: 90%; }

    .bubbles .bubble img {
        max-width: 80%;
        max-height: 80%;
        object-fit: contain;
    }

    .chart-text {
        font-family: 'Roboto', sans-serif;
        color: #333333;
        font-size: 1.25em;
        line-height: 1.7;
        max-width: 700px;
        margin: 0 auto 1.5em;
    }

    /* match the narrative headings’ font family, but keep your chart-title styling */
    .chart-title {
        font-family: 'Roboto', sans-serif;
        color: #4f384c;
        font-size: 1.8rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
    }

   /* the container we’ll flip on/off */
   #sticky-container {
        position: relative;
    }

    #sticky-container.sticky {
        position: sticky;
        top: 0;
        z-index: 10;
        width: 100%;
        background: white;
        transition: position 0.3s ease-out;
    }

    .home-selection {
        display: flex;
        justify-content: center;
        gap: 2em;
        margin: 2em 0;
        flex-wrap: wrap;
    }

    .home-card-wrapper {
        flex: 1 1 calc(33.333% - 2em);
        max-width: calc(33.333% - 2em);
        display: flex;
        justify-content: center;
    }

    .home-card {
        width: 100%;
        aspect-ratio: 1 / 1;
        transition: transform 0.3s ease, outline 0.3s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: none;
    }

    .image-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 8px;
    }

    .home-card img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Ensures cropping to center */
        transition: filter 0.3s ease;
    }

    .home-card img.grayscale {
        filter: grayscale(100%);
    }

    .home-card.selected {
        outline: 4px solid #644E8F;
        transform: scale(1.05);
    }

    .house-details {
        margin-top: 2em;
        padding: 1em;
        background: #f8f8f8;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .house-details h2 {
        color: #644E8F;
    }

    .dialogue-box {
        position: absolute;
        background: #ffffff;
        color: #333333;
        font-family: 'Roboto', sans-serif;
        font-size: 1.2rem;
        line-height: 1.4;
        padding: 0.75em 1em;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        max-width: 240px;           /* wrap around 240px */
        white-space: normal;        /* allow wrapping */
        pointer-events: none;       /* never block scrolling */
        transform: translate(-50%, -100%); /* center above point */
        display: none;              /* hidden until needed */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: opacity 0.2s ease;
        z-index: 1000;              /* float above everything */
        text-align: left;
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
    import popupHome from "$lib/popup.js"

    // Reactive variables for hovered and selected house
    let hoveredHouse = null;
    let selectedHouse = null;
    let notiBoughtHomes = [];

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

    // images turning from black to white
    const startScroll = 0.25;
    const endScroll   = 0.4;

    // pageProgress: 0 at top, 1 at bottom
    let pageProgress = 0;

    // zooming functionality         // in vh
    const zoomInStart = 0.06;   
    const zoomPeak    = 0.105;  
    const zoomOutEnd  = 0.18;  
    $: zoomP =
        pageProgress < zoomInStart ? 0
    : pageProgress < zoomPeak    ? (pageProgress - zoomInStart) / (zoomPeak - zoomInStart)
    : pageProgress < zoomOutEnd  ? 1 - ((pageProgress - zoomPeak) / (zoomOutEnd - zoomPeak))
    : 0;

    $: scale   = 0.1 + zoomP * 0.9;
    $: opacity = zoomP * 1.3;

    // bubble falling functionality
    // control points (in page‐progress units)
    const fallStart = 0.14;
    const fallEnd   = 0.215;
    const bounceEnd = 0.230;
    const leaveEnd  = 0.28;

    // Y positions (vh)
    const startY       = -40;  // off‐screen top
    const peakY        =  40;  // bottom of first drop
    const bounceUp    =  15;    // how much to bounce up
    const bounceY     =  peakY - bounceUp;  // 25
    const endY         = 100;  // off‐screen bottom

    // small delays to stagger each bubble
    const delays = [0, 0.015, 0.03, 0.045];

    function clamp01(t) {
        return t < 0 ? 0 : t > 1 ? 1 : t;
    }

    function lerp(a, b, t) {
        return a + (b - a) * clamp01(t);
    }

    function calcBubbleY(p) {
        if (p < fallStart) {
        return startY;
        }
        if (p < fallEnd) {
        // drop from startY → peakY
        const t = (p - fallStart) / (fallEnd - fallStart);
        return lerp(startY, peakY, t);
        }
        if (p < bounceEnd) {
        // bounce from peakY → bounceY
        const t = (p - fallEnd) / (bounceEnd - fallEnd);
        return lerp(peakY, bounceY, t);
        }
        if (p < leaveEnd) {
        // exit from bounceY → endY
        const t = (p - bounceEnd) / (leaveEnd - bounceEnd);
        return lerp(bounceY, endY, t);
        }
        return endY;
    }
    $: bubblesY = delays.map(d => calcBubbleY(pageProgress - d));


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

    let zoomActive = false;

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


    onMount(async () => {
        await tick();
        console.log("[corp-chart] onMount fired");

        const text = "What happens when a machine becomes a buyer?";
        const el = document.getElementById("typewriter");
        let index = 0;

        function typeChar() {
            if (index < text.length) {
                el.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 45); // Speed in ms
            }
        }

        typeChar();

        updateProgress();                        // init
        window.addEventListener('scroll', updateProgress);

        // ------------ marina's corporate ownership chart ------------
        // 1) load & preprocess corporate_ownership.csv
        const url = `${base}/data/corporate_ownership.csv`;
        console.log("about to process corporate ownership");
        console.log("Fetching CSV from:", url);

        let corpData;
        try {
            corpData = await d3.csv(url, d => ({
            year:  +d.Year,
            corp_own_rate: +d.corp_own_rate
            }));
        } catch (e) {
            console.error("Error loading CSV:", e);
            return;
        }
        console.log("corpData rows:", corpData.length, corpData.slice(0,3));

        // 2) group by year and compute mean corp_own_rate
        // now compute the grouped averages
        const nested = d3.rollups(
            corpData,
            v => d3.mean(v, d => d.corp_own_rate),
            d => d.year
        ).map(([year, avg]) => ({ year, avg }))
        .sort((a,b) => a.year - b.year);
        console.log("nested averages:", nested);

        const descriptions = {
            2011: "Research shows that there was no single institutional investor who owned more than 1,000 single-family homes in America [1].",
            2014: "Opendoor releases their “iBuyer” model. This model used algorithms to make near-instant, cash offers for home. This formally launched its platform as a direct buyer of homes [4].",
            2015: "Collectively, institutional investors owned 170,000 to 300,000 homes [1].",
            2017: "Zillow piloted its “instant offers” program in Orlando and Las Vegas, giving sellers the ability to compare cash bids from select investors with local agent market appraisals [2].",
            2018: "Zillow shifted from facilitating offers to purchasing homes outright, directly competing with Opendoor; its first acquisition was a four-bedroom bungalow in Arizona, and by quarter’s end it had bought 19 Phoenix-area properties [2].",
            2020: "Operating in 25 markets, Zillow drew criticism by hiring full-time, salaried agents for its iBuying arm—an initiative Zillow argued improved user experience, but many U.S. realtors viewed as an aggressive market incursion [2].",
            2022: "The FTC charged Opendoor with misleading homeowners by promising they would receive true market value for their homes [3].",
            2024: "Following the FTC investigation, nearly 62 million dollars in refunds were issued to sellers who had been misled by Opendoor Labs’ online listing service [3]."
        };

        // check chart container
        const container = document.getElementById("corp-own-chart");
        console.log("chart container exists?", !!container, container);
        
        if (!container) {
            console.warn("⚠️ couldn’t find #corp-own-chart in the DOM");
            return;
        }

        // 3) set up chart dimensions
        // 1) Bigger margins to make room for larger labels
        const margin = { top: 40, right: 20, bottom: 100, left: 100 };
        const { width: totalW, height: totalH } = container.getBoundingClientRect();
        const width  = totalW  - margin.left - margin.right;
        const height = totalH  - margin.top  - margin.bottom;

        // 2) Build the SVG
        const svg = d3.select("#corp-own-chart")
        .append("svg")
            .attr("width", totalW)
            .attr("height", totalH)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // 3) Scales
        const x = d3.scaleLinear()
            .domain(d3.extent(nested, d => d.year))
            .range([0, width]);
        const y = d3.scaleLinear()
            .domain([0, d3.max(nested, d => d.avg)]).nice()
            .range([height, 0]);

        // 4) Axis generators with extra tick‐padding
        const xAxis = d3.axisBottom(x)
            .tickFormat(d3.format("d"))
            .tickPadding(15);
        const yAxis = d3.axisLeft(y)
            .tickPadding(15);

        // 5) Draw X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
        .selectAll("text")
            .style("font-family", "Roboto, sans-serif")
            .style("font-size", "19px");

        // 6) Draw Y axis
        svg.append("g")
            .call(yAxis)
        .selectAll("text")
            .style("font-family", "Roboto, sans-serif")
            .style("font-size", "19px");

        // 7) X‐axis label (bigger, pushed further down)
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 30)  // farther from axis
            .attr("text-anchor", "middle")
            .style("font-family", "Roboto, sans-serif")
            .style("font-size", "20px")
            // .style("font-weight", "500")
            .text("Year");

        // 8) Y‐axis label (bigger, pushed further left)
        svg.append("text")
            .attr("transform", `rotate(-90)`)
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)           // more negative = further left
            .attr("text-anchor", "middle")
            .style("font-family", "Roboto, sans-serif")
            .style("font-size", "20px")
            // .style("font-weight", "500")
            .text("Average Corporate Ownership Rate (%)");

        // 9) Your line (unchanged)
        const line = svg.append("path")
            .datum(nested)
            .attr("class", "ownership-line")    // ← add this
            .attr("fill", "none")
            .attr("stroke", "#ad2f4c") // red line
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(d => x(d.year))
                .y(d => y(d.avg))
        );

        // 10) calculate total length for dash‐array trick
        // — get references —'
        const stickyContainer = document.getElementById('sticky-container');
        const wrapper = document.getElementById('chart-wrapper');
        console.log('wrapper is', wrapper);
        const path            = svg.select('.ownership-line');
        const L               = path.node().getTotalLength();

        // hide the line
        path
            .attr('stroke-dasharray', L)
            .attr('stroke-dashoffset', L);

        let drawingActive = false;
        const stickObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.intersectionRatio === 1 && !drawingActive) {
                    stickyContainer.classList.add('sticky');
                    drawingActive = true;
                    startScrollY = window.scrollY;
                    window.addEventListener('scroll', drawOnScroll, { passive: true });
                    stickObserver.disconnect();
                }
            },
            { threshold: 1.0 }
        );
        stickObserver.observe(wrapper);


        // 11) scroll event to animate the line
        function clamp01(t) {
            return t < 0 ? 0 : t > 1 ? 1 : t;
        }
        let startScrollY = window.scrollY;
        const maxScrollDelta = window.innerHeight;

        function drawOnScroll() {
            if (!drawingActive) return;
            const delta = window.scrollY - startScrollY;
            const prog  = clamp01(delta / window.innerHeight);
            path.attr('stroke-dashoffset', L * (1 - prog));

            // show tooltip only while drawing
            const tooltip = document.getElementById('chart-tooltip');
            if (prog > 0 && prog < 1) {
                // 1) compute the exact point on the path
                const pt = path.node().getPointAtLength(prog * L);

                // 2) position tooltip (accounting for margins)
                const svgContainer = document.getElementById('corp-own-chart');
                const { top: svgTop, left: svgLeft } = svgContainer.getBoundingClientRect();
                const { top: parentTop, left: parentLeft } = stickyContainer.getBoundingClientRect();

                tooltip.style.left = `${parentLeft + (svgLeft - parentLeft) + pt.x + margin.left}px`;
                tooltip.style.top  = `${parentTop + (svgTop - parentTop) + pt.y + margin.top}px`;

                // 3) pick the nearest year
                const bisect = d3.bisector(d => d.year).left;
                const idx = Math.min(nested.length - 1, bisect(nested, x.invert(pt.x)));
                const year = nested[idx].year;
                const description  = descriptions[year];

                if (description) {
                    tooltip.innerText   = `${description}`;
                    tooltip.style.display = 'block';
                } else {
                    
                }
                                
            } else {
                tooltip.style.display = 'none';
            }

            if (prog >= 1) {
                drawingActive = false;
                window.removeEventListener('scroll', drawOnScroll);
                stickyContainer.classList.remove('sticky');
                const h = stickyContainer.getBoundingClientRect().height;
                window.scrollBy(0, -h);
            }
        }

        // in case you’re already scrolled past when mounting
        drawOnScroll();



        window.addEventListener('scroll', drawOnScroll, { passive: true });
        // one initial draw in case you’re already half-way scrolled:
        drawOnScroll();
        
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


        async function loadHOLCZestimates() {
            const raw = await d3.json(`${base}/data/category_zestimate_averages.json`);

            const colorMap = {
                'Best': '#76a865',
                'Still Desirable': '#74c3e3',
                'Definitely Declining': '#ffff00',
                'Hazardous': '#d9838d',
                'Industrial': '#000000',
                'Commercial': '#000000',
                'N/A': '#808080'
            };

            const categories = Object.keys(raw);
            const color = d3.scaleOrdinal()
                .domain(categories)
                .range(categories.map(c => colorMap[c]));


            const allData = [];
            categories.forEach(category => {
                for (const [year, obj] of Object.entries(raw[category])) {
                    allData.push({
                        category,
                        year: +year,
                        avg: obj.average_zestimate
                    });
                }
            });

            const container = document.getElementById('zestimate-chart');
            if (!container) {
                console.warn('⚠️ couldn’t find #zestimate-chart in the DOM');
                return;
            }

            const margin = { top: 40, right: 20, bottom: 100, left: 100 };
            const { width: totalW, height: totalH } = container.getBoundingClientRect();
            const width  = totalW  - margin.left - margin.right;
            const height = totalH  - margin.top  - margin.bottom;

            const svg = d3.select("#zestimate-chart")
                .append("svg")
                .attr("width", totalW)
                .attr("height", totalH)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                .domain(d3.extent(allData, d => d.year))
                .range([0, width]);
            const y = d3.scaleLinear()
                .domain([0, d3.max(allData, d => d.avg)]).nice()
                .range([height, 0]);

            const xAxis = d3.axisBottom(x)
                .tickFormat(d3.format('d'))
                .tickPadding(15);
            const yAxis = d3.axisLeft(y)
                .tickFormat(d => `$${d3.format('.2s')(d)}`)
                .tickPadding(15);

            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(xAxis)
            .selectAll('text')
                .style('font-family', 'Roboto, sans-serif')
                .style('font-size', '19px');

            svg.append('g')
                .call(yAxis)
            .selectAll('text')
                .style('font-family', 'Roboto, sans-serif')
                .style('font-size', '19px');

            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom - 30)
                .attr('text-anchor', 'middle')
                .style('font-family', 'Roboto, sans-serif')
                .style('font-size', '20px')
                .text('Year');

            svg.append('text')
                .attr('transform', `rotate(-90)`)
                .attr('x', -height / 2)
                .attr('y', -margin.left + 15)
                .attr('text-anchor', 'middle')
                .style('font-family', 'Roboto, sans-serif')
                .style('font-size', '20px')
                .text('Average Zestimate');

            const nested = d3.groups(allData, d => d.category);

            const line = d3.line()
                .x(d => x(d.year))
                .y(d => y(d.avg));

            nested.forEach(([category, values]) => {
                svg.append('path')
                    .datum(values.sort((a, b) => a.year - b.year))
                    .attr('fill', 'none')
                    .attr('stroke', color(category))
                    .attr('stroke-width', 3)
                    .attr('d', line);
            });

            const legend = d3.select("#legend")
                .append('ul')
                .style('list-style', 'none')
                .style('padding', '0')
                .style('margin', '2em auto')
                .style('display', 'flex')
                .style('flex-wrap', 'wrap')
                .style('justify-content', 'center')
                .selectAll('li')
                .data(categories)
                .enter()
                .append('li')
                .style('margin', '0 1em')
                .style('display', 'flex')
                .style('align-items', 'center');

            legend.append('span')
                .style('display', 'inline-block')
                .style('width', '12px')
                .style('height', '12px')
                .style('margin-right', '8px')
                .style('border', '1px solid #4f5152')
                .style('background-color', d => color(d));

            legend.append('span')
                .text(d => d);
        }
        loadHOLCZestimates();

        homes = Array.from(new Set(homes.map(home => home.Address)))
            .map(address => homes.find(home => home.Address === address));

        const selectedHomeAddresses = [
            "2 Front Street, Natick, MA 01760-6019, USA", 
            "37 Halliday Street, Boston, MA 02131-2210, USA", 
            "15 Fensmere Road, Boston, MA 02132-6011, USA"
        ];

        notiBoughtHomes = homes.filter(home => 
            selectedHomeAddresses.includes(home.Address)
        );

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
    <h1 id="title">AUTOMATION AND SPECULATION</h1>
    <p class="typewriter-line" id="typewriter"></p>
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

        <!-- a spacer so you actually scroll past before zoom begins -->
        <div class="scrolly-step" style="height:0vh"></div>

        <!-- this step holds the “Imagine” text + zooming image -->
        <div class="scrolly-step zoom-house-step" use:intersectionObserver style="height:100vh;">
            <div class="zoom-house-container right">
                <img
                    id="zoom-house"
                    src={house16}
                    alt="Zooming house"
                    class = "outline"
                    style="transform: translateY(-50%) scale({scale}); opacity: {opacity};"
                />
            
                <div class="zoom-house-text">
                    <p> Imagine this. <strong>You’re about to sell your home.</strong> Normally, you'd tidy it up, stage it carefully, list it, and wait. You'd negotiate with buyers, navigate offers, and hope for the best possible outcome. But now, imagine instead—a click. Just one. A machine makes you an offer in seconds. No waiting, no uncertainty, no endless walkthroughs. Your buyer isn't a person—<strong>it's a machine.</strong> </p>

                    <p class="note">
                        Note: All depicted houses are currently on the Greater Boston housing market on Zillow.
                    </p>
                </div>
            </div>
          </div>


        <!-- more content so you can scroll past -->
        <div class="scrolly-step" style="height:20vh"></div>

        <!-- bubble falling -->
        {#if pageProgress >= 0.2 && pageProgress <= 0.5}
            <div class="bubbles">
                {#each [zillowlogo, opendoorlogo, offerpadlogo, redfinlogo] as logo, i}
                <div class="bubble" style="top: {bubblesY[i]}vh;">
                    <img src={logo} alt="iBuyer logo" />
                </div>
                {/each}
            </div>
        {/if}


        <div class="scrolly-step zoom-house-step" use:intersectionObserver style="height:100vh;">
            <div class="zoom-house-container left">
                <div class="zoom-house-text">
                    <p>
                        This is not science fiction; it's happening now through <strong>iBuying</strong>. 
                    </p>

                    <p>
                        Instant buying, or "iBuying," uses algorithms to evaluate your home and make a frictionless offer. Companies like Zillow, Opendoor, Offerpad, and Redfin have become major players, snapping up homes across America at scale. In fact, they purchased <strong>1% of all U.S. Homes in 2021</strong>.
                    </p>

                    <p>
                        On the surface, this seems simple: a transaction at the speed of software. But speed obscures something deeper. Because this isn’t just about buying houses. <strong>It’s about how the algorithm sees value</strong>. It’s about which homes get chosen, which neighborhoods are entered—and which are avoided.
                    </p>
                </div>
            </div>
        </div>

        <div class="scrolly-step" style="height:20vh"></div>


        <div class="scrolly-step zoom-house-step" use:intersectionObserver style="height:100vh;">
            <div class="zoom-house-container center">
                <div class="zoom-house-text">
                    <p>
                        As iBuyers rapidly expand—buying homes from Boston to Phoenix—their decisions aren't just commercial; <strong>they're reshaping communities</strong>. These algorithmic buyers don't just influence housing markets; they have the power to perpetuate historical inequalities or to challenge them.
                    </p>
                    <p>
                        <strong>This project contextualizes iBuying practices in the Greater Boston Area.</strong> Which homes get chosen—and why? Are the prices fair, or are biases quietly embedded in the algorithms themselves? By mapping Boston’s historically redlined neighborhoods, analyzing pricing data, and visualizing patterns of corporate ownership, we uncover how automated speculation impacts real lives, real homes, and real communities.
                    </p>
                </div>
            </div>
        </div>

        <!-- VIZ only shows once you've scrolled through all previous steps -->
        <svelte:fragment slot="viz">

            <div class="after-todo">  
                
            <div id="sticky-container">
                <div class="chart-text">
                    <p> Corporate ownership quietly reshapes who gets to call Boston home—not by moving into neighborhoods, but by betting on their future. These firms don't buy homes to live in them; they speculate, relying increasingly on algorithms rather than human intuition. iBuying is just one form of corporate speculation, wherein companies use these algorithms to make direct housing offers. </p>
                    <p> Scroll down to explore the visualization and watch corporate speculation quietly but unmistakably alter Boston’s housing landscape. </p>
                </div>
                <div id="chart-wrapper" style="max-width:900px; margin:3em auto 0; text-align:center;">
                    <div id="chart-tooltip" class="dialogue-box"></div>
                    <h2 class="chart-title">Corporate Ownership Rate Over Time</h2>
                    <div id="corp-own-chart" style="width:100%; height:500px;"></div>
                </div>
            </div>


            <div class="post-chart">
                <br><br><br><br>
                <h1 style="text-align: center;">Data Collection— The Presence of iBuying in Boston</h1>
                <div style="max-width: 800px; margin: 0 auto; text-align: left;">
                    <p>How do you find a hidden market? While the previous chart focused broadly on corporate speculation in Boston, our analysis wishes to look at iBuying in particular. To do this, we turned to the <a href="https://www.masslandrecords.com/">Mass Land Records</a>, searching for key names like Opendoor, Zillow, Redfin, and Offerpad—the big players identified in <a href="https://dl.acm.org/doi/pdf/10.1145/3630106.3659027">prior research</a>. 
                    </p> 
                    <p>Using this simple but powerful method, we uncovered <b>407</b> homes purchased by iBuyers between 2019 and 2025. Of course, this likely understates the true figure: not every transaction may cleanly announce itself in the records. In other words, the story of iBuying in Boston may be even bigger than these numbers suggest. </p>
                </div>

                
                <h1 style="text-align: center;">Which of these homes are <em>not</em> iBought?</h1>
                <p style="text-align: center;">Click on a home to select it and learn more about it.</p>
                <div class="home-selection">
                    {#each notiBoughtHomes as home}
                        <div class="home-card-wrapper">
                            <button 
                                class="home-card" 
                                on:mouseover={() => hoveredHouse = home} 
                                on:mouseout={() => hoveredHouse = null} 
                                on:focus={() => hoveredHouse = home} 
                                on:blur={() => hoveredHouse = null} 
                                on:click={() => selectedHouse = home}
                                class:selected={selectedHouse === home}
                                aria-pressed={selectedHouse === home}
                                aria-label={`Select House ${home}`}
                            >
                                <div class="image-container">
                                    <img 
                                        src={home.photoURL} 
                                        alt={`${home}`} 
                                        class:grayscale={hoveredHouse !== home && selectedHouse !== home}
                                    />
                                </div>
                            </button>
                        </div>
                    {/each}
                </div>
    
                {#if selectedHouse !== null}
                    <div class="house-details">
                        <h2>This is <em>{selectedHouse.Address}</em></h2>
                        <p>This is an iBought home!</p>
                        <p>
                            Originally built in {selectedHouse.yearBuilt}, it was last sold for <b>${selectedHouse.price}</b>, while its most recent Zestimate is <b>{selectedHouse.zestimate ? "$" + selectedHouse.zestimate : "unknown"}</b>.
                        </p>
                        <p>
                            The home features {selectedHouse.bedrooms || "an unknown number of"} bedrooms and {selectedHouse.bathrooms || "an unknown number of"} bathrooms. It spans {selectedHouse.livingAreaValue} square feet of living area total.
                        </p>
                    </div>
                {/if}

                <div style="max-width: 800px; margin: 0 auto; text-align: left;">
                    <br><br><br><br><br><br><br><br>
                    <p>In this qualitative analysis, the message is clear: <b>iBuying is not a single, monolithic strategy</b>. There is no typical mold for an iBought home. This diversity reminds us that while the term "iBuying" suggests a single model, in practice it covers a range of strategies.</p>
                </div>

                <h1 id="redlining" style="text-align: center;">🏠 iBought Homes Contexutalized with Historically Redlined Districts 🏠</h1>    
                <div style="max-width: 800px; margin: 0 auto; text-align: left;">
                    <p>iBought homes tend to be in areas that were historically redlined as <b><span style="color: #d9838d;">hazardous</span></b> and <b><span style="color: goldenrod">definitely declining areas</span></b>, suggesting long‑lasting effects of historical redlining.<br><br>
                    </p>
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

            <h1 style="text-align: center;">💸 Everything's Getting Expensive! 💸</h1>
            <div id="sticky-container">
                <div class="chart-text">
                    <p>Corporate speculation doesn't just buy homes: it predicts and bets on entire neighborhoods. Here's how the average Zestimates for iBought homes have changed for each historic HOLC district category.</p>
                </div>
                <div id="chart-wrapper" style="max-width:900px; margin:3em auto 0; text-align:center;">
                    <div id="chart-tooltip" class="dialogue-box"></div>
                    <h2 class="chart-title">Average Zestimate Trends by HOLC District.</h2>
                    <div id="zestimate-chart" style="width:100%; height:500px;"></div>
                    <div id="legend"></div>
                </div>
            </div>

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
                        {#each homes as home}
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
                        <li><span style="display: inline-block; width: 12px; height: 12px;
                                        background-color: white; border: 1px solid #4f5152; 
                                        border-radius: 50%; margin-right: 8px;"></span>Sold for price unknown</li>

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
                <li>iBuying is prevalent in Boston, especially for more affordable housing.</li>
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
