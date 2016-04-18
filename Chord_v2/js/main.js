/**
 * Created by Mahmoud on 4/17/2016.
 */


// Will be used to the save the loaded JSON data
var allData;


// Variables for the visualization instances
var chordDiagram;


// Start application by loading the data
loadData();

function loadData() {
    d3.csv("data/House_Sales_2005.csv", function(error, csv){
        if(!error){
            allData = csv;
            createVis();
        }
    });
}

function createVis() {

    chordDiagram =  new ChordDiagram("chord", allData)

}

