<script>
    import { onMount } from 'svelte';
    let sectionEl;
    
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
            el.textContent = `${target}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${Math.floor(count)}${suffix}`;
          }
        }, interval);
      });
    }
  </script>

<h1 style="text-align: center;">iBuying is Impacting Homeowners and Communities</h1>
<div
  id="data-collection"
  bind:this={sectionEl}
  style="
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    max-width: 1000px;
    margin: 0 auto;
    /* you can still tweak this if you want extra space */
    gap: 2em;
  "
>
    <div style="flex: 1; text-align: left;">
        <p>Prior work by Isaac Slaughter, Eva Maxfield Brown, and Nic Weber found that <i>"iBuyers are equalizing housing outcomes by extending real estate harms typically isolated to
            Black homeowners to White homeowners as well"</i> and <i>"iBuyers increase property conversion rates from individual to institutional ownership"</i> in Mecklenburg County, North Carolina.</p>

        <p>Other work by Wonyoung So has found that <i>"iBuyers compete with and crowd out potential local homeowners, forcing them into neighboring markets, and thereby causing home prices in these adjacent ZIP codes to increase as well."</i> </p>
        
        <p>In our analysis, we found a similar phenomen in Boston, Massachusetts where iBought homes were not located in primarily communities of color, but targeted affordable housing options in a variety of communities.</p> 
    </div>

    <!-- right: the four counters -->
    <div
    id="stats"
    style="
      /* shrink-to-fit its contents */
      flex: 0 0 35%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    "
  >
        <br>
        <div style="font-size: 3em; color: #f4a261; text-align: center;">
            $<span class="counter" data-target="4000">0</span>
            <div class="unit">Dollars Lost by Selling to an iBuyer</div>
            </div>
        
        <div style="font-size: 3em; color: #457b9d; text-align: center;">
        <span class="counter" data-target="25" data-suffix="+">0</span>
        <div class="unit">iBought Homes Sold to Investors</div>
        </div>
        
    </div>
</div>
<br><br><br><br>