const width = 1600;
const height = 700;
const padding = 60;
const margin = 200;

var EDUCATION_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
var COUNTY_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';
var files = [EDUCATION_FILE, COUNTY_FILE];

Promise.all(files.map(url => d3.json(url))).then(ready);

            
function ready(response) {
    var countyData = response[1];
    var educationData = response[0];


    const svg = d3.select('#container')
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height', 620)
                    .style('background-color', '#fff')
                    .style('border', '1px solid black');

    var tooltip = d3.select('#container').append('div')
                    .attr('class', 'tooltip')
                    .attr('id', 'tooltip')
                    .style('max-width', '160px')
                    .style('background-color', 'rgba(255,255,255,0.6)')
                    .style('font-family', 'arial')
                    .style('font-size', '14px')
                    .style('padding', '4px')
                    .style('border', '1px solid black')
                    .style('border-radius', '5px')
                    .style('visibility', 'hidden')
                    .style('position', 'absolute')
                    .style('top', '100px')
                    .style('left', '200px');


        /* MAP AREA */
        const colorscale = d3.scaleLinear()
                            .domain(d3.extent(educationData, d => d.bachelorsOrHigher))
                            .range(['#ccf', '#006']);

        let g = svg.append('g')

        g.append('g')
            .attr('class', 'counties')
            .selectAll('path')
            .data(topojson.feature(countyData, countyData.objects.counties).features)
            .enter().append('path')
            .attr('fill', d => {
                const index = educationData.findIndex(data => data.fips === d.id);
                const value = educationData[index].bachelorsOrHigher;
                return colorscale(value);
            })
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('data-fips', d => d.id)
            .attr('data-education', d => {
                const index = educationData.findIndex(data => data.fips === d.id);
                const value = educationData[index].bachelorsOrHigher;
                return value;
            })
            .on('mouseover', (e, d) => {
                const index = educationData.findIndex(data => data.fips === d.id);
                const data = educationData[index];

                tooltip.attr('data-education', data.bachelorsOrHigher)
                    .style('top', `${ e.clientY }px`)
                    .style('left', `${ e.clientX}px`)
                    .html(`<b>${data.bachelorsOrHigher}%</b> of people in ${data.area_name}, ${data.state} have a bachelors degree or better.` )
                    .style('visibility', 'visible');
                })
            .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });

        /* LEGEND AREA */
        svg.append('rect')
        .attr('width', 70)
        .attr('height', 220)
        .attr('fill', 'rgba(255,255,255,0.6)')
        .attr('x', 920)
        .attr('y', 390)
        .attr('stroke', 'black')
        .attr('rx', 5)
        .attr('ry', 5);

        const legend = svg.append('g')
        .attr('id', 'legend')

        var svgDefs = legend.append('defs');
        var legendGradient = svgDefs.append('linearGradient')
                                .attr('id', 'legendGradient')
                                .attr('x1', 0)
                                .attr('x2', 0)
                                .attr('y1', 0)
                                .attr('y2', 1);

        legendGradient.append('stop')
                    .attr('offset', '0%')
                    .attr('stop-color', '#006');

        legendGradient.append('stop')
        .attr('stop-color', '#ccf')
        .attr('offset', '100%');

        legend.append('rect')
        .attr('x', 960)
        .attr('y', 400)
        .attr('width', 16)
        .attr('height', 200)
        .attr('fill', 'url(#legendGradient)');

        legend.append('text')
        .style('font-family', 'arial')
        .style('font-size', '14px')
        .attr('x', 930)
        .attr('y', 410)
        .text('75%');

        legend.append('text')
        .style('font-family', 'arial')
        .style('font-size', '14px')
        .attr('x', 936)
        .attr('y', 600)
        .text(' 0%');

        legend.append('rect')
        .attr('fill', '#000');
        legend.append('rect')
        .attr('fill', '#010');
        legend.append('rect')
        .attr('fill', '#020');


    }
            