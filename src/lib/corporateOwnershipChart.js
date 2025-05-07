import * as d3 from "d3";

 
export async function renderCorporateOwnershipChart(
    base,       // your Svelte `base` path
    chartId,    // e.g. "corp-own-chart"
    stickyId,   // e.g. "sticky-container"
    wrapperId,  // e.g. "chart-wrapper"
    tooltipId   // e.g. "chart-tooltip"
  )  {
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
        2018: "Zillow began purchasing homes outright; its first acquisition was a four-bedroom bungalow in Arizona, and by quarter’s end it had bought 19 Phoenix-area properties [2].",
        2020: "Operating in 25 markets, Zillow drew criticism by hiring full-time, salaried agents for its iBuying arm—an initiative Zillow argued improved user experience, but many U.S. realtors viewed as an aggressive market incursion [2].",
        2022: "The FTC charged Opendoor with misleading homeowners by promising they would receive true market value for their homes [3].",
        2024: "Following the FTC investigation, nearly 62 million dollars in refunds were issued to sellers who had been misled by Opendoor Labs’ online listing service [3]."
    };

    // check chart container
    const container = document.getElementById("corp-own-chart");
    // make sure tooltip is in the chart container, positioned absolutely
    const tooltip   = document.getElementById(tooltipId);
    Object.assign(tooltip.style, {
        position:      'absolute',
        pointerEvents: 'none',
        display:       'none',
        width:         '240px',
        height:        'auto',
        maxWidth:      '240px',       // wrap no wider than this
        padding:       '8px',
        boxSizing:     'border-box',
        whiteSpace:    'normal',      // allow wrapping
        wordWrap:      'break-word',
        zIndex:        10000,
        transform:     'translate(0, -100%)'  
        // ↓ no horizontal shift, just shift UP by own height
      });
    


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
            console.log("ratio:", entry.intersectionRatio, "isIntersecting:", entry.isIntersecting);
            if (entry.intersectionRatio >= 1 && !drawingActive) {
                console.log("🚀 Sticking wrapper now");
                wrapper.classList.add('fixed');
                disableNativeScroll();

                const marginBottom = margin.bottom; // from your chart code, e.g. 100

                // grab original wrapper bounds & computed margins
                const rect = wrapper.getBoundingClientRect();
                const cs   = getComputedStyle(wrapper);
                const marginTop = parseFloat(cs.marginTop);
                const marginBot = parseFloat(cs.marginBottom);

                // create the placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'chart-placeholder';
                placeholder.style.height = `${rect.height}px`;
                placeholder.style.marginTop    = `${marginTop}px`;
                placeholder.style.marginBottom = `${marginBot}px`;

                // stick it into the DOM right before your wrapper
                wrapper.parentNode.insertBefore(placeholder, wrapper);

                // now fix your wrapper in place…
                Object.assign(wrapper.style, {
                position:  'fixed',
                top:       `${Math.max(0, rect.top - marginTop)}px`,
                left:      '50%',
                transform: 'translateX(-50%)',
                width:     `${rect.width}px`,
                height:    `${rect.height}px`,
                overflow:  'visible',
                background:'white',
                zIndex:    999
                });

                // 4) lock page scroll & start your wheel/touch animation
                document.body.style.overflow = 'hidden';
                startDrawing();
                drawingActive = true;
                startScrollY = window.scrollY;
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

    function disableNativeScroll() {
        document.body.style.overflow = 'hidden';
      }
      function enableNativeScroll() {
        document.body.style.overflow = '';
      }
      let accumulated = 0;
      const scrollSensitivity = 3;  // bigger = slower
      
      function onWheel(e) {
        e.preventDefault();           // STOP the page from moving
        accumulated += e.deltaY;      // positive when user scrolls down
        drawFromDelta(accumulated);
      }

      function updateTooltip(prog) {
        if (prog <= 0 || prog >= 1) {
          tooltip.style.display = 'none';
          return;
        }
      
        const pt = path.node().getPointAtLength(prog * L);
        const xLocal = pt.x + margin.left;
        const yLocal = pt.y + margin.top;
      
        const year = Math.round(x.invert(pt.x));
        const desc = descriptions[year];
        if (!desc) {
          tooltip.style.display = 'none';
          return;
        }
      
        tooltip.innerText     = desc;
        tooltip.style.display = 'block';
      
        // position at the raw point
        tooltip.style.left = `${xLocal + 10}px`;
        tooltip.style.top  = `${yLocal + 50}px`;
      
        // choose anchor based on year
        // if (year >= 2020) {
        //   // bottom-left: put tooltip below the point, left edge aligned
        //   tooltip.style.transform = 'translate(0, 0)';
        //   // if you want it slightly below: uncomment next line
        //   // tooltip.style.top = `${yLocal + 8}px`;
        // } else {
        //   // top-right: put tooltip above the point, right edge aligned
        //   tooltip.style.transform = 'translate(-100%, -100%)';
        //   // if you want it slightly above/left: tweak with +/- px here
        // }
      
        // clamp to wrapper bounds if necessary
        const wrapperWidth = wrapper.clientWidth;
        const ttRightEdge = xLocal + tooltip.offsetWidth * (year < 2020 ? -1 : 1);
        // if (year < 2020) {
        //     // if top-right would overflow left, force bottom-left
        //     tooltip.style.left = `${xLocal + 10}px`;
        //     tooltip.style.top     = `${yLocal + 50}px`;
        // // } else if (year >= 2020) {
        // //   tooltip.style.transform = 'translate(-150%, 0)';
        // }
      }
      
      
      
      
      
      function drawFromDelta(deltaY) {
        // compute prog ∈ [0,1]
        const prog = clamp01(deltaY / (window.innerHeight * scrollSensitivity));
        path.attr('stroke-dashoffset', L * (1 - prog));
      
        // ========== Tooltip logic ===============
        const tooltip = document.getElementById(tooltipId);
        updateTooltip(prog);
        // =========================================
        
        if (prog >= 1) {
            finishDrawing();

            // remove your fixed‐position styles:
            wrapper.removeAttribute('style');

            // restore normal scrolling
            document.body.style.overflow = '';
        }
      }
      
      function startDrawing() {
        drawingActive = true;
        document.body.classList.add('drawing');
        accumulated = 0;
        window.addEventListener('wheel', onWheel, { passive: false });
      }
      
      function finishDrawing() {
        drawingActive = false;
        window.removeEventListener('wheel', onWheel);
        wrapper.classList.remove('fixed');
        enableNativeScroll();
        document.body.classList.remove('drawing');

        // remove exactly that placeholder
        const placeholder = document.querySelector('.chart-placeholder');
        if (placeholder) placeholder.remove();


        wrapper.style.position  = '';
        wrapper.style.top       = '';
        wrapper.style.left      = '';
        wrapper.style.transform = '';
        wrapper.style.width     = '';
        wrapper.style.height    = '';
        wrapper.style.overflow  = '';
        wrapper.style.background= '';
        wrapper.style.zIndex    = '';
      
        document.body.style.overflow = '';

        tooltip.style.display = 'none';
      
        // adjust scroll so you’re not hiding next section under the chart
        const h = wrapper.getBoundingClientRect().height;
        window.scrollBy(0, 0);
      }


    function drawOnScroll() {
        if (!drawingActive) return;
        const delta = window.scrollY - startScrollY;

        const scrollSensitivity = 3; // adjust this number to change scroll speed (higher = slower)
        const prog = clamp01(delta / (window.innerHeight * scrollSensitivity));
        path.attr('stroke-dashoffset', L * (1 - prog));

        // show tooltip only while drawing
        const tooltip = document.getElementById('chart-tooltip');
        if (prog > 0 && prog < 1) {
            // 1) compute the exact point on the path
            const pt = path.node().getPointAtLength(prog * L);

            // 2) position tooltip (accounting for margins)
            const svgContainer = document.getElementById('corp-own-chart');


            const svgRect = document
            .getElementById("corp-own-chart")
            .getBoundingClientRect();

            // NO extra + margin here!
            tooltip.style.left = `${svgRect.left + pt.x}px`;
            tooltip.style.top  = `${svgRect.top  + pt.y}px`;

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
            const h = stickyContainer.getBoundingClientRect().height;
            window.removeEventListener('scroll', drawOnScroll);
            wrapper.classList.remove('fixed');
            unlockPageScroll();

            const rect = wrapper.getBoundingClientRect();
            window.scrollBy(0, -rect.height);
        }
    }



    // window.addEventListener('scroll', drawOnScroll, { passive: true });
    // one initial draw in case you’re already half-way scrolled:
    drawOnScroll();
}