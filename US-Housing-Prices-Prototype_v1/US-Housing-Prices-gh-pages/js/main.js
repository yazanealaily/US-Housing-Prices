var allData;

queue()
    .defer(d3.json, "data/STATE.json")
    .defer(d3.csv, "data/state-data.csv")
    .await(loadData);

loadChordData();
	
var stateData, stateTopo, chordDiagram;;

function loadData(error, STATE, DATA) {

    // Save topoJSON data in global variable
    stateTopo = STATE;

    // Clean housing data at state level
    DATA.forEach(function(el){
        cleanStateData(el);
    });

    // Save housing data at state level in global variable
    stateData = DATA;

    createVis();
}

function loadChordData() {
    d3.csv("data/House_Sales_2005.csv", function(error, csv){
        if(!error){
            allData = csv;
            createVis();
        }
    });
}



function createVis() {

    choroplethMap = new choroplethMap("map",stateData,stateTopo);
	chordDiagram =  new ChordDiagram("chord", allData);
	
}

function cleanStateData(element) {
    element["index_nsa"] = +element["index_nsa"];
}