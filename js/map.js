// Draw Canvas
var margin = { top: 10, right: 0, bottom: 10, left: 0 };

var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var svg = d3.select("#map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Map settings
var scale = 1100;
var projection = d3.geo.albersUsa().scale(scale).translate([width/2, height/2]);

var stateMap, stateData;

queue()
    .defer(d3.json, "data/STATE.json")
    .defer(d3.csv, "data/state-data.csv")
    .await(initVis);

function initVis(error, STATE, DATA) {

    // Draw states map
        var states = topojson.feature(STATE, STATE.objects.STATE).features;

        stateMap =
            svg.append("g")
                .attr("class","states")
                .selectAll("path")
                .data(states)
                .enter()
                .append("path")
                .attr("d", d3.geo.path().projection(projection));

    // Save housing data at state level in global variable
    stateData = DATA;

     // Debugging
        console.log(STATE);
        console.log(DATA);
}

function updateVis() {

}
