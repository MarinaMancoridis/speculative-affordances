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
            console.log("ratio:", entry.intersectionRatio, "isIntersecting:", entry.isIntersecting);
            if (entry.intersectionRatio >= 0.5 && !drawingActive) {
                console.log("🚀 Sticking wrapper now");
                wrapper.classList.add('fixed');
                disableNativeScroll();
                startDrawing();
                drawingActive = true;
                startScrollY = window.scrollY;
                stickObserver.disconnect();
            }
        },
        { threshold: 0.5 }
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
      
      function drawFromDelta(deltaY) {
        // compute prog ∈ [0,1]
        const prog = clamp01(deltaY / (window.innerHeight * scrollSensitivity));
        path.attr('stroke-dashoffset', L * (1 - prog));
      
        // your existing tooltip logic …
        // …
        
        if (prog >= 1) {
          finishDrawing();
        }
      }
      
      function startDrawing() {
        drawingActive = true;
        accumulated = 0;
        window.addEventListener('wheel', onWheel, { passive: false });
      }
      
      function finishDrawing() {
        drawingActive = false;
        window.removeEventListener('wheel', onWheel);
        wrapper.classList.remove('fixed');
        enableNativeScroll();
      
        // adjust scroll so you’re not hiding next section under the chart
        const h = wrapper.getBoundingClientRect().height;
        window.scrollBy(0, -h);
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


            const svgRect = document.getElementById('corp-own-chart')
                     .getBoundingClientRect();

            tooltip.style.left = `${svgRect.left + pt.x + margin.left}px`;
            tooltip.style.top  = `${svgRect.top  + pt.y + margin.top}px`;

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
            // window.scrollBy(0, -h);
        }
    }



    // window.addEventListener('scroll', drawOnScroll, { passive: true });
    // one initial draw in case you’re already half-way scrolled:
    drawOnScroll();
}