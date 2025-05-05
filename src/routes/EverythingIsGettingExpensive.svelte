<script>
    import { base } from '$app/paths';
    import * as d3 from "d3";
    import { onMount } from "svelte";


    onMount(async () => {
        const raw = await d3.json(`${base}/data/category_zestimate_averages.json`);

        const colorMap = {
            'Best': '#76a865',
            'Still Desirable': '#74c3e3',
            'Definitely Declining': '#ffff00',
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
        categories.forEach(category => {
            for (const [year, obj] of Object.entries(raw[category])) {
                allData.push({
                    category,
                    year: +year,
                    avg: obj.average_zestimate
                });
            }
        });
        
        // Related to getting expensive section.
        const container = document.getElementById('zestimate-chart');
        if (!container) {
            console.warn("⚠️ couldn't find #zestimate-chart in the DOM");
            return;
        }

        const margin = { top: 40, right: 20, bottom: 100, left: 100 };
        const { width: totalW, height: totalH } = container.getBoundingClientRect();
        const width  = totalW  - margin.left - margin.right;
        const height = totalH  - margin.top  - margin.bottom;

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
            .domain([0, d3.max(allData, d => d.avg)]).nice()
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
            .text('Average Zestimate');

        const nested = d3.groups(allData, d => d.category);

        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.avg));

        nested.forEach(([category, values]) => {
            svg.append('path')
                .datum(values.sort((a, b) => a.year - b.year))
                .attr('fill', 'none')
                .attr('stroke', color(category))
                .attr('stroke-width', 3)
                .attr('d', line);
        });

        const legend = d3.select("#legend")
            .append('ul')
            .style('list-style', 'none')
            .style('padding', '0')
            .style('margin', '2em auto')
            .style('display', 'flex')
            .style('flex-wrap', 'wrap')
            .style('justify-content', 'center')
            .selectAll('li')
            .data(categories)
            .enter()
            .append('li')
            .style('margin', '0 1em')
            .style('display', 'flex')
            .style('align-items', 'center');

        legend.append('span')
            .style('display', 'inline-block')
            .style('width', '12px')
            .style('height', '12px')
            .style('margin-right', '8px')
            .style('border', '1px solid #4f5152')
            .style('background-color', d => color(d));

        legend.append('span')
            .text(d => d);
    });
</script>

<style>
    .chart-wrapper {
        max-width: 900px;
        margin: 3em auto 0;
        text-align: center;
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

    #legend ul {
        list-style: none;
        padding: 0;
        margin: 2em auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    #legend li {
        margin: 0 1em;
        display: flex;
        align-items: center;
    }

    #legend span {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 8px;
        border: 1px solid #4f5152;
    }
</style>

<h1 style="text-align: center;">💸 Everything's Getting Expensive! 💸</h1>
<div id="sticky-container">
    <div class="chart-text">
        <p>
            Corporate speculation doesn't just buy homes: it predicts and bets on entire neighborhoods. Here's how the average Zestimates for iBought homes have changed for each historic HOLC district category.
        </p>
    </div>
    <div id="chart-wrapper" class="chart-wrapper">
        <div id="chart-tooltip" class="dialogue-box"></div>
        <h2 class="chart-title">Average Zestimate Trends by HOLC District</h2>
        <div id="zestimate-chart" style="width:100%; height:500px;"></div>
        <div id="legend"></div>
    </div>
</div>