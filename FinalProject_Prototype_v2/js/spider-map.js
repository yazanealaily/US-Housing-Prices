// Spider diagram object
SpiderDiagram = function(_parentElement){
    this.parentElement = _parentElement;
    this.initVis();
}

SpiderDiagram.prototype.initVis = function() {

    var vis = this;

    // Canvas
    vis.margin = {top: 30, right: 50, bottom: 0, left: 0};

    vis.width = 550 - vis.margin.left - vis.margin.right;
    vis.height = 400 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#spider-diagram").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //Spider diagram circles and lines

    vis.radius = 150;

    vis.outerCircle = vis.svg.append("circle")
        .attr("cx", vis.width / 2)
        .attr("cy", vis.height / 2)
        .attr("r", vis.radius);

    vis.innerCircle1 = vis.svg.append("circle")
        .attr("cx", vis.width / 2)
        .attr("cy", vis.height / 2)
        .attr("r", vis.radius * 0.75);

    vis.innerCircle2 = vis.svg.append("circle")
        .attr("cx", vis.width / 2)
        .attr("cy", vis.height / 2)
        .attr("r", vis.radius * 0.5);

    vis.innerCircle2 = vis.svg.append("circle")
        .attr("cx", vis.width / 2)
        .attr("cy", vis.height / 2)
        .attr("r", vis.radius * 0.25);

    vis.housingLine = vis.svg.append("path")
        .attr("d", "M " + vis.width / 2 + " " + vis.height / 2 + " L " + vis.width / 2 + " " + (vis.height / 2 - vis.radius));

    vis.HDILine = vis.svg.append("path")
        .attr("d", "M " + vis.width / 2 + " " + vis.height / 2 + " L " + vis.width / 2 + " " + (vis.height / 2 + vis.radius));

    vis.GDPLine = vis.svg.append("path")
        .attr("d", "M " + vis.width / 2 + " " + vis.height / 2 + " L " + (vis.width / 2 - vis.radius) + " " + vis.height / 2);

    vis.priceOverIncomeLine = vis.svg.append("path")
        .attr("d", "M " + vis.width / 2 + " " + vis.height / 2 + " L " + (vis.width / 2 + vis.radius) + " " + vis.height / 2);

    vis.rentLine = vis.svg.append("path")
        .attr("d", "M " + vis.width / 2 + " " + vis.height / 2 + " L " + (vis.width / 2 + vis.radius / Math.sqrt(2)) + " " + (vis.height / 2 - vis.radius / Math.sqrt(2)));

    vis.HPILine = vis.svg.append("path")
        .attr("d", "M " + vis.width / 2 + " " + vis.height / 2 + " L " + (vis.width / 2 - vis.radius / Math.sqrt(2)) + " " + (vis.height / 2 - vis.radius / Math.sqrt(2)));

    vis.populationLine = vis.svg.append("path")
        .attr("d", "M " + vis.width / 2 + " " + vis.height / 2 + " L " + (vis.width / 2 - vis.radius / Math.sqrt(2)) + " " + (vis.height / 2 + vis.radius / Math.sqrt(2)));

    vis.incomeLine = vis.svg.append("path")
        .attr("d", "M " + vis.width / 2 + " " + vis.height / 2 + " L " + (vis.width / 2 + vis.radius / Math.sqrt(2)) + " " + (vis.height / 2 + vis.radius / Math.sqrt(2)));

    // Spider diagram text

    vis.svg.append("text")
        .attr("x", vis.width/2)
        .attr("y", vis.height/2 - vis.radius - 10)
        .attr("text-anchor", "middle")
        .text("Median House Price")
        .style("fill", "white");

    vis.svg.append("text")
        .attr("x", vis.width/2 + vis.radius / Math.sqrt(2))
        .attr("y", vis.height/2 - vis.radius / Math.sqrt(2) - 10)
        .attr("text-anchor", "start")
        .text("Median Rent")
        .style("fill", "white");

    vis.svg.append("text")
        .attr("x", vis.width/2 + vis.radius + 10)
        .attr("y", vis.height/2 + 5)
        .attr("text-anchor", "start")
        .text("Price / Income")
        .style("fill", "white");

    vis.svg.append("text")
        .attr("x", vis.width/2 + vis.radius / Math.sqrt(2) + 10)
        .attr("y", vis.height/2 + vis.radius / Math.sqrt(2) + 10)
        .attr("text-anchor", "start")
        .text("Household Income")
        .style("fill", "white");

    vis.svg.append("text")
        .attr("x", vis.width/2)
        .attr("y", vis.height/2 + vis.radius + 20)
        .attr("text-anchor", "middle")
        .text("HDI")
        .style("fill", "white");

    vis.svg.append("text")
        .attr("x", vis.width/2 - vis.radius / Math.sqrt(2) - 10)
        .attr("y", vis.height/2 + vis.radius / Math.sqrt(2) + 10)
        .attr("text-anchor", "end")
        .text("Population")
        .style("fill", "white");

    vis.svg.append("text")
        .attr("x", vis.width/2 - vis.radius  - 10)
        .attr("y", vis.height/2 + 5)
        .attr("text-anchor", "end")
        .text("GDP")
        .style("fill", "white");

    vis.svg.append("text")
        .attr("x", vis.width/2 - vis.radius / Math.sqrt(2) - 10)
        .attr("y", vis.height/2 - vis.radius / Math.sqrt(2) - 10)
        .attr("text-anchor", "end")
        .text("Price Index")
        .style("fill", "white");
};

SpiderDiagram.prototype.drawPolygon = function(a, b) {

    var vis = this;

    var houseComp = a.median_house_price / b.median_house_price;
    var rentComp = a.median_rent / b.median_rent;
    var indexComp = (a.median_house_price / a.household_income) / 20; // Arbitrarily set 20 as max index
    var incomeComp = a.household_income / b.household_income;
    var HDIComp = a.HDI / b.HDI;
    var popComp = a.population / b.population;
    var GDPComp = a.GDP / b.GDP;
    var HPIComp = a.house_price_index / b.house_price_index;

    var result =
        "M " + vis.width/2 + " " + (vis.height/2 - houseComp * vis.radius)
        + " L " + (vis.width/2 + rentComp * vis.radius / Math.sqrt(2)) + " " + (vis.height/2 - rentComp * vis.radius / Math.sqrt(2))
        + " L " + (vis.width/2 + indexComp * vis.radius) + " " + vis.height/2
        + " L " + (vis.width/2 + incomeComp * vis.radius / Math.sqrt(2)) + " " + (vis.height/2 + incomeComp * vis.radius / Math.sqrt(2))
        + " L " + vis.width/2 + " " + (vis.height/2 + vis.radius * HDIComp)
        + " L " + (vis.width/2 - popComp * vis.radius / Math.sqrt(2)) + " " + (vis.height/2 + popComp * vis.radius / Math.sqrt(2))
        + " L " + (vis.width/2 - GDPComp * vis.radius) + " " + vis.height/2
        + " L " + (vis.width/2 - HPIComp * vis.radius / Math.sqrt(2)) + " " + (vis.height/2 - HPIComp * vis.radius / Math.sqrt(2)) + " Z";

    return String(result);

};


 //Test Case
/*


 var baseCase = {
    median_house_price: 300,
    median_rent: 50,
    house_price_index: 120,
    GDP: 1000,
    population: 30000,
    HDI: 0.7,
    household_income: 25
}

var compCase = {
    median_house_price: 200,
    median_rent: 30,
    house_price_index: 60,
    GDP: 850,
    population: 20000,
    HDI: 0.65,
    household_income: 22
}


svg.append("path")
    .attr("d", drawPolygon(compCase, baseCase))
    .style("fill", "red")
    .style("opacity", "0.5");
*/
