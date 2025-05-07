<script>
    import { base } from '$app/paths';
    import * as d3 from "d3";
    import { onMount } from "svelte";

    let isGraphVisible = false;
    const animationHalfDurMS = 3000;

    onMount(async () => {
        const raw = await d3.json(`${base}/data/category_zestimate_averages.json`);

        const colorMap = {
            'Best': '#76a865',
            'Still Desirable': '#74c3e3',
            'Definitely Declining': '#ffd700',
            'Hazardous': '#d9838d',
            'Industrial': '#000000',
            'Commercial': '#000000',
            'N/A': '#808080'
        };

        const categories = Object.keys(raw);
        const color = d3.scaleOrdinal()
            .domain(categories)
            .range(categories.map(c => colorMap[c]));

        const allData = [];
        const yearlyAverages = {};
        const iBoughtAverages = [];

        // Calculate yearly averages and prepare data
        categories.forEach(category => {
            for (const [year, obj] of Object.entries(raw[category])) {
                const yearNum = +year;
                if (!yearlyAverages[yearNum]) {
                    yearlyAverages[yearNum] = { total: 0, count: 0 };
                }
                yearlyAverages[yearNum].total += obj.average_zestimate * obj.count;
                yearlyAverages[yearNum].count += obj.count;

                allData.push({
                    category,
                    year: yearNum,
                    avg: obj.average_zestimate
                });
            }
        });

        // Calculate the difference from the yearly average
        allData.forEach(d => {
            const yearlyAvg = yearlyAverages[d.year].total / yearlyAverages[d.year].count;
            d.diffFromAvg = d.avg - yearlyAvg;
        });

        // Prepare iBought averages (baseline line at y=0)
        Object.entries(yearlyAverages).forEach(([year, { total, count }]) => {
            iBoughtAverages.push({ year: +year, avg: total / count });
        });

        // Set up the graph
        const container = document.getElementById('zestimate-chart');
        if (!container) {
            console.warn("⚠️ couldn't find #zestimate-chart in the DOM");
            return;
        }

        const margin = { top: 40, right: 150, bottom: 100, left: 150 };
        const { width: totalW, height: totalH } = container.getBoundingClientRect();
        const width = totalW - margin.left - margin.right;
        const height = totalH - margin.top - margin.bottom;

        const svg = d3.select("#zestimate-chart")
            .append("svg")
            .attr("width", totalW)
            .attr("height", totalH)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain(d3.extent(allData, d => d.year))
            .range([0, width]);
        const y = d3.scaleLinear()
            .domain(d3.extent(allData, d => d.diffFromAvg)).nice()
            .range([height, 0]);

        const xAxis = d3.axisBottom(x)
            .tickFormat(d3.format('d'))
            .tickPadding(15);
        const yAxis = d3.axisLeft(y)
            .tickFormat(d => `$${d3.format('.2s')(d)}`)
            .tickPadding(15);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll('text')
            .style('font-family', 'Roboto, sans-serif')
            .style('font-size', '19px');

        svg.append('g')
            .call(yAxis)
            .selectAll('text')
            .style('font-family', 'Roboto, sans-serif')
            .style('font-size', '19px');

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom - 30)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Roboto, sans-serif')
            .style('font-size', '20px')
            .text('Year');

        svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('x', -height / 2)
            .attr('y', -margin.left + 15)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Roboto, sans-serif')
            .style('font-size', '20px')
            .text('Difference from Average Zestimate');

        const nested = d3.groups(allData, d => d.category);

        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.diffFromAvg));

        const baseline = d3.line()
            .x(d => x(d.year))
            .y(() => y(0)); // Baseline at y=0

        // Draw baseline with animation
        function animateBaseline() {
            const path = svg.append('path')
                .datum(iBoughtAverages)
                .attr('fill', 'none')
                .attr('stroke', '#000000') // Fully black baseline
                .attr('stroke-width', 3)
                .attr('stroke-dasharray', function () {
                    const length = this.getTotalLength();
                    return `${length} ${length}`; // Set the dasharray to the total length of the path
                })
                .attr('stroke-dashoffset', function () {
                    return this.getTotalLength(); // Initially offset the entire length
                })
                .attr('d', baseline);

            path.transition()
                .duration(animationHalfDurMS)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0); // Animate the offset to 0

            // Add a label for the baseline
            svg.append('text')
                .attr('x', x(iBoughtAverages[iBoughtAverages.length - 1].year)) // Position to the right of the last point
                .attr('y', y(0)) // Align with the y=0 line
                .attr('dy', '0.35em')
                .attr('fill', '#000000') // Black text
                .style('font-family', 'Roboto, sans-serif')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text('Overall Baseline');
        }

        // Draw lines with animation
        function animateLines() {
            nested.forEach(([category, values]) => {
                const path = svg.append('path')
                    .datum(values.sort((a, b) => a.year - b.year))
                    .attr('fill', 'none')
                    .attr('stroke', color(category))
                    .attr('stroke-width', 3)
                    .attr('d', line)
                    .attr('stroke-dasharray', function () {
                        const length = this.getTotalLength();
                        return `${length} ${length}`;
                    })
                    .attr('stroke-dashoffset', function () {
                        return this.getTotalLength();
                    });

                // Animate the line drawing
                path.transition()
                    .duration(animationHalfDurMS)
                    .ease(d3.easeLinear)
                    .attr('stroke-dashoffset', 0);

                // Add a label that moves with the line
                const label = svg.append('text')
                    .attr('fill', color(category))
                    .style('font-family', 'Roboto, sans-serif')
                    .style('font-size', '14px')
                    .style('font-weight', 'bold')
                    .text(category);

                // Animate the label to follow the line
                label.transition()
                    .duration(animationHalfDurMS)
                    .ease(d3.easeLinear)
                    .tween('textPosition', function () {
                        const pathLength = path.node().getTotalLength();
                        return function (t) {
                            const point = path.node().getPointAtLength(t * pathLength);
                            label.attr('x', point.x).attr('y', point.y + (category === 'N/A' ? 20 : 0)); // Adjust "N/A" label
                        };
                    });
            });
        }

        // Use IntersectionObserver to trigger animations
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    isGraphVisible = true;
                    animateBaseline(); // Animate baseline first
                    setTimeout(animateLines, 2000); // Delay original lines until baseline finishes
                    observer.disconnect(); // Stop observing after animation starts
                }
            },
            { threshold: 0.5 } // Trigger when 50% of the chart is visible
        );

        observer.observe(container);
    });
</script>

<style>
    .chart-wrapper {
        max-width: 900px;
        margin: 3em auto 0;
        text-align: center;
        position: sticky;
        top: 0;
    }

    .chart-title {
        font-size: 1.5rem;
        margin-bottom: 1em;
    }

    .chart-text {
        margin-bottom: 2em;
        font-size: 1.2rem;
        line-height: 1.5;
    }
</style>

<h1 style="text-align: center;">💸 Everything's Getting Expensive! 💸</h1>
<div id="sticky-container">
    <div class="chart-text">
        <p>
            Corporate speculation isn't just about buying individual homes—it's about betting on entire neighborhoods. To measure this broader impact, we look at <b>Zestimates</b>, Zillow's algorithmic estimates of home values, which provide a snapshot of how markets predict a property's worth.
        </p>
        <p>
            By tracking Zestimates, we're able to see how the perceived value of homes purchased by iBuyers has evolved over time. We contextualize these statistics by analyzing average Zestimate changes for homes across different historical HOLC district categories.
        </p>
    </div>
    <div id="chart-wrapper" class="chart-wrapper">
        <div id="chart-tooltip" class="dialogue-box"></div>
        <h2 class="chart-title">Difference from Average Zestimate by HOLC District</h2>
        <div id="zestimate-chart" style="width:100%; height:500px;"></div>
    </div>
</div>