
define(function(require){ return function (options) {
    var data = options.data || [],
        width = options.width || 900,
        height = options.height || 900,
        radius = width - 40,
        x = d3.scale.linear().range([0, radius]),
        y = d3.scale.linear().range([0, radius]),
        vmap = options.vmap || {size: 'size', name: 'name'},
        container = options.container || 'body',
        node,
        root;


    var pack = d3.layout.pack()
        .size([radius, radius])
        .value(function(d) { return Math.max(d[vmap.size], 7e7); })

    var vis = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + (width - radius) / 2 + "," + (height - radius) / 2 + ")");

      node = root = data;
      var nodes = pack.nodes(root);
      console.log(nodes);
      vis.selectAll("circle")
          .data(nodes)
        .enter().append("svg:circle")
          .attr("class", function(d) { return d.children ? "parent" : "child"; })
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return d.r; })
          .style("fill", "#ccc")
          .style("stroke", "#999")
          .on("click", function(d) { return zoom(node == d ? root : d); });

      vis.selectAll("text")
          .data(nodes)
        .enter().append("svg:text")
          .attr("class", function(d) { return d.children ? "parent" : "child"; })
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
          .text(function(d) { return d.name; });

      d3.select(window).on("click", function() { zoom(root); });

    function zoom(d, i) {
      var k = radius / d.r / 2;
      x.domain([d.x - d.r, d.x + d.r]);
      y.domain([d.y - d.r, d.y + d.r]);

      var t = vis.transition()
          .duration(d3.event.altKey ? 7500 : 750);

      t.selectAll("circle")
          .attr("cx", function(d) { return x(d.x); })
          .attr("cy", function(d) { return y(d.y); })
          .attr("r", function(d) { return k * d.r; });

      t.selectAll("text")
          .attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

      node = d;
      d3.event.stopPropagation();
    }
  }
});
