export default function scatterPlot(options) {
    var data = options.data || [],
        dopt = options.dopt || 'aggregate',
        container = options.container || 'body',
        vmap = options.vmap || {},
        dataSizes = options.dataSizes,
        width = options.width || 400,
        height = options.height || 300,
        legend = options.legend || null,
        yLabel = options.yLabel || true,
        xLabel = options.xLabel || true,
        chartTitle = options.chartTitle || false,
        margin = options.margin || {top: 30, right: 80, bottom: 30, left: 80};

    var svg = d3.select(container).append("svg")
            .attr("width", width )
            .attr("height", height)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    width -= margin.left + margin.right;
    height -= margin.top + margin.bottom;

    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory20);

    var result =  d3.nest().key(function(d) { return d[vmap.color]; }).entries(data)
    var series = result.map(function(d){ return d.key });
    z.domain(series);

    x.domain(d3.extent(data, function(d) { return d[vmap.x]}));
    y.domain(d3.extent(data, function(d) { return d[vmap.y]}));

    var xAxis = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3.axisBottom(x)
                .tickSize(-height)
                .tickPadding(10)
                .tickFormat(d3.format('.2s'))
        )

    xAxis.selectAll('text')
        .attr("dy", ".35em")
        .style("text-anchor", "middle");

    if(xLabel) {
        xAxis.append("text")
            .attr("class", "label")
            .attr("x", width/2)
            .attr("y", margin.bottom)
            .style("text-anchor", "middle")
            .style("font-size", "1.1em")
            .text(vmap.x)
    }

    var yAxis = svg.append("g")
        .attr("class", "y axis")
        .call(
            d3.axisLeft(y)
                .tickSize(-width)
                .tickPadding(10)
                .tickFormat(d3.format('.2s'))
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
        .attr("r", 4)
        .attr("cx", function(d) { return x(d[vmap.x]); })
        .attr("cy", function(d) { return y(d[vmap.y]); })
        .style("fill", function(d) { return z(d[vmap.color]); });

    legend = svg.append("g")
        .attr("class", "legend")
        .selectAll("g")
        .data(series)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(" + (width + 10) + "," + (i * 18) + ")"; });

    legend.append("line")
        .style("stroke", function(d) { return z(d); })
        .style("stroke-width", 5)
        .style("fill", 'none')
        .attr("x2", 10);

    legend.append("text")
        .attr("dy", ".35em")
        .attr("x", 26)
        .text(function(d) { return vmap.color + d; });
}

