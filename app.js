var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("data.csv").then(function(healthData) {
 
 healthData.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare= +d.healthcare;  
  });

console.log("data.csv")

var xLinearScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d.poverty)-0.5, d3.max(healthData, d => d.poverty)+0.5, 30])
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d.healthcare)-1, d3.max(healthData, d => d.healthcare)+1.1])
  .range([height, 0]);
  
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chart.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chart.append("g")
  .call(leftAxis);

var circlesGroup = chart.selectAll("circle").data(healthData).enter();
  
var cTip=circlesGroup
  .append("circle")  
  .classed("stateCircle", true)
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "15")
  .attr("opacity", ".5");
  
circlesGroup.append("text")
  .classed("stateText", true)
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .attr("stroke", "teal")
  .attr("font-size", "10px")
  .text(d => d.abbr)
    
  
var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
  });

cTip.call(toolTip);

cTip.on("mouseover", function(d) {
  d3.select(this).style("stroke", "black")
  toolTip.show(d, this);
})
  .on("mouseout", function(d, index) {
    d3.select(this).style("stroke", "blue")
    .attr("r", "10")
    toolTip.show(d);
  });


chart.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Lacks Healthcare (%)");

chart.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("In Poverty (%)");
    
});