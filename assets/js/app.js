var hasRun = true;

var imgSvgB = 1024;
var imgSvgW = 890;
var imgSvgH = 410;
var imgSvgL = 700;

var imgMargins = {top: 20, right: 40, bottom: 60, left: 100};

//
//--add append function here due to previous error-->
//

var width = imgSvgW - imgMargins.left - imgMargins.right;
var height = imgSvgH - imgMargins.top - imgMargins.bottom;

var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', imgSvgW)
  .attr('height', imgSvgH)
  .append('g')
  .attr('transform', 'translate(' + imgMargins.left + ',' + imgMargins.top + ')');

var chart = svg.append('g');

d3.csv('assets/data/SnoopData.csv', function(err, SnoopData) {
  if (err) throw err;

  SnoopData.forEach(function(data) {
    data.povertyPercentage = +data.povertyPercentage;
    data.noCoveragePer = +data.noCoveragePer;
  });

  var yLinearScale = d3.scaleLinear().range([height, 0]);
  var xLinearScale = d3.scaleLinear().range([0, width]);
  //stackoverflow link here-->
  

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  xLinearScale.domain([
    7,
    d3.max(SnoopData, function(data) {
      return +data.povertyPercentage;
    }),
  ]);
  yLinearScale.domain([
    0,
    d3.max(SnoopData, function(data) {
      return +data.noCoveragePer * 1.2;
    }),
  ]);

  var tooltip13 = d3
    .tip()
    .attr('class', 'tooltip13')
    .offset([80, -60])
    .html(function(data) {
      var bandName = data.State;
      var hairLength = +data.povertyPercentage;
      var numHits = +data.noCoveragePer;
      return (
        bandName + '<br> % Poverty Level: ' + hairLength + '<br> % No Health Care: ' + numHits
      );
    });


  chart.call(tooltip13);



  chart
    .selectAll('circle')
    .data(SnoopData)
    .enter()
    
    .append('circle')
    .attr('cx', function(data, index) {
      return xLinearScale(data.povertyPercentage);
    })
    
    .attr('cy', function(data, index) {
      return yLinearScale(data.noCoveragePer);
    })
    
    
    .attr('r', '15')
    .attr('fill', 'black')
    
    .on('click', function(data) {
      tooltip13.show(data);
    })
    
    .on('mouseout', function(data, index) {
      tooltip13.hide(data);
    });

  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append('g').call(leftAxis);


  svg.selectAll(".dot")
  .data(SnoopData)
  .enter()
  .append("text")
  
  .text(function(data) { return data.Abbrv; })
  .attr('x', function(data) {
    return xLinearScale(data.povertyPercentage);
  })
  
  .attr('y', function(data) {
    return yLinearScale(data.noCoveragePer);
  })
  .attr("font-size", "9px")
  
  
  .attr("fill", "white")
  
  .style("text-anchor", "middle");


  chart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - imgMargins.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'displayText13')
    .text('No Healthcare (Percentage)');

  


  chart
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + imgMargins.top + 20) + ')',
    )
    .attr('class', 'displayText13')
    .text('Poverty Level (Percentage)');
});

