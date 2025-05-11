<script>
    export let mapViewChangedSwipe;
    export let homesSwipe;
    export let getHomesSwipe;

    // count per color
    $: colorCounts = homesSwipe.reduce((acc, home) => {
        const color = home.color;
        if (!acc[color]) {
        acc[color] = 0;
        }
        acc[color]++;
        return acc;
    }, {});
</script>

<br><br>
<h1 id="redlining" style="text-align: center;">🏠 iBought Homes Contexutalized with Historically Redlined Districts 🏠</h1>    
    <div style="max-width: 800px; margin: 0 auto; text-align: left;">
        <p>We're exploring not just where iBuying happens geographically, but <b>how it aligns with deeper patterns of inequality</b>. Beyond maps and neighborhoods, we're interested in understanding if iBuying intersects with historical discrimination. Redlining emerged prominently in the 1930s, driven by the Home Owners' Loan Corporation (HOLC). Through color-coded maps, the HOLC systematically labeled neighborhoods—often those home to minority communities—as <b><span style="color: #d9838d;">hazardous</span></b> or <b><span style="color: goldenrod">definitely declining areas</span></b>. These classifications effectively blocked residents from mortgages, credit, and equitable housing opportunities, creating lasting impacts.

        </p><p>By examining iBuying through the lens of these historical markers, we aim to uncover whether modern real estate practices might be echoing—or even amplifying—past inequities. <b>Could today's tech-driven transactions be shaped by the  shadow of yesterday's redlining?</b></p>
            
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
                    <circle { ...getHomesSwipe(homeSwipe) } r="10" fill={homeSwipe.color} fill-opacity="50%" stroke="black" stroke-width="2px" stroke-opacity="60%">
                    </circle> 
                    <text
                        x={getHomesSwipe(homeSwipe).cx}
                        y={getHomesSwipe(homeSwipe).cy}
                        font-size="10"
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
            <li><span style="margin-right: 8px;">🏠</span>iBought Home</li>
            
            <br>
            <label for="slider"><b>Redlining Map Opacity: </b></label>
            <input id="slider" type="range" min="0" max="75" step="1" value="50">
        </div>
    </div>
</div>
<div style="max-width: 800px; margin: 0 auto; text-align: left;">
<p>We find that iBought homes that fall within historically redlined residential areas were
    more likely to be labeled as <b><span style="color: #d9838d;">hazardous (23%)</span></b> and <b><span style="color: goldenrod">definitely declining areas (58%)</span></b>, 
        as opposed to  <b><span style="color: #76a865;">best (2%)</span></b> and  <b><span style="color: #74c3e3;">still desirable (17%)</span></b>.<br><br><br>
</p></div>

<!-- <div>
    <h3>🏠 iBought Homes by Color</h3>
    <ul>
      {#each Object.entries(colorCounts) as [color, count]}
        <li>
          <span style="display: inline-block; width: 12px; height: 12px; background-color: {color}; margin-right: 8px;"></span>
          {count} home(s)
        </li>
      {/each}
    </ul>
  </div>  -->