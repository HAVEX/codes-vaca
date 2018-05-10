export default function linePlot(options) {
    var linePlot = {};
    var data = options.data || [],
        dopt = options.dopt || 'aggregate',
        container = options.container || 'body',
        vmap = options.vmap || {},
        dataSizes = options.dataSizes,
        width = options.width || 400,
        height = options.height || 300,
        legend = options.legend || null,
        colorMap = options.colorMap || null,
        yLabel = options.yLabel || true,
        xLabel = options.xLabel || true,
        chartTitle = options.title || false,
        printLegend = options.legend || false,
        margin = options.margin || {
            top: 30,
            right: 30,
            bottom: 30,
            left: 80
        };

    var svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    width -= margin.left + margin.right;
    height -= margin.top + margin.bottom;

    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        color;


    var line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) {
            return x(d[vmap.x]);
        })
        .y(function(d) {
            return y(d[vmap.y]);
        });

    var result = d3.nest().key(d => d[vmap.color]).entries(data),
        series = result.map(d => d.key).sort((a,b)=>a-b);

        if(colorMap === null) {
            color = d3.scaleOrdinal(d3.schemeCategory20);
            color.domain(series);
        } else {
            color = colorMap;
        }

    // console.log(data);

    var xDomain = d3.extent(data, function(d) {
            return d[vmap.x]
        }),
        yDomain = d3.extent(data, function(d) {
            return d[vmap.y]
        })
    x.domain(xDomain);
    y.domain(yDomain);

    var pointPerSeries = data.length / series.length,
        xInterval = (xDomain[1]) / pointPerSeries;


    var xAxis = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3.axisBottom(x)
            .tickSize(-height)
            .tickPadding(10)
            .tickFormat(function(d) {
                return d3.format('.2s')(d / 1e+9) + 's'
            })
        )

    // if (xLabel) {
    //     svg.append("text")
    //         .attr("class", "label")
    //         .attr("x", width / 2)
    //         .attr("y", margin.bottom)
    //         .attr("dy", ".35em")
    //         .style("text-anchor", "middle")
    //         .style("font-size", "1.1em")
    //         .text(vmap.x)
    // }

    linePlot.onbrush = function() {};
    linePlot.onbrushend = function() {};

    var brush = d3.brushX()
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("brush", brushed)
        .on("end", brushedend);

    var yAxis = svg.append("g")
        .attr("class", "y axis")
        .call(
            d3.axisLeft(y)
            .tickSize(-width)
            .tickPadding(10)
            .tickFormat(d3.format('.2s'))
        );

    if (yLabel) {
        svg.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("x", -height / 2)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .style("font-size", "1.1em")
            .text(vmap.y.split('_').join(' '));
    }


    var trend = svg.selectAll(".lib")
        .data(result)
        .enter().append("g")
        .attr("class", "lib");

    trend.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
            return line(d.values);
        })
        .style("stroke-width", 2)
        .style("fill", 'none')
        .style("stroke", function(d) {
            return color(d.key);
        });

    var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects");

    var lineCursor = mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");


    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(series)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    linePlot.onhover = function(mouse) {};

    linePlot.showLineCursor = function(mouse) {
        lineCursor
            .attr("d", function() {
                var d = "M" + mouse[0] + "," + height;
                d += " " + mouse[0] + "," + 0;
                return d;
            });
    }

    var brushHandle = svg.append("g")
        .attr("class", "brush")
        .call(brush);

    linePlot.moveBrush = function(selection) {
        brush.move(brushHandle, selection);
    }

    linePlot.colorMap = function(d) {
        return color(d);
    }

    linePlot.brushCallBack = true;

    function brushed() {
        var selection = d3.event.selection;
        // var selectedDomain = selection.map(x.invert, x);
        if(linePlot.brushCallBack)
            linePlot.onbrush(d3.event.selection);

    }

    function brushedend() {
        var selection = d3.event.selection;
        var selectedDomain = selection.map(x.invert, x);
        if(linePlot.brushCallBack)
            linePlot.onbrushend(d3.event.selection, selectedDomain);
    }


    svg.on('mouseover', function() { // on mouse in show line, circles and text
            var mouse = d3.mouse(this);
            d3.selectAll(".mouse-line").style("opacity", 1);
        })
        .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            linePlot.showLineCursor(mouse);
            linePlot.onhover(mouse);
        })
        .on('mouseout', function() {
            d3.selectAll(".mouse-line").style("opacity", 0);
        })
        // .on('click', function() {
        //     var mouse = d3.mouse(this);
        //     var xValue = xDomain[0] + Math.floor(mouse[0] / width * pointPerSeries) * xInterval;
        //     // console.log(xValue);
        //     var yValues = data.filter(function(d) {
        //         return d[vmap.x] == xValue;
        //     }).map(d => d[vmap.y]);
        //     console.log(yValues);
        // })

    if (chartTitle) {
        var title = svg.append("text")
            .attr("x", 0)
            .attr("y", -margin.top / 2)
            .style("text-anchor", "begin")
            .style("font-size", "16px")
            .text(chartTitle);
    }

    if (printLegend) {
        legend = svg.append("g")
            .attr("class", "legend")
            .selectAll("g")
            .data(series)
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(" + (i * Math.min(70, width / series.length)) + ", 0 )";
            });

        legend.append("line")
            .style("stroke", function(d) {
                return color(d);
            })
            .style("stroke-width", 5)
            .style("fill", 'none')
            .attr("x2", 20);

        legend.append("text")
            .attr("dy", ".35em")
            .attr("x", 26)
            .text(function(d) {
                return vmap.color + d;
            });
    }

    return linePlot;
}

