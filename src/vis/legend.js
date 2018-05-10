export default function legend(options) {
    var data = options.data || [],
        container = options.container || 'body',
        width = options.width || 400,
        height = options.height || 300,
        color = options.color,
        margin = options.margin || {top: 30, right: 80, bottom: 30, left: 80};

    var svg = d3.select(container).append("svg")
            .attr("width", width )
            .attr("height", height)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    width -= margin.left + margin.right;
    height -= margin.top + margin.bottom;

    var legend = svg.append("g")
        .attr("class", "legend")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + (i * 18) + ")"; });

    legend.append("line")
        .style("stroke", function(d) { return color(d); })
        .style("stroke-width", 5)
        .style("fill", 'none')
        .attr("x2", 10);

    legend.append("text")
        .attr("dy", ".35em")
        .attr("x", 26)
        .text(function(d) { return d; });

}

