// hpi bar chart object
HPIDiagram = function(_parentElement, _data1, _data2){
    this.parentElement = _parentElement;
    this.index_data = _data1;
    this.hpi_data = _data2;

    this.initVis();
};

HPIDiagram.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 50, right: 0, bottom: 50, left: 0};

    vis.width = 550 - vis.margin.left - vis.margin.right;
    vis.height = 400 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Filter housing data (year = 2015, period - 4th quarter)
    var filteredHPI = vis.index_data.filter(function(el){
        return (el.period === "4") && (el.yr === "2015");
    });

    //console.log(filteredHPI);

    // sort by HPI
    var sortedHPI = filteredHPI.sort(function(a,b){
        return b.index_nsa - a.index_nsa;
    });

    console.log(sortedHPI);

    // AXIS

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width], .1);

    var y = d3.scale.linear()
        .range([vis.height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var xAxisGroup = vis.svg.append("g")
        .attr("class", "x-axis axis");

    var yAxisGroup = vis.svg.append("g")
        .attr("class", "y-axis")
        .append("text")
        .text("Housing Index")
        .attr("y",10)
        .attr("x",-70)
        .attr("transform","rotate(-90)");

    x.domain(sortedHPI.map(function(d) { return d.place_id; }));
    y.domain([0, 770]);

    // Initialize tooltip
    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return "<b>" + d.place_name + "</b><br/>Housing Index: " + d.index_nsa + "<br/>";
    });

    // ---- DRAW BARS ----

    var bars = vis.svg.selectAll(".bar")
        .data(sortedHPI);

    // ADD
    bars.enter().append("rect")
        .attr("class", "bar");

    // UPDATE
    bars
        .attr("x", function(d) { return x(d.place_id); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.index_nsa); })
        .attr("height", function(d) { return vis.height - y(d.index_nsa); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // INVOKE TOOLTIP
    bars.call(tip);

    xAxisGroup = vis.svg.select(".x-axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(xAxis);

    yAxisGroup = vis.svg.select(".y-axis")
        .call(yAxis);


    vis.svg.append("text")
        .attr("class", "axis-title")
        .attr("x", -5)
        .attr("y", -15)
        .attr("dx", ".15em")
        .style("text-anchor", "end");
};


