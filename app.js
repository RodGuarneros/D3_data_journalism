// @TODO: YOUR CODE HERE!

// Step 1: Set up the chart
const svgWidth = 850;
const svgHeight = 500;

const margin = {
 top: 20,
 right: 40,
 bottom: 80,
 left: 80
};

const width = svgWidth - margin.right - margin.left
const height = svgHeight - margin.top - margin.bottom

// Step 2: Create a scalable vector graphic (SVG) wrapper
// that will hold our chart, and shift the latter by left
// top margins
const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// Step 4: Append an svg group (group tag)
var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

// var chartGroup1 = svg.append("g")
//         .attr("transform", `translate(${margin.right}, ${margin.bottom})`);


// Step 5: Defining initial params in x axis
var chosenXAxis = "income";
var chosenYAxis = "obesity";

// Step 6: Function 1 to update  x scale var upon click on axis level
function xScale(db, chosenXAxis){
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(db, d=>d[chosenXAxis]*0.9),
            d3.max(db, d => d[chosenXAxis])     
        ])
        .range([0, width]);

    return xLinearScale

};

function yScale(db, chosenYAxis){
    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(db, d=> d[chosenYAxis]*.9),
            d3.max(db, d => d[chosenYAxis]*1.05)    
        ])
        .range([height,0]);

    return yLinearScale

};

// Step 7: Updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
};

// Step 8: Updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxisy = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxisy);
    
    return yAxis;
};

// Step 8: Function used to update circles group with a transition
// to new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d=> newXScale(d[chosenXAxis]));
    return circlesGroup;
};

function renderYCircles(circlesGroup, newYScale, chosenYAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", m=> newYScale(m[chosenYAxis]));

    return circlesGroup;
};

function renderXText(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  function renderYText(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("dy", d => newYScale(d[chosenYAxis])+5);
  
    return circlesGroup;
  }

// Step 9: function used for updating circles group with tooltips 
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis){

        var label;

        if(chosenXAxis === "income") {
            label = "Income: $";
        }else if (chosenXAxis === "age"){
            label = "Age:"
        }else{
            label = "Poverty:"
        }

        var label2;

        if(chosenYAxis === "obesity"){
            label2 = "Obesity:";
        }else if (chosenYAxis === "healthcare"){
            label2 = "Healthcare:";
        }else{
            label2 = "Smoking:"
        }
   
var toolTip = d3.tip()
        .attr("class", "tooltip")
        .direction('e')
        .style("background-color", "darkred")
        .style("border", "solid")
        .style("padding","8px")
        .style("border-radius", "5px")
        .style("border-width", "2px")
        .html(function(d) {
          return (`<b>${d.state}</b><br>${label} ${d[chosenXAxis]}<br>${label2} ${d[chosenYAxis]}`);
});
    
circlesGroup.call(toolTip);

// Mouseover event listener
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data);
    })

// Mouseout event
    .on("mouseout", function(data, index){
            toolTip.hide(data)
        });

    return circlesGroup;
}

// Step 3: Import data from the csv file and get every variable
d3.csv("data.csv").then(db=>{
        console.log(db)
        db.forEach(function(data) {
            data.age = +data.age;
            data.healthcare = +data.healthcare;
            data.income = +data.income;
            data.obesity = +data.obesity;
            data.poverty = +data.poverty;
            data.smokes = +data.smokes
        });

// xLinearScale function obeve csv import
let xLinearScale = xScale(db,chosenXAxis);
let yLinearScale = yScale(db,chosenYAxis);

// Create y scale function
// create initial axis functions
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

// append x axis "g"
let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0,${height - margin.bottom +80})`)
        .call(bottomAxis);

//apprend y axis
let yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(0,0)`)
        .call(leftAxis);

// append initial circles
let circlesGroup = chartGroup.selectAll("g circle")
    .data(db)
    .enter()
    .append("g")
    .attr("class", "circles");

let circlesXY = circlesGroup.append("circle")
    .attr("cx", a => xLinearScale(a[chosenXAxis]))
    .attr("cy", a => yLinearScale(a[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "darkblue")
    .attr("stroke", "lightgreen")
    .classed("stateCircle", true);

let circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]) + 5)
    .classed("stateText", true);

// Create groyp for two x-axis labels
const labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width}/2, ${height})`);

const incomeLabel = labelsGroup.append("text")
        .attr("x",width/2)
        .attr("y",height +35)
        .attr("value", "income")
        .classed("active", true)
        .text("Average income by state")

const ageLabel = labelsGroup.append("text")
        .attr("x",width/2)
        .attr("y",height +55)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age by state (Median)")
        
const povertyLabel = labelsGroup.append("text")
        .attr("x",width/2)
        .attr("y",height +75)
        .attr("value", "poverty")
        .classed("inactive", true)
        .text("% of People in Poverty by state")



//Create groyp for two y-axis labels
const labelsGroupy = chartGroup.append("g");

const obesityLabel = labelsGroupy.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x",-(height/2))
        .attr("y",-65)
        .attr("value", "obesity")
        .classed("active", true)
        .text("% of Obesity")
        
const healthcareLabel = labelsGroupy.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x",-(height/2))
        .attr("y",-45)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("% Without Healthcare")
        
const smokingLabel = labelsGroupy.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x",-(height/2))
        .attr("y",-30)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("% of Smokers")



// updateTooltip function above csv import
circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

// Lets define the event listener for x labels
labelsGroup.selectAll("text")
        .on("click", function() {
        // get value of of selection
            const value = d3.select(this).attr("value");
            if(value !== chosenXAxis) {
        // Replace chosenXAxis with value
                chosenXAxis = value;
        // functions here found above csv import
        // update x scale for new data
        xLinearScale = xScale(db, chosenXAxis);
        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        // updates circles with new x values
        circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);

         // updates circles text with new x values
        circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

        // changes classes to change bold text
        if(chosenXAxis === "age"){
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
        }else if (chosenXAxis === "income"){
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            }else{
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);

            }
        }
    });

labelsGroupy.selectAll("text")
    .on("click", function() {
    // get value of of selection
        const value = d3.select(this).attr("value");
        if(value !== chosenYAxis) {
    // Replace chosenXAxis with value
            chosenYAxis = value;
    // functions here found above csv import
    // update x scale for new data
    yLinearScale = yScale(db, chosenYAxis);
    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);
    // updates circles with new x values
    circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);

    // updates circles text with new y values
    circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

    // changes classes to change bold text
    if(chosenYAxis === "obesity"){
        obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        smokingLabel
            .classed("active", false)
            .classed("inactive", true);
    }else if (chosenYAxis === "healthcare"){
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        smokingLabel
            .classed("active", false)
            .classed("inactive", true);
        }else{
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        smokingLabel
            .classed("active", true)
            .classed("inactive", false);

        }
    }
});

})