export default function (options) {
    var data = options.data || [],
        dopt = options.dopt || 'aggregate',
        container = options.container || 'body',
        vmap = options.vmap || {},
        width = options.width || 400,
        height = options.height || 300,
        legend = options.legend || null,
        yLabel = options.yLabel || true,
        xLabel = options.xLabel || true,
        series = options.domainY || options.series || null,
        domainX = options.domainX || [],
        chartTitle = options.chartTitle || false,
        margin = options.margin || {top: 90, right: 20, bottom: 50, left: 40};

    var svg = d3.select(container).append("svg")
            .attr("width", width )
            .attr("height", height)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    width -= margin.left + margin.right;
    height -= margin.top + margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(1),
        y = d3.scaleBand().rangeRound([0, height]).padding(1),
        z = d3.scaleOrdinal(d3.schemeCategory20);

    if(series == null) {
        var result =  d3.nest().key(function(d) { return d[vmap.color]; }).entries(data)
        series = result.map(function(d){ return d.key });
    }
    z.domain(series);

    x.domain(domainX);
    y.domain(series);

    var sizeScales = {};

    domainX.forEach(function(metric){
        var subset = data.filter(d=>d.metric == metric);

        sizeScales[metric] = d3.scaleLinear()
            .range([2, Math.min(height / series.length, width/4)])
            .domain(d3.extent(subset, function(d){ return d.value; }))
    })

    var xAxis = svg.append("g")
        .attr("class", "x axis")
    //   .attr("transform", "translate(0," + height + ")")
        .call(
            d3.axisTop(x)
        )

    xAxis.selectAll('text')
        .attr("dx", x.bandwidth() / 2)
        .attr("dy", y.bandwidth() / 2 + 4)
        .attr("transform", "rotate(-65)")
        .style("font-size", "1.1em")
        .style("text-anchor", "start");

    if(xLabel) {
        xAxis.append("text")
            .attr("class", "label")
            .attr("x", width/2)
            .attr("y", margin.top/2)
            .style("text-anchor", "middle")
            .style("font-size", "1.1em")
            .text(vmap.x)
    }

    var yAxis = svg.append("g")
        .attr("class", "y axis")
        .call(
            d3.axisLeft(y)
                .tickFormat((d) => 'PE'+d)
        );

    if(yLabel) {
        yAxis.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("x", -height/2)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .style("font-size", "1.1em")
            .text(vmap.y);
    }

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d){ return sizeScales[d.metric](d.value) / 2 })
        .attr("cx", function(d) { return x(d[vmap.x]); })
        .attr("cy", function(d) { return y(d[vmap.y]); })
        .style("fill", function(d) { return z(d[vmap.color]); });

    // legend = svg.append("g")
    //     .attr("class", "legend")
    //   .selectAll("g")
    //     .data(series)
    //   .enter().append("g")
    //     .attr("transform", function(d, i) { return "translate(" + (width + 10) + "," + (i * 18) + ")"; });
    //
    // legend.append("line")
    //     .style("stroke", function(d) { return z(d); })
    //     .style("stroke-width", 5)
    //     .style("fill", 'none')
    //     .attr("x2", 10);
    //
    // legend.append("text")
    //     .attr("dy", ".35em")
    //     .attr("x", 26)
    //     .text(function(d) { return vmap.color + d; });

}
