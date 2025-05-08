<style>
    .container {
        position: relative;
        display: flex;
        width: 100%;
        height: 600px;
        --split-position: 50%;
    }

    .map-container {
        width: var(--split-position);
        transition: width 0.1s;
        height: 100%;
        overflow: hidden;
    }

    .slider {
        width: 8px;
        cursor: col-resize;
        background: #888;
        position: absolute;
        top: 0;
        bottom: 0;
        left: var(--split-position);
        transform: translateX(-50%);
        z-index: 10;
    }
</style>

<script>
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
    import 'mapbox-gl/dist/mapbox-gl.css';

    let leftMapContainer;
    let rightMapContainer;
    let slider;
    let container;
    let isDragging = false;
    

    onMount(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaW5hLW1hbmNvcmlkaXMiLCJhIjoiY205NXBjZmx3MWNkZjJzcHc0dDVlYXFodCJ9.mS5MAGr-YmpGput97-3htA';
    
        new mapboxgl.Map({
            container: rightMapContainer, // HTML element ID
            style: 'mapbox://styles/marina-mancoridis/cm95pzaws009901qt26z24os9',
            center: [-71.1056, 42.3736], // Cambridge/Boston (longitude, latitude)
            zoom: 11.5,
            minZoom: 10,
            maxZoom: 18
        });

        new mapboxgl.Map({
            container: leftMapContainer, // HTML element ID
            style: 'mapbox://styles/marina-mancoridis/cm95pzaws009901qt26z24os9',
            center: [-71.1056, 42.3736], // Cambridge/Boston (longitude, latitude)
            zoom: 11.5,
            minZoom: 10,
            maxZoom: 18
        });

        // Mouse events for dragging the slider
        const onMouseMove = (e) => {
            if (!isDragging) return;

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;

            const percentage = (x / rect.width) * 100;
            container.style.setProperty('--split-position', `${percentage}%`);
        };

        const onMouseUp = () => {
            isDragging = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        slider.addEventListener('mousedown', () => {
            isDragging = true;
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    });
  </script>

<div bind:this={container} class="container">
    <div bind:this={leftMapContainer} class="map-container"></div>
    <div bind:this={slider} class="slider"></div>
    <div bind:this={rightMapContainer} class="map-container"></div>
</div> 