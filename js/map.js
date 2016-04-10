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

var stateMap, metroMap;

queue()
    .defer(d3.json, "data/STATE.json")
    .defer(d3.json, "data/MSA.json")
    .await(initVis);

function initVis(error, STATE, MSA) {

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

    // Draw MSA map
     var metroAreas = topojson.feature(MSA, MSA.objects.MSA).features;

       metroMap =
           svg.append("g")
                .attr("class", "metro")
                .selectAll("path")
                .data(metroAreas)
                .enter()
                .append("path")
                .attr("d", d3.geo.path().projection(projection))
                .style("fill", "red")
                .style("visibility", "hidden");

     // Debugging
        console.log(STATE);
        console.log(MSA);
}

function updateVis() {

    // Toggle between State and MSA views
    $("#state-select").click(function(event){
        event.preventDefault();
        stateMap.style("visibility", "visible");
        metroMap.style("visibility", "hidden");
    });

    $("#msa-select").click(function(event){
        event.preventDefault();
        metroMap.style("visibility", "visible");
        stateMap.style("visibility", "hidden");
    });

}

/*
function cleanData(data) {

            data.forEach(function(el){
                el["DATE"] = +(19 + el["DATE"].substring(0,2));
                el["YIELD"] = +el["YIELD"];
                el["LAT"] = +el["LAT"];
                el["LON"] = +el["LON"];
            });
}
*/