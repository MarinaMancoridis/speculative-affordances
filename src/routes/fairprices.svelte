<script>
    export let timeIndex;
    export let mapViewChanged;
    export let filteredHomes;
    export let getHomes;
    export let radiusScale;
    export let popupHome;
    export let timeScale;
    export let map;
</script>

<h1 style="text-align: center;">🏠 Are iBought Homes Sold for Fair Prices? 🏠</h1>
<div class="chart-text">
    <p><b>iBuyers say they purchase homes at fair market prices—but their own data tells another story.</b> In 2022, the FTC charged Opendoor with misleading sellers about receiving full market value, resulting in a $62 million settlement. Yet Opendoor didn’t retreat; instead, it expanded into more than 50 markets, including Boston.</p>
    <p><b>Why is a price sold below its Zestimate value "unfair"?</b> The Zestimate represents Zillow’s own estimate of a home’s market value—the price a home could reasonably fetch under normal market conditions. If an iBuyer purchases a home significantly below this estimate, it implies that the seller likely missed out on value they could have realized on the open market. Calling these prices "unfair" captures the idea that sellers, expecting a fair, market-value offer, instead received considerably less—revealing a discrepancy between what’s promised and what's delivered.</p> 
    <!-- <p>This visualization shows the history of iBuying activity and which homes were sold for less than their estimated price.</p> -->
    <p><b><i>Use the slider</i></b> to see iBuying activity changing by <b>Year</b>, and <b>Zestimate Value</b></p>
    <p><b><i>Click any circle</i></b> for details about each property.</p>
    <p><b><i>Move the map</i></b> to explore different parts of the Greater Boston Area.</p>
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
        <b>Year:</b>
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

<div class="chart-text">
    <p>We find that the vast majority of homes were sold for <b><span style="color: #644E8F;">less</span></b> than their Zestimates. This isn’t just a technicality; it reveals a systematic gap between promised "fair market value" and reality. <b>Sellers might be paying a hidden price for convenience</b>, leaving substantial value on the table.
    </p>
</div>