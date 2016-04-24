// Spider diagram base case + polygon path initiation

// Base case = maximum values for each property across the US

var baseCase = {
    median_house_price: 657083,
    median_rent: 3144,
    house_price_index: 768.71,
    GDP: 2424.033,
    population: 39144818,
    HDI: 6.17,
    household_income: 70004
};

// Main

queue()
    .defer(d3.json, "data/state-geo.json")
    .defer(d3.csv, "data/state-hpi.csv")
    .defer(d3.csv, "data/state-comparison.csv")
    .await(loadData);

var stateHousing, stateTopo, stateProperties, clickedState;

function loadData(error, stateGeo, stateHPI, stateComp) {

    // Save topoJSON data in global variable
    stateTopo = stateGeo;

    // Clean HPI data at state level
    stateHPI.forEach(function(el){
        cleanHPI(el);
    });

    // Save HPI data at state level in global variable
    stateHousing = stateHPI;

    // Clean state comparison data
    stateComp.forEach(function(el){
       cleanComp(el);
    });

    // Save comparison data at state level in global variable
    stateProperties = stateComp;

    //debugging

    createVis();
}

function createVis() {

    choroplethMap = new choroplethMap("map",stateHousing,stateTopo);

    spiderDiagram = new spiderDiagram("spider-diagram");


    // When user clicks on state, fetch comparison data
    choroplethMap.stateMap.on("click", function(d) {

       var code = this.__data__.properties.STUSPS;

       var userState = fetchComp(code);

       var path = spiderDiagram.drawPolygon(userState, baseCase);

        console.log(path);

        spiderDiagram.svg.append("path")
            .attr("d", path)
            .attr("class", "polygon")
            .style("fill", "red")
            .style("opacity", "0.5");
    });

}

function cleanHPI(element) {
    element["index_nsa"] = +element["index_nsa"];
}

function cleanComp(element) {
    element["state"] = element["state"].replace(/\./g , "");
    element["gdp"] = +element["gdp"] / 1000; // in billion $
    element["hdi"] = +element["hdi"];
    element["median_house_price"] = +element["median_house_price"];
    element["median_household_income"] = +element["median_household_income"];
    element["median_rent"] = +element["median_rent"];
    element["population"] = +element["population"];
}

function fetchComp(code) {

    var stateProp = stateProperties.filter(function(el) {return el["state_code"] === code});
    var stateIndex = stateHousing.filter(function(el) {return (el.place_id === code) && (el.period === "4") && (el.yr === "2015")});

    clickedState = {};

    clickedState.name = stateProp[0].state;
    clickedState.GDP = stateProp[0].gdp;
    clickedState.HDI = stateProp[0].hdi;
    clickedState.median_house_price = stateProp[0].median_house_price;
    clickedState.median_rent = stateProp[0].median_rent;
    clickedState.household_income = stateProp[0].median_household_income;
    clickedState.population = stateProp[0].population;
    clickedState.house_price_index = stateIndex[0].index_nsa;

    console.log(stateProp);
    console.log(clickedState);
    return clickedState;
}

function reset() {

    spiderDiagram.svg.selectAll(".polygon").remove();
}