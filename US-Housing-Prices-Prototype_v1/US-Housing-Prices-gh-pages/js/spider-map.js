// Canvas
var margin = { top: 30, right: 0, bottom: 0, left: 0 };

var width = 450 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#spider-diagram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Spider diagram fixed components

var radius = 150;

var outerCircle = svg.append("circle")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", radius);

var innerCircle1 = svg.append("circle")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", radius * 0.75);

var innerCircle2 = svg.append("circle")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", radius * 0.5);

var innerCircle2 = svg.append("circle")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", radius * 0.25);

var housingLine = svg.append("path")
    .attr("d", "M " + width/2 + " " + height/2 + " L " + width/2 + " " + (height/2 - radius));

var HDILine = svg.append("path")
    .attr("d", "M " + width/2 + " " + height/2 + " L " + width/2 + " " + (height/2 + radius));

var GDPLine = svg.append("path")
    .attr("d", "M " + width/2 + " " + height/2 + " L " + (width/2 - radius) + " " + height/2);

var priceOverIncomeLine = svg.append("path")
    .attr("d", "M " + width/2 + " " + height/2 + " L " + (width/2 + radius) + " " + height/2);

var rentLine = svg.append("path")
    .attr("d", "M " + width/2 + " " + height/2 + " L " + (width/2 + radius / Math.sqrt(2)) + " " + (height/2 - radius / Math.sqrt(2)));

var HPILine = svg.append("path")
    .attr("d", "M " + width/2 + " " + height/2 + " L " + (width/2 - radius / Math.sqrt(2)) + " " + (height/2 - radius / Math.sqrt(2)));

var populationLine = svg.append("path")
    .attr("d", "M " + width/2 + " " + height/2 + " L " + (width/2 - radius / Math.sqrt(2)) + " " + (height/2 + radius / Math.sqrt(2)));

var incomeLine = svg.append("path")
    .attr("d", "M " + width/2 + " " + height/2 + " L " + (width/2 + radius / Math.sqrt(2)) + " " + (height/2 + radius / Math.sqrt(2)));


//Test Case

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

function drawPolygon(a, b) {

    var houseComp = a.median_house_price / b.median_house_price;
    var rentComp = a.median_rent / b.median_rent;
    var indexComp = (a.median_house_price / a.household_income) / 20; // Arbitrarily set 20 as max index
    var incomeComp = a.household_income / b.household_income;
    var HDIComp = a.HDI / b.HDI;
    var popComp = a.population / b.population;
    var GDPComp = a.GDP / b.GDP;
    var HPIComp = a.house_price_index / b.house_price_index;

    var result =
        "M " + width/2 + " " + (height/2 - houseComp * radius)
        + " L " + (width/2 + rentComp * radius / Math.sqrt(2)) + " " + (height/2 - rentComp * radius / Math.sqrt(2))
        + " L " + (width/2 + indexComp * radius) + " " + height/2
        + " L " + (width/2 + incomeComp * radius / Math.sqrt(2)) + " " + (height/2 + incomeComp * radius / Math.sqrt(2))
        + " L" + width/2 + " " + (height/2 + radius * HDIComp)
        + " L" + (width/2 - popComp * radius / Math.sqrt(2)) + " " + (height/2 + popComp * radius / Math.sqrt(2))
        + " L" + (width/2 - GDPComp * radius) + " " + height/2
        + " L" + (width/2 - HPIComp * radius / Math.sqrt(2)) + " " + (height/2 - HPIComp * radius / Math.sqrt(2)) + " Z";

    return String(result);
}

