<script>
import { onMount } from 'svelte';

let showViz = false; // Toggle state

// Function to initialize tableau when the div becomes visible
function initializeTableau() {
    if (!showViz || !window.tableau) return;

    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
        // Force tableau to scan for and initialize placeholders
        if (window.tableau.VizManager) {
            window.tableau.VizManager.refreshVizs();
        } else if (typeof window.tableau.Viz !== 'undefined') {
            // Find placeholder and initialize it manually if needed
            const placeholders = document.getElementsByClassName('tableauPlaceholder');
            if (placeholders.length > 0) {
                // Force tableau to re-scan for placeholders
                const evt = document.createEvent('Event');
                evt.initEvent('DOMContentLoaded', true, true);
                window.document.dispatchEvent(evt);
            }
        }
    }, 100);
}

function toggle() {
    showViz = !showViz
    initializeTableau();
}

onMount(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="viz_v1.js"]');

    if (!existingScript) {
        // Load the Tableau script if it doesn't exist
        const script = document.createElement('script');
        script.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
        script.onload = () => {
        if (showViz) {
            initializeTableau();
        }
        };
        document.head.appendChild(script);
    } else if (window.tableau) {
        // If script already exists and tableau is loaded, make it available to our initialize function
        if (showViz) {
            initializeTableau();
        }
    }
});
</script>

<style>
.btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.3em .6em;
    border-radius: 4px;
    background-color: transparent;
    border: 2px solid #644E8F;
    color: #644E8F;
    cursor: pointer;
    transition: background-color 0.2s ease;
    text-decoration: none;
    margin:auto;
}

.btn-outline:hover {
    background-color: rgba(100, 78, 143, 0.05);
}

.btn-outline:active {
    transform: translateY(1px);
}

.tableauPlaceholder {
    position: relative; 
    margin: auto;
    background: white;
    color: #000;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1em 1em .1em 1em;
    font-size: 0.95em;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tableauViz {
    width:1100px; 
    height:900px;
}
</style>
<div>
    <h1 style="text-align: center;">Currently Issued Refunds</h1>
    <div class="chart-text">
        <p><b>How transparent are iBuying companies with homeowners?</b> In the present day, the Federal Trade Commission's (FTC) case against Opendoor—mentioned in two previous visualizations—is actively issuing refunds to affected homeowners. Opendoor faced allegations from the FTC of misleading sellers by promising market-value offers while delivering significantly lower sale prices, resulting in substantial financial losses. Massachusetts homeowners continue to receive refunds, reflecting ongoing repercussions from these practices. (<a href="https://www.ftc.gov/enforcement/refunds/opendoor-refunds">More details from the FTC here.</a>)</p>

        <p><b>The Opendoor FTC case is still processing refunds.</b> Before exploring the visualization, ask yourself: what might be your guess for how many recipients there have been in Massachusetts, and the median refund amount? Click below for the official FTC refund dashboard: </p>

        <div style="display: flex; justify-content: center; align-items: center"><button class="btn-outline" on:click={toggle}>Click to view Opendoor refunds in MA</button></div>
    </div>
    {#if showViz}
        <div class='tableauPlaceholder' id='viz1746558020694'>
            <noscript>
                <a href='#'><img alt=' ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;PY&#47;PYDDXX29Q&#47;1_rss.png' style='border: none' /></a>
            </noscript>
            <object class='tableauViz'>
                <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> 
                <param name='embed_code_version' value='3' /> 
                <param name='path' value='shared&#47;PYDDXX29Q' /> 
                <param name='toolbar' value='yes' />
                <param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;PY&#47;PYDDXX29Q&#47;1.png' /> 
                <param name='animate_transition' value='yes' />
                <param name='display_static_image' value='yes' />
                <param name='display_spinner' value='yes' />
                <param name='display_overlay' value='yes' />
                <param name='display_count' value='yes' />
                <param name='language' value='en-US' />
            </object>
        </div>
    {/if}
</div>

