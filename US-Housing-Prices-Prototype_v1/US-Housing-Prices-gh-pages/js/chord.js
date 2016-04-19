/**
 * Created by Mahmoud on 4/13/2016.
 * code modified from http://jrue.github.io/coding/2014/exercises/basicchordchart/
 */


ChordDiagram = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling

    this.initVis();
}


ChordDiagram.prototype.initVis = function(){
    var vis = this;

    vis.wrangleData();

    vis.margin = {top: 50, right: 10, bottom: 10, left: 50};
    vis.width = 960 - vis.margin.left - vis.margin.right,
    vis.height = 600 - vis.margin.top - vis.margin.bottom;
    vis.innerRadius = Math.min(vis.width, vis.height) * .35,
    vis.outerRadius = vis.innerRadius * 1.1;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
        .append("g")
        //.attr("class", "chordgraph")
        .attr("transform", "translate(" + vis.width/2 + "," + vis.height/2 + ")");


    vis.chord = d3.layout.chord()
        .padding(.1)
        .sortSubgroups(d3.descending)
        .matrix(vis.matrix);

    vis.chordgroups = vis.chord.groups().map(function(d){
        d.angle = (d.startAngle + d.endAngle)/2;
        return d;
    });

    vis.arc = d3.svg.arc()
        .innerRadius(vis.innerRadius)
        .outerRadius(vis.outerRadius);

    vis.fill = d3.scale.category10();

    vis.svg.selectAll("path")
        .data(vis.chord.groups)
        .enter()
        .append("path")
        .style("fill", function(d, i){ return (d.index+1) > vis.fo.length ? vis.fill(d.index): "#ccc";})
        .style("stroke", function(d, i) { return "#000"; })
        .style("cursor", "pointer")
        .attr("d", vis.arc)
        .on("mouseover", function(d, i){
            vis.chords.classed("fade", function(d){
                return d.source.index != i && d.target.index != i;
            })
        })
        .on("mouseout", function(d, i){
            vis.chords.classed("fade", function(d){
                return d.target.index ? false : true;
            })
        });


    vis.chords = vis.svg.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(vis.chord.chords)
        .enter()
        .append("path")
        .classed("fade", function(d,i){return d.target.index ? false : true;})
        .attr("d", d3.svg.chord().radius(vis.innerRadius))
        .style("fill", function(d) { return vis.fill(d.source.subindex); })
        .style("stroke", function(d){ return "#000";});

    vis.svg.selectAll(".text")
        .data(vis.chordgroups)
        .enter()
        .append("text")
        .attr("class", "text")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d){

            //rotate each label around the circle
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                "translate(" + (vis.outerRadius + 10) + ")" +
                (d.angle > Math.PI ? "rotate(180)" : "");

        })
        .text(function(d,i){
            //set the text content
            return vis.fc[i];
        })


}

ChordDiagram.prototype.wrangleData = function() {
    var vis = this;


   vis.firstColumn = "first_column";

    //store column names
    vis.fc = vis.data.map(function(d){ return d[vis.firstColumn]; }),
        vis.fo = vis.fc.slice(0),
        vis.maxtrix_size = (Object.keys(vis.data[0]).length - 1) + vis.fc.length,
        vis.matrix  = [];

    //Create an empty square matrix of zero placeholders, the size of the ata
    for(var i=0; i < vis.maxtrix_size; i++){
        vis.matrix.push(new Array(vis.maxtrix_size+1).join('0').split('').map(parseFloat));
    }

    //go through the data and convert all to numbers except "first_column"
    for(var i=0; i < vis.data.length; i++) {

        var j = vis.data.length;//counter

        for (var prop in vis.data[i]) {
            if (prop != vis.firstColumn) {
                vis.fc.push(prop);
                vis.matrix[i][j] = +vis.data[i][prop];
                vis.matrix[j][i] = +vis.data[i][prop];
                j++;
            }
        }

    }

    vis.updateVis();
}

ChordDiagram.prototype.updateVis = function() {


}
