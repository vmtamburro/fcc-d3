const width = 1600;
const height = 700;
const padding = 60;
const margin = 200;

const monthArr = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];

const edFileReq = new XMLHttpRequest();
edFileReq.open("GET",  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', true);
edFileReq.send();
edFileReq.onload = function () {
        var response = JSON.parse(edFileReq.responseText);
        var baseTemperature = response.baseTemperature;

        const data = response.monthlyVariance;
        const years = [...new Set(data.map(d => d.year))];
        const svg = d3.select('#container')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', '0 0 ' + width + ' ' + height);

        svg.append('desc')
            .attr('id', 'description')
            .text('' + d3.min(years) + ' - ' + d3.max(years) + ', base temperature: ' + baseTemperature);

        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', width / 2)
            .attr('y', padding / 2)
            .text(svg.select('desc').text());

        const xScale = d3.scaleBand()
                            .domain(years)
                            .range([padding, (width - padding)]);
        const yScale = d3.scaleBand()
                            .domain(monthArr)
                            .range([padding, (height - padding)]);

        const xAxis = d3.axisBottom(xScale).tickValues(years.filter(year => year % 10 === 0));
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .call(xAxis);

        svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis);


        const colorScale = d3.scaleQuantize()
                                .domain([d3.min(data, d => d.variance), d3.max(data, d => d.variance)])
                                .range(d3.schemeSpectral[11].reverse());
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('data-month', d => d.month - 1)
            .attr('data-year', d => d.year)
            .attr('data-temp', d => d.variance)
            .attr('x', (d) => xScale(d.year))
            .attr('y', d => yScale(monthArr[d.month - 1]))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .attr('fill', d => colorScale(d.variance))
            .on('mouseover', function(i, d) {
                const dataYear = d.year;
                d3.select(this).attr('stroke', 'black');
                const tooltip = d3.select('#container')
                                    .append('div')
                                    .attr('id', 'tooltip')
                                    .attr('data-year', dataYear)
                                    .html(
                                        '<div>' + monthArr[d.month - 1] + ' ' + d.year + '</div>' +
                                        '<div>' + (d.variance > 0 ? '+' : '') + d.variance + '</div>'
                                    );
                tooltip.attr('style', 
                        'top: ' + (yScale(monthArr[d.month - 1]) - document.getElementById('tooltip').offsetHeight) + 'px;' +
                        'left: ' + (xScale(d.year) - document.getElementById('tooltip').offsetWidth) + 'px;' );
            })
            .on('mouseout', function(d) {
                d3.select('#tooltip').remove();
                d3.select(this).attr('stroke', 'none');
            });

        // Legend.
        const legend = svg.append('g').attr('id', 'legend');
        d3.schemeSpectral[11].map((color, index) => {
            legend.append('rect')
                    .attr('width', margin / 11)
                    .attr('height', 20)
                    .attr('x', padding + margin / 11 * index)
                    .attr('y', 660)
                    .attr('fill', color);
        });



        const legendScale = d3.scaleLinear()
                                .domain([d3.min(data, d => d.variance), d3.max(data, d => d.variance)])
                                .range([0, margin]);

        const legendAxis = d3.axisBottom(legendScale)
                                .tickValues(d3.range(
                                    d3.min(data, d => d.variance),
                                    d3.max(data, d => d.variance) + (d3.max(data, d => d.variance) - d3.min(data, d => d.variance)) / 5,
                                    (d3.max(data, d => d.variance) - d3.min(data, d => d.variance)) / 5
                                ))
                                .tickFormat(d3.format('+.1f'));
        legend.append('g')
            .attr('transform', 'translate(' + padding + ', 680)')
            .call(legendAxis);
    };
