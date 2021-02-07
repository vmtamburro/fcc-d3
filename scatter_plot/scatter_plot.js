const margin = 80;
const width = 1600 - 2 * margin;
const height = 1000 - 2 * margin;



const edFileReq = new XMLHttpRequest();

edFileReq.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
edFileReq.send();
edFileReq.onload = function () {
    const data = JSON.parse(edFileReq.responseText);
    data.forEach(function(d) {
        d.Place = +d.Place;
        var parsedTime = d.Time.split(':');
        d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    })
    const svg = d3.select('#container')
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
    
    var xScale = d3.scaleLinear()
                    .range([0, width])
                    .domain([d3.min(data.map((d) => d.Year)) - 1, d3.max(data.map((d) => d.Year)) + 1] );
                    
    var yScale = d3.scaleTime()
                    .range([20,  height - 2])
                    .domain([d3.min(data.map((d) => d.Time )), d3.max(data.map((d) => d.Time))]);

    var timeFormat = d3.timeFormat('%M:%S');
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    var color = d3.scaleOrdinal(d3.schemePastel2);

    var div = d3.select('#container')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('opacity', 0);


    svg.append('g')
        .attr('class', 'x axis')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr('class', 'x-axis-label')
        .attr('x', width)
        .attr('y', -6)
        .style('text-anchor', 'end')
        .text('Year');

    svg.append('g')
        .attr('class', 'y axis')
        .attr('id', 'y-axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('class', 'label')
        .style('text-anchor', 'middle')
        .text('Best Time (minutes)');

    svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 160)
        .attr('y', -44)
        .style('font-size', 18)
        .text('Time in Minutes');

    svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 6)
        .attr('cx', function (d) { return xScale(d.Year);})
        .attr('cy', function (d) { return yScale(d.Time); })
        .attr('data-xvalue', function (d) { return d.Year; })
        .attr('data-yvalue', function (d) { return d.Time.toISOString();})
        .style('fill', function (d) { return color(d.Doping !== ''); })
        .on('mouseover', function (i, d) {
                div.style('opacity', 0.9)
                    .attr('data-year', d.Year)
                    .style('height', d + 'px')
                    .style('width',xScale(new Date(d.Date)) + 'px')
                    .style('left', xScale(d.Year) + 'px')
                    .style('top', yScale(d.Time) + 'px')
                    .style('transform', 'translateX(20px)');
                div.html(
                    d.Name + ': ' + d.Nationality + '<br/>' +
                    'Year: ' + d.Year + ', Time: ' +
                    timeFormat(d.Time) + (d.Doping ? '<br/><br/>' + d.Doping : '')
                    );
                })
                .on('mouseout', function () {
                div.style('opacity', 0);
        });



    var legendContainer = svg.append('g').attr('id', 'legend');

    var legend = legendContainer
      .selectAll('#legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (height / 2 - i * 20) + ')';
      });
  
    legend
      .append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);
  
    legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function (d) {
        if (d) {
          return 'Riders with doping allegations';
        } else {
          return 'No doping allegations';
        }
      });

};