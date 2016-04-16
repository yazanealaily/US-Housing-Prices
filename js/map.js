// Choropleth map object
choroplethMap = function(_parentElement, _data1, _data2){
    this.parentElement = _parentElement;
    this.index_data = _data1;
    this.topo_data = _data2;
    this.displayData = []; // see data wrangling

    this.initVis();
}

choroplethMap.prototype.initVis = function() {
    var vis = this;

    // Canvas
    vis.margin = { top: 10, right: 0, bottom: 10, left: 0 };

    vis.width = 800 - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Map settings
    var scale = 1000;
    var projection = d3.geo.albersUsa().scale(scale).translate([vis.width/2, vis.height/2]);

    // Color spectrum
    var colors = colorbrewer.Blues[9];

    var quantize = d3.scale.quantize()
        .range(colors);

    // Filter housing data (year = 2015, period - 4th quarter)
    var filteredHPI = vis.index_data.filter(function(el){
        return (el.period === "4") && (el.yr === "2015");
    });

    // Merge housing index with topoJSON data
    vis.topo_data.objects.STATE.geometries.forEach(function(el1){
        filteredHPI.forEach(function(el2){
            if(el1.properties.STUSPS === el2.place_id) {
                el1.properties.Housing_index = el2.index_nsa;
            }
        });
    });

    // Set color domain
    quantize.domain(d3.extent(vis.topo_data.objects.STATE.geometries, function(d) {return d.properties.Housing_index;}));

    // Draw choropleth map
        var states = topojson.feature(vis.topo_data, vis.topo_data.objects.STATE).features;

    vis.stateMap =
            vis.svg.append("g")
                .attr("class","us-map")
                .selectAll("path")
                .data(states)
                .enter()
                .append("path")
                .attr("d", d3.geo.path().projection(projection))
                .style("fill", function(d) {
                        return quantize(d.properties.Housing_index);
                })
                .style("stroke", "white")
                .on("mouseover", function(d) {d3.select(this).style("fill", "red")})
                .on("mouseout", function(d) {d3.select(this).style("fill", quantize(d.properties.Housing_index))});

    // Add tooltip

    // Add legend

}


