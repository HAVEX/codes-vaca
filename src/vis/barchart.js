if (typeof(define) !== 'function') var define = require('amdefine')(module);

define(function(require){
    "use strict";
    var svg = require("i2v/svg-proto"),
        Axis = require('i2v/svg/axis'),
        Viz = require('i2v/viz'),
        stats = require('p4/dataopt/stats'),
        Selector = require('i2v/selector'),
        scale = require('i2v/metric'),
        printformat = require('i2v/format');

    return Viz.extend(function(option){
        var barChart = this.$svg(),
            data = this.data,
            vmap = option.vmap,
            color = option.color || "steelblue",
            colorMap = option.colorMap,
            domain = option.domain,
            scales = option.scales,
            formatX = option.formatX || printformat(".3s"),
            formatY = option.formatY || function(d) { return d },
            onclick = option.onclick || null,
            type = option.type || option.orientation || 'bar';


        // barChart.append('g').append('rect')
        //     .attr('x', 0)
        //     .attr('y', 0)
        //     .attr('width', this.$width+this.$padding.left + this.$padding.right-2)
        //     .attr('height', this.$height+this.$padding.top + this.$padding.bottom-2)
        //     .style('fill', '#f5f5f5')
        //     .style('stroke', '#777')
        //     // .style('stroke-width', 1)

        var bars = barChart.append("g");

        domain = stats.domains(this.data, Object.keys(vmap).map(function(vk) {return vmap[vk];}));

        var barWidth = (type == 'column') ? this.$width / (this.data.length) :this.$height / (this.data.length);


        var brush = {
            brushstart: function(){},
            brush: function(){},
            brushend: function() {}
        };

        if(option.hasOwnProperty("brush")) brush = option.brush;
        brush.width = this.$width;
        brush.height = this.$height;

        if(brush.x || brush.y){
            brush.x = x;
            // brush.y = y;
            brush.container = barChart;
            var selector = new Selector(brush);
        }
        var categories =  this.data.map(function(d) { return d[vmap.y];});
        var y = Axis({
            container: barChart,
            dim: "y",
            domain: categories,
            scale:  "ordinal",
            align: "left",
            ticks: categories.length,
            labelPos: {x: -3, y: -4},
            format: formatY
        });

        var x = Axis({
            container: barChart,
            dim: "x",
            domain: [0, domain[vmap.size][1]],
            align: "top",
            ticks: 5,
            labelPos: {x: 0, y: 5},
            tickPosition: [0, -5],
            format: formatX,
            // grid: true
        });

        var colorScale = function(d) { return color; };
        if(vmap.color && typeof(colorMap) == 'function') {
            colorScale = colorMap;
        }

        var that = this;
        // var height = new scale({
        //     scale: "linear",
        //     domain: domain[vmap.size],
        //     range: [0, that.$height]
        // });

        var columns = [], selected = [], selectedData = [];

        this.highlight = function(selected) {
            columns.forEach(function(c){
                c.attr("fill", color);
            });
            selected.forEach(function(si){
                columns[si].attr("fill", "orange");
            });
        }

        this.data.forEach(function(d, i){
            var bar = bars.append("rect")
                .Attr({
                    y: that.$height - y(d[vmap.y]) - barWidth * 0.4,
                    x: 0,
                    width: x(d[vmap.size]),
                    height: barWidth * 0.8,
                    fill: colorScale(d[vmap.color])
                });

            // bar.svg.onclick = function() {
            //     console.log(that.data[i].pid);
            // }

            columns.push(bar);
            if(typeof onclick == 'function'){
                bar.svg.onclick = function(evt) {
                    if(evt.shiftKey) {
                        selected.push(i);
                        selectedData.push(data[i]);
                    } else {
                        selected = [i];
                        selectedData = [data[i]];
                    }
                    that.highlight(selected);
                    // bar.svg.attr("fill", "#A00");
                    onclick(selectedData);
                }
            }

        });

        // bars.render({
        //     mark: "rect",
        //     x: function(d, i) { return (i + 0.05) * barWidth; },
        //     y: function(d) { return y(d[vmap.size]); },
        //     width: barWidth * 0.9,
        //     height: function(d){ return that.$height - y(d[vmap.size]); },
        //     fill: function(d) { return colorScale(d[vmap.color]); }
        // })(this.data);

        bars.translate(this.$padding.left, this.$padding.top);

        var legend = barChart.append("g");

        if(option.title) {
            legend.append("g")
              .append("text")
                .attr("class", "i2v-chart-title")
                .attr("y", this.$padding.top / 2 - 5)
                .attr("x", this.$padding.left + this.$width/2 )
                .attr("dy", "1em")
                .css("text-anchor", "middle")

                .text(option.title);
        }

        var titleX = option.titleX || vmap.x.split("_").join(" "),
            titleY = option.titleY || vmap.size.split("_").join(" ");

        // legend.append("g")
        //   .append("text")
        //     .attr("class", "i2v-axis-title")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 20)
        //     .attr("x", -this.$height/2 - this.$padding.top)
        //     .attr("dy", "1.2em")
        //     .css("text-anchor", "middle")
        //     .css("font-size", "1.2em")
        //     .css("font-weight", "bold")
        //     .css(" text-transform", "capitalize")
        //     .text(titleY);

        legend.append("g")
          .append("text")
            .attr("class", "i2v-axis-title")
            // .attr("transform", "rotate(-90)")
            // .attr("y", this.$height + this.$padding.bottom /2 + this.$padding.top )
            .attr("y", this.$padding.top / 3)
            .attr("x", this.$width/2 + this.$padding.left)
            .attr("dy", "1.2em")
            .css("text-anchor", "middle")
            .css("font-size", "1.2em")
            .css("font-weight", "bold")
            .css(" text-transform", "capitalize")
            .text(titleX);



        this.svg.push(barChart);
        this.viz();

    });

});
