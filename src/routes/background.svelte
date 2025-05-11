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
        <br><br><br>
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
      <p><b>Could algorithmic home-buying inadvertently worsen inequality?</b> While we did not find <i>direct</i> evidence that iBought homes were predominantly located in communities of color, we did observe that iBuyers consistently purchased affordable housing at discounted prices—a practice that risks disproportionately affecting marginalized groups. Prior research has explored the relationship between iBuying and inequality; for completeness, we summarize some findings here.</p> <p><b>Previous studies highlight that iBuying can amplify housing inequalities.</b> <a href="https://dl.acm.org/doi/abs/10.1145/3630106.3659027">Slaughter, Brown, and Weber [5]</a> found that iBuyers extended real estate harms—traditionally concentrated among Black homeowners—to White homeowners as well, with losses of approximately $4,000 for Black sellers and $27,000 for White sellers in Mecklenburg County, NC. Additionally, <a href="https://www.tandfonline.com/doi/full/10.1080/07352166.2024.2415936">Wonyoung So [6]</a> identified a positive correlation between iBuyer profit margins and the proportion of marginalized racial groups in census tracts, raising concerns that iBuyers may maximize profits at the expense of communities of color. Since iBuyers often resell to institutional investors <a href="https://dl.acm.org/doi/abs/10.1145/3630106.3659027">[5]</a> and inflate home prices <a href="https://link.springer.com/article/10.1007/s11146-023-09954-z">[7]</a>, these practices could reshape property ownership and displace locals.</p> <p><b>Our analysis in the Greater Boston Area aligns with these concerns.</b> We found homeowners lost an average of $11,311 when selling to iBuyers, measured by the difference between selling price and the home’s Zestimate for that year. Additionally, iBuyers mainly targeted affordable housing: 75% of iBought homes were valued below Boston's median home price ($710,400) <a href="https://www.census.gov/quickfacts/fact/table/bostoncitymassachusetts/PST045224">[8]</a>, and 95% were priced under $1,000,000.</p>
  </div>
</div>
<br><br><br><br>