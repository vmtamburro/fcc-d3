const margin = 80;
const width = 1600 - 2 * margin;
const height = 1000 - 2 * margin;



const edFileReq = new XMLHttpRequest();
edFileReq.open("GET", 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
edFileReq.send();
edFileReq.onload = function () {
    json = JSON.parse(edFileReq.responseText);
    var data = [];
    [json.data][0].forEach((x) => data.push({ "Date": x[0], "GDP": x[1] }));
    var listGDP = data.map(x => x.GDP);
    var listDate = data.map(x => new Date(x.Date));
    var maxGDP = Math.max(...listGDP)

    const svg = d3.select('#container')
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)


    var tooltip = d3.select('#container')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

        var overlay = d3
            .select('#container')
            .append('div')
            .attr('class', 'overlay')
            .style('opacity', 0);



    const linearXScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map((s) => s.DrugGroup))


    const xScale = d3.scaleTime()
                .domain([d3.min(listDate), d3.max(listDate)])
                .range([0, width]);

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxGDP])


    const makeYLines = () => d3.axisLeft()
        .scale(yScale)

    svg.append('g')
        .attr("id", "x-axis")
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale).tickFormat(''));

    svg.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        )

    const barGroups = svg.selectAll()
        .data(data)
        .enter()
        .append('g')

    barGroups
        .append('rect')
        .attr('data-date', (i) => i.Date)
        .attr('data-gdp', (i) => i.GDP)
        .attr('class', 'bar')
        .attr('x', function(g) { x =  xScale(new Date(g.Date)); return x;})
        .attr('y', function(g) { x =  yScale(g.GDP);return x;})
        .attr('height', (g) => height - yScale(g.GDP))
        .attr('width', width / data.length)
        .style('fill', 'lightblue')
        .on('mouseover', function (e, d) {
            overlay
              .transition()
              .duration(0)
              .style('height', d + 'px')
              .style('width',xScale(new Date(d.Date)) + 'px')
              .style('opacity', 0.9)
              .style('left', xScale(new Date(d.Date)) + 0 + 'px')
              .style('top', height - d + 'px')
              .style('transform', 'translateX(60px)');
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip
            .attr("data-date", d.Date)
              .html(
                d.Date +
                  '<br>' +
                  '$' +
                    d.GDP.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
                  ' Billion'
              )
              .style('left',  xScale(new Date(d.Date)) + 30 + 'px')
              .style('top', height - 100 + 'px')
              .style('transform', 'translateX(60px)');
          })
          .on('mouseout', function () {
            tooltip.transition().duration(200).style('opacity', 0);
            overlay.transition().duration(200).style('opacity', 0);
          });


    barGroups
        .append('text')
        .attr('class', 'GDP')

    svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 6)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('GDP ($)')

    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('Date')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')

    svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin / 2)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'start');



};




