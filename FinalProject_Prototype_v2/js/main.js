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

// Stores data for Chord Diagram
var chordData;

// Variables for the Chord Diagram visualization instance
var chordDiagram;


// Main

queue()
    .defer(d3.json, "data/state-geo.json")
    .defer(d3.csv, "data/state-hpi.csv")
    .defer(d3.csv, "data/state-comparison.csv")
    .await(loadData);


// Stores Map and Spider Diagram Data
var stateHousing, stateTopo, stateProperties, clickedState;

// Variables for the Map and Spider Diagram visualization instances
var choroplethMap, spiderDiagram ;

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


// Loads Data for Chord Diagram
function loadChordData() {
    d3.csv("data/US_House_Sales_byRegion.csv", function(error, csv){
        if(!error){
            chordData = csv;
            createChordVis();
        }
    });
}


function createVis() {

    choroplethMap = new ChoroplethMap("map",stateHousing,stateTopo);

    spiderDiagram = new SpiderDiagram("spider-diagram");

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

function createChordVis() {
    chordDiagram =  new ChordDiagram("chord", chordData)
}

// Updates Chord Visualization
function updateChordVisualization() {
    ChordDiagram.prototype.updateVis();
    loadChordData();
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


// Changes Visualization to Chord Diagram
function changeToChordVis(){

    if (document.getElementById("spider-diagram")) {

        var parent = document.getElementById("dashboard");
        var child = document.getElementById("spider-diagram");
        var chord = document.createElement("div");
        var dropDiv = document.createElement("div");
        var dropdown = document.createElement("select")

        var op02 = new Option();
        var op03 = new Option();
        var op04 = new Option();
        var op05 = new Option();
        var op06 = new Option();
        var op07 = new Option();
        var op08 = new Option();
        var op09 = new Option();
        var op10 = new Option();
        var op11 = new Option();
        var op12 = new Option();
        var op13 = new Option();
        var op14 = new Option();
        var op15 = new Option();


        dropDiv.setAttribute("id", "drop-div")
        dropDiv.setAttribute("class", "col-xs-4")

        dropdown.setAttribute("id", "sort-type")
        dropdown.setAttribute("class", "form-control row")
        dropdown.onchange = updateChordVisualization;

        op15.value = 2015
        op15.text = "2015";
        dropdown.options.add(op15);

        op14.value = 2014
        op14.text = "2014";
        dropdown.options.add(op14);

        op13.value = 2013
        op13.text = "2013";
        dropdown.options.add(op13);

        op12.value = 2012
        op12.text = "2012";
        dropdown.options.add(op12);

        op11.value = 2011
        op11.text = "2011";
        dropdown.options.add(op11);


        op10.value = 2010
        op10.text = "2010";
        dropdown.options.add(op10);

        op09.value = 2009
        op09.text = "2009";
        dropdown.options.add(op09);

        op08.value = 2008
        op08.text = "2008";
        dropdown.options.add(op08);

        op07.value = 2007
        op07.text = "2007";
        dropdown.options.add(op07);

        op06.value = 2006
        op06.text = "2006";
        dropdown.options.add(op06);


        op05.value = 2005
        op05.text = "2005";
        dropdown.options.add(op05);

        op04.value = 2004
        op04.text = "2004";
        dropdown.options.add(op04);

        op03.value = 2003
        op03.text = "2003";
        dropdown.options.add(op03);

        op02.value = 2002
        op02.text = "2002";
        dropdown.options.add(op02);

        chord.setAttribute("id", "chord");

        parent.removeChild(child);

        parent.appendChild(chord);

        document.getElementById("chord").appendChild(dropDiv);

        document.getElementById("drop-div").appendChild(dropdown);

        loadChordData();
    }


}

function changeToSpiderVis(){

    if (document.getElementById("chord")) {

        var parent = document.getElementById("dashboard");
        var child = document.getElementById("chord");
        var spider = document.createElement("div");
        var buttonDiv = document.createElement("div");
        var button = document.createElement("input");

        spider.setAttribute("id", "spider-diagram");

        button.setAttribute("id", "reset")
        button.setAttribute('type','button');
        button.setAttribute('name','rest');
        button.setAttribute('value','Reset');
        button.onclick = reset;

        buttonDiv.setAttribute("id", "button-div")

        parent.removeChild(child);

        parent.appendChild(spider);

        document.getElementById("spider-diagram").appendChild(buttonDiv);

        document.getElementById("button-div").appendChild(button);

        spiderDiagram = new SpiderDiagram("spider-diagram");
    }

}