// Canvas
var margin = { top: 10, right: 0, bottom: 10, left: 0 };

var width = 1000 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var svg = d3.select("#map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Map settings
var scale = 1150;
var projection = d3.geo.albersUsa().scale(scale).translate([width/2, height/2]);

// Color spectrum
var colors = colorbrewer.YlOrRd[9];

var quantize = d3.scale.quantize()
    .range(colors);

var stateMap, stateData;

queue()
    .defer(d3.json, "data/STATE.json")
    .defer(d3.csv, "data/state-data.csv")
    .await(initVis);

function initVis(error, STATE, DATA) {

    // Clean housing data at state level
    DATA.forEach(function(el){
        cleanStateData(el);
    });

    // Save housing data at state level in global variable
    stateData = DATA;

    // Filter housing data (year = 2015, period - 4th quarter)
    var filteredHPI = stateData.filter(function(el){
        return (el.period === "4") && (el.yr === "2015");
    });

    // Merge housing index with topoJSON data
    STATE.objects.STATE.geometries.forEach(function(el1){
        filteredHPI.forEach(function(el2){
            if(el1.properties.STUSPS === el2.place_id) {
                el1.properties.Housing_index = el2.index_nsa;
            }
        });
    });

    // Set color domain

    quantize.domain(d3.extent(STATE.objects.STATE.geometries, function(d) {return d.properties.Housing_index;}));

    // Draw choropleth map
        var states = topojson.feature(STATE, STATE.objects.STATE).features;

        stateMap =
            svg.append("g")
                .attr("class","states")
                .selectAll("path")
                .data(states)
                .enter()
                .append("path")
                .attr("d", d3.geo.path().projection(projection))
                .style("fill", function(d) {
                        return quantize(d.properties.Housing_index);
                })
                .style("stroke", "white");

    // Add tooltip

    // Add legend

    // Debug
        console.log(STATE);
        console.log(filteredHPI);
        console.log(stateData);
        console.log(states);
}

function cleanStateData(element) {
    element["index_nsa"] = +element["index_nsa"];
}
