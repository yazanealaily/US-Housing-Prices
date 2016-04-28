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
var stateHousing, stateTopo, stateProperties, clickedState, firstState, secondState, firstClickedStateRegion = "", secondClickedStateRegion = "";

// Spider diagram color variable
var colorCount = 0;

// Used to keep track of number of states selected (max 2)
var clickCount = 0;

// Variables for the Map and Spider Diagram visualization instances
var choroplethMap, spiderDiagram, hpiDiagram ;

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

       var path = spiderDiagram.drawPolygon(userState, spiderDiagram.baseCase);

        console.log(path);

        colorCount += 1;

        spiderDiagram.svg.append("path")
            .attr("d", path)
            .attr("class", "polygon")
            .style("fill", spiderDiagram.colors[colorCount%12])
            .style("opacity", "0.6")
            .style("stroke-width", "2");

        //spiderDiagram.stateName.text(clickedState.name);
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

    if (clickCount < 2){

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

        clickCount += 1;

        // Stop the user from choosing the same two state
        if (clickCount == 1){
            firstState = stateProp[0].state;
        }
        else{
            secondState = stateProp[0].state;
            if (firstState == secondState){
                alert("Please choose a different second state to compare.");
                clickCount -= 1;
                end();
            }
        }

        document.getElementById("state" + clickCount).textContent=stateProp[0].state;
        document.getElementById("mhp" + clickCount).textContent=stateProp[0].median_house_price;
        document.getElementById("md" + clickCount).textContent=stateProp[0].median_rent;
        document.getElementById("pi" + clickCount).textContent=(stateProp[0].median_house_price/stateProp[0].median_household_income).toFixed(2);
        document.getElementById("hi" + clickCount).textContent=stateProp[0].median_household_income;
        document.getElementById("hd" + clickCount).textContent=stateProp[0].hdi;
        document.getElementById("p" + clickCount).textContent=stateProp[0].population;
        document.getElementById("gdp" + clickCount).textContent=stateProp[0].gdp;
        document.getElementById("pidx" + clickCount).textContent=stateIndex[0].index_nsa;

        if (document.getElementById("chord")){

            if (clickCount == 1){
                firstClickedStateRegion = stateProp[0].region;
                console.log(firstClickedStateRegion);
                document.getElementById("state" + clickCount).textContent=stateProp[0].state + " - (" + firstClickedStateRegion + ")";
            }
            else {
                secondClickedStateRegion = stateProp[0].region;
                console.log(secondClickedStateRegion);
                document.getElementById("state" + clickCount).textContent=stateProp[0].state + " - (" + secondClickedStateRegion + ")";
            }

            updateChordVisualization();
        }


        console.log(stateProp);
        console.log(clickedState);
        return clickedState;

    }
    else{
        alert("Maximum of two states. Please click reset in order to make additional comparisons");

    }
}

function reset() {

    spiderDiagram.svg.selectAll(".polygon").remove();
    clickCount = 0;
    firstClickedStateRegion = "";
    secondClickedStateRegion = "";

    for (var i = 1; i < 3; i++) {
        document.getElementById("state" + i).textContent= "State" + i;
        document.getElementById("mhp" + i).textContent="";
        document.getElementById("md" + i).textContent="";
        document.getElementById("pi" + i).textContent="";
        document.getElementById("hi" + i).textContent="";
        document.getElementById("hd" + i).textContent="";
        document.getElementById("p" + i).textContent="";
        document.getElementById("gdp" + i).textContent="";
        document.getElementById("pidx" + i).textContent="";
    }

    if (document.getElementById("chord")){
        updateChordVisualization();
    }
}


// Changes Visualization to Chord Diagram
function changeToChordVis(){

    reset();

    if (!document.getElementById("chord")) {

        var parent = document.getElementById("dashboard");
        var child;

        if (document.getElementById("bar-chart")) {
            child = document.getElementById("bar-chart")
        } else if (document.getElementById("spider-diagram")) {
            child = document.getElementById("spider-diagram")
        } else if (document.getElementById("chord")) {
            child = document.getElementById("chord")
        }

        var chord = document.createElement("div");
        var dropDiv = document.createElement("div");
        var dropdown = document.createElement("select")
        var buttonDiv = document.createElement("div");
        var button = document.createElement("input");

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


        button.setAttribute("id", "reset");
        button.setAttribute('type','button');
        button.setAttribute('name','rest');
        button.setAttribute('value','Reset');
        button.onclick = reset;

        buttonDiv.setAttribute("id", "button-div");

        dropDiv.setAttribute("id", "drop-div");
        dropDiv.setAttribute("class", "col-xs-6");

        chord.setAttribute("style","height:500px");

        dropdown.setAttribute("id", "sort-type");
        dropdown.setAttribute("class", "form-control row");
        dropdown.onchange = updateChordVisualization;

        op15.value = 2015;
        op15.text = "2015";
        dropdown.options.add(op15);

        op14.value = 2014;
        op14.text = "2014";
        dropdown.options.add(op14);

        op13.value = 2013;
        op13.text = "2013";
        dropdown.options.add(op13);

        op12.value = 2012;
        op12.text = "2012";
        dropdown.options.add(op12);

        op11.value = 2011;
        op11.text = "2011";
        dropdown.options.add(op11);


        op10.value = 2010;
        op10.text = "2010";
        dropdown.options.add(op10);

        op09.value = 2009;
        op09.text = "2009";
        dropdown.options.add(op09);

        op08.value = 2008;
        op08.text = "2008";
        dropdown.options.add(op08);

        op07.value = 2007;
        op07.text = "2007";
        dropdown.options.add(op07);

        op06.value = 2006;
        op06.text = "2006";
        dropdown.options.add(op06);


        op05.value = 2005;
        op05.text = "2005";
        dropdown.options.add(op05);

        op04.value = 2004;
        op04.text = "2004";
        dropdown.options.add(op04);

        op03.value = 2003;
        op03.text = "2003";
        dropdown.options.add(op03);

        op02.value = 2002;
        op02.text = "2002";
        dropdown.options.add(op02);

        chord.setAttribute("id", "chord");

        parent.removeChild(child);

        parent.appendChild(chord);

        document.getElementById("chord").appendChild(buttonDiv);

        document.getElementById("button-div").appendChild(button);

        document.getElementById("chord").appendChild(dropDiv);

        document.getElementById("drop-div").appendChild(dropdown);

        loadChordData();
    }


}

function changeToSpiderVis(){

    if (!document.getElementById("spider-diagram")) {

        reset();

        var parent = document.getElementById("dashboard");
        var child;

        if (document.getElementById("bar-chart")) {
            child = document.getElementById("bar-chart")
        } else if (document.getElementById("spider-diagram")) {
            child = document.getElementById("spider-diagram")
        } else if (document.getElementById("chord")) {
            child = document.getElementById("chord")
        }

        var spider = document.createElement("div");
        var spiderSvg = document.createElement("svg");
        var buttonDiv = document.createElement("div");
        var button = document.createElement("input");

        spider.setAttribute("id", "spider-diagram");
        spider.setAttribute("style","height:500px");

        button.setAttribute("id", "reset");
        button.setAttribute('type','button');
        button.setAttribute('name','rest');
        button.setAttribute('value','Reset');
        button.onclick = reset;

        buttonDiv.setAttribute("id", "button-div");

        parent.removeChild(child);

        parent.appendChild(spider);

        document.getElementById("spider-diagram").appendChild(buttonDiv);

        document.getElementById("spider-diagram").appendChild(spiderSvg);

        document.getElementById("button-div").appendChild(button);

        spiderDiagram = new SpiderDiagram("spider-diagram");
    }

}

function changeToBarChart(){

    if (!document.getElementById("bar-chart")) {

        reset();

        var parent = document.getElementById("dashboard");
        var child;

        if (document.getElementById("bar-chart")) {
            child = document.getElementById("bar-chart")
        } else if (document.getElementById("spider-diagram")) {
            child = document.getElementById("spider-diagram")
        } else if (document.getElementById("chord")) {
            child = document.getElementById("chord")
        }

        var hpiBarChart = document.createElement("div");
        var hpiBarChartSvg = document.createElement("svg");

        hpiBarChart.setAttribute("id", "bar-chart");

        parent.removeChild(child);

        parent.appendChild(hpiBarChart);

        document.getElementById("bar-chart").appendChild(hpiBarChartSvg);

        console.log("so far, so good...");

        hpiDiagram = new HPIDiagram("bar-chart",stateHousing);
    }
}
