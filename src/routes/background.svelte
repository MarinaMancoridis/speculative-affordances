<script>
    import { onMount } from 'svelte';
    let sectionEl;

    export let homes;

    let averageDifference = 0;
    let percentUnderThreshold = 0;
    
    onMount(() => {
      if (typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(animateCounters, 1000);
            obs.disconnect();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(sectionEl);

      // Get % of homes under the median value of owner-occupied housing units, 2019-2023
      const pricedHomes = homes.filter(item => item.price !== undefined);
      const underThreshold = pricedHomes.filter(item => item.price < 710400);
      percentUnderThreshold = (underThreshold.length / pricedHomes.length) * 100;
      console.log(`% of homes under $710,400: ${percentUnderThreshold.toFixed(2)}%`);

      // Get total dollars lost 
      let totalDifference = 0;
      let validHomeCount = 0;

      homes.forEach(home => {
        const price = parseFloat(home.price);
        const zestimate = parseFloat(home.matchedZestimate);

        if (!isNaN(price) && !isNaN(zestimate)) {
          totalDifference += (price - zestimate);
          validHomeCount++;
          }
      });

      averageDifference = validHomeCount > 0 ? totalDifference / validHomeCount : 0;

      // console.log(validHomeCount)
      // console.log(`Total difference: $${totalDifference.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      // console.log(`Average difference per home: $${averageDifference.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    });
  
    function animateCounters() {
      const counters = sectionEl.querySelectorAll('.counter');
      counters.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1000;
        const interval = 20;
        const steps = duration / interval;
        const increment = target / steps;
        let count = 1;
        el.textContent = `${count}${suffix}`;
  
        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            el.textContent = `${Number(target).toLocaleString()}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${Math.floor(count).toLocaleString()}${suffix}`;
          }
        }, interval);
      });
    }
  </script>

<br><br><br><br>
<h1 style="text-align: center;">iBuying is Targeting Affordable Housing and Impacting Communities</h1>
<div
  id="data-collection"
  bind:this={sectionEl}
  style="
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    max-width: 1200px;
    margin: 0 auto;
    /* you can still tweak this if you want extra space */
    gap: 2em;
  "
>
    <!-- right: the four counters -->
    <div
    id="stats"
    style="
      /* shrink-to-fit its contents */
      flex: 0 0 40%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    "
  >
        <br>
        <div style="font-size: 3em; color: #e63946; text-align: center;">
            -$<span class="counter" data-target="11311">0</span>
            <div class="unit">Dollars Lost by Selling to an iBuyer</div>
            </div>
        
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        <div style="font-size: 3em; color: #457b9d; text-align: center;">
        <span class="counter" data-target="75" data-suffix="%">0</span>
        <div class="unit">iBought Homes Sold Below Median Value</div>
        </div>
        
    </div>

    <div style="flex: 1; text-align: left;">
      <p>While we did not find evidence that iBought homes were primarily located in communities of color, 
        we did find that iBuyers tend to purchase more affordable housing at a discount, 
        which can disproportionately impact historically marginalized groups.</p> 
        
        <p>Prior work by Isaac Slaughter, Eva Maxfield Brown, and Nic Weber [5] found that 
        <i>"iBuyers are equalizing housing outcomes by extending real estate harms typically isolated to
          Black homeowners to White homeowners as well."</i>  They found that Black home sellers lost around $4,000 
          by selling their home to an iBuyer and White homesellers lost around $27,000 in Mecklenburg County, North Carolina.</p>

          <p>In our analysis within the Greater Boston Area, we also found that homesellers lost money by selling to iBuyers 
          with an average loss of around $11,311, comparing the home's selling price to its Zestimate in that year.</p>
          
          <p>We also found that iBuyers targeted affordable housing options in a variety of communities. 
          Most iBought homes in the Greater Boston area (75%) were less than the U.S. Census Boston median value ($710,400) and 
          95% were under $1,000,000.</p>

      <p>Other work by Wonyoung So [6] found a positive correlation between iBuyer's profit margins and 
        the proportion of marginalized racial groups within a census tract, and consquently illuminates this potential concern of iBuyers
        trying to maximize profits from homeowners in communities of color. 
        These iBuying practices also have the potential to reshape who owns property.
        Since iBuyers are more likely to sell to institutional investors [5] and increase home prices [7], 
        there is the risk of iBuying practices displacing local homeowners and residents.</p>
  </div>
</div>
<br><br><br><br>