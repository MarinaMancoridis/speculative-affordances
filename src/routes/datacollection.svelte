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

<h1 style="text-align: center;">Data Collection— The Presence of iBuying in Boston</h1>
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
        <p><b>How do you find a hidden market?</b> There is no public dataset of iBuying in the Greater Boston Area. While our previous chart focused more broadly on <i>corporate speculation</i> in Boston, our analysis wishes to look at iBuying in particular. 
        
        </p><p>Our analysis involved <b>creating our own dataset</b> of iBuying in the Greater Boston Area. To do this, we turned to the <a href="https://www.masslandrecords.com/">Mass Land Records</a>, searching for key names like Opendoor, Zillow, Redfin, and Offerpad—the big players in iBuying. This type of keyword matching is the approach that was used in <a href="https://dl.acm.org/doi/pdf/10.1145/3630106.3659027">prior research</a>. 
        </p> 
        <p>Using this simple but powerful method, we uncovered <b>407 homes purchased by iBuyers</b> between 2019 and 2025. <b>Features of our dataset are listed on the right.</b> </p>
            
        <p>Of course, this dataset likely understates the true figure: not every transaction may cleanly announce itself in the records. In other words, the story of iBuying in Boston may be even bigger than these numbers suggest. </p>
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
            <span class="counter" data-target="407">0</span>
            <div class="unit">Homes</div>
            </div>
        
        <div style="font-size: 3em; color: #457b9d; text-align: center;">
        <span class="counter" data-target="41" data-suffix="+">0</span>
        <div class="unit">Towns</div>
        </div>

        <div style="font-size: 3em; color: #e63946; text-align: center;">
            <span class="counter" data-target="17">0</span>
            <div class="unit">Cities</div>
        </div>

        <div style="font-size: 3em; color: #2a9d8f; text-align: center;">
        <span class="counter" data-target="13">0</span>
        <div class="unit">Search Names</div>
        </div>
        
    </div>
</div>
<br><br>