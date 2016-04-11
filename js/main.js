queue()
    .defer(d3.json, "data/STATE.json")
    .defer(d3.csv, "data/state-data.csv")
    .await(loadData);

var stateData, stateTopo;

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

function createVis() {

    choroplethMap = new choroplethMap("map",stateData,stateTopo);

}

function cleanStateData(element) {
    element["index_nsa"] = +element["index_nsa"];
}