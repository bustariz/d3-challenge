// define svg area dimensions
var svgHeight = 600;
var svgWidth = 800;

// define chart margins
var chartMargins = {
    top:80,
    right:80,
    bottom :80,
    left:80,
};

var chartHeight = svgHeight - chartMargins.top - chartMargins.bottom;
var chartWidth = svgWidth - chartMargins.left - chartMargins.right;

// add svg element using d3
var svg = d3.select('#scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth)
    .classed('chart', true);

var chartGroup = svg.append('g')
    .attr('transform',`translate(${chartMargins.left},${chartMargins.top})`);


// X axis label
svg.append('g')
    .classed('xText',true);

var xLabelText = d3.select('.xText');
    // .attr('transform',`translate((${svgWidth/2 - chartMargins.left}),(${svgHeight - chartMargins.top}))`)
    
    
xLabelText.append('text')
.attr('x',svgWidth/2)
.attr('y',svgHeight - chartMargins.top/2)
.attr("data-name", "poverty")
.attr("data-axis", "x")
.attr("class", "aText active x")
.text("In Poverty (%)");

// Y axis label
svg.append('g')
.classed('yText',true);

var yLabelText = d3.select('.yText');
    // .attr('transform',`translate((${chartMargins.left},(${chartMargins.top}))rotate(-90)`)

    
yLabelText.append('text')
.attr('transform',"translate(" + chartMargins.left/2 + ", " + svgHeight/2 + ")rotate(-90)")
.attr("data-name", "healthcare")
.attr("data-axis", "y")
.attr("class", "aText active y")
.text("Lacks Healthcare (%)");




// creates chart viz
d3.csv('assets/data/data.csv').then(data=> {
    // console.log(data)


    data.forEach(d=>{
        d.poverty = parseFloat(d.poverty);
        d.healthcare = parseFloat(d.healthcare)
    });

    // config band scale - x values
    var xScale = d3.scaleLinear()
        .domain([(d3.min(data , d=> d.poverty)*.90),(d3.max(data , d=> d.poverty)*1.10)])
        .range([0,chartWidth]);

    var yScale = d3.scaleLinear()
        .domain([(d3.min(data , d=> d.healthcare)*.90),(d3.max(data , d=> d.healthcare)*1.10)])
        .range([chartHeight,0]);


    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Append an SVG group element to the chartGroup, create the left axis inside of it
    var yAxis = chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

    // Append an SVG group element to the chartGroup, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    var xAxis = chartGroup.append("g")
    .classed("axis", true)
    .attr("transform",`translate(0,${chartHeight})`)
    .call(bottomAxis);


    // circles plotting
    var circles = chartGroup.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 10)
    .attr("cx", function (d) {
          return xScale(d.poverty);
    })
    .attr("cy", function (d) {
         return yScale(d.healthcare);
    })
    .attr("class", function(d) {
        return "stateCircle " + d.abbr;
      });

    circles.append("text")
    .text(function(d) {
        return d.abbr;
      })
    .attr("dx", function(d) {
      return xScale(d.poverty);
    })
    .attr("y", function(d) {
      return yScale(d.healthcare)+10/2.5;
    })
    .attr("font-size", 10)
    .classed("stateText",true);

});