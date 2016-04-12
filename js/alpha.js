String.prototype.format = function() {
  var args = arguments;
  return this.replace( /\{(\d+)\}/g, function(match, number) {
    return args[number] !== undefined ? args[number] : match;
  });
};


var citystrs = ['Guangzhou', 'Shanghai', 'Beijing', 'Chengdu', 'Shenngyang'];

var curIndex = 0;
var tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .html("<label><span id=\"tt_county\"></span></label>");

var rateById = d3.map();

var colorScale = d3.scale.linear()
  .domain([0, 300])
  .interpolate(d3.interpolateHcl)
  .range(["salmon", "black"]);

var parseDate = d3.time.format("%m/%d/%Y %H:%S").parse;


var GUANGZHOU = "4401",
  BEIJING = 'bei_jing',
  SHNAHGHAI = 'shang_hai',
  CHENGDU = '5101',
  SHENGYANG = '2101'


var pmData = d3.map();
pmData.set(GUANGZHOU, [])
pmData.set(BEIJING, [])
pmData.set(SHNAHGHAI, [])
pmData.set(CHENGDU, [])
pmData.set(SHENGYANG, [])


// var quantize = d3.scale.quantize()
//     .domain([0, 3])
//     .range(d3.range(3).map(function(i) {return "q" + i;}));

var width = 960, height = 600;

var timer;

var proj = d3.geo.mercator().center([105, 38]).scale(700).translate([width/2, height/2]);
var path = d3.geo.path().projection(proj);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.select("#nHeight").on("input", function() {
  updateHeight(+this.value);
  drawColor();
  drawBarChart();
  drawLineChart();
});

d3.select("#test").on("click", function() {
  updateButton();
});

var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 700 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .range([height, 0]);
y.domain([0, 700]);

// D3 Axis - renders a d3 scale in SVG
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10);

var svg2 = d3.select("#bar").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg2.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")

svg2.append("g")
  .attr("class", "y axis")
  .append("text") // just for the title (ticks are automatic)
  .attr("transform", "rotate(-90)") // rotate the text!
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Value");

var x2 = d3.time.scale()
  .range([0, width]);

var y2 = d3.scale.linear()
  .range([height, 0]);
y2.domain([0, 700]);


var color = d3.scale.category10();

var xAxis2 = d3.svg.axis()
  .scale(x2)
  .orient("bottom");

var yAxis2 = d3.svg.axis()
  .scale(y2)
  .orient("left");

var svg3 = d3.select("#line").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg3.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")

svg3.append("g")
  .attr("class", "y axis")
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Value");

queue()
    .defer(d3.json, "Data/map/china_cities.json")
    .defer(d3.json, "Data/map/china_provinces.json")
    .defer(d3.csv, "Data/map/china_cities.csv", function(d) {rateById.set(d.id, +d.value);})
    .defer(d3.csv, "Data/US_mission_China/Beijing_08_16_hourly/Beijing_2016_HourlyPM25_created20160301.csv", function(d) {pmData.get(BEIJING).push({time:d['Date (LST)'], value:+d.Value})})
    .defer(d3.csv, "Data/US_mission_China/Chengdu_12_16_hourly/Chengdu_2016_HourlyPM25_created20160301.csv", function(d) {pmData.get(CHENGDU).push({time:d['Date (LST)'], value:+d.Value})})
    .defer(d3.csv, "Data/US_mission_China/Guangzhou_11_16_hourly/Guangzhou_2016_HourlyPM25_created20160301.csv", function(d) {pmData.get(GUANGZHOU).push({time:d['Date (LST)'], value:+d.Value})})
    .defer(d3.csv, "Data/US_mission_China/Shenyang_13_16_hourly/Shenyang_2016_HourlyPM25_created20160301.csv", function(d) {pmData.get(SHENGYANG).push({time:d['Date (LST)'], value:+d.Value})})
    .defer(d3.csv, "Data/US_mission_China/Shuanghai_11_16_hourly/Shanghai_2016_HourlyPM25_created20160301.csv", function(d) {pmData.get(SHNAHGHAI).push({time:d['Date (LST)'], value:+d.Value})})
    .await(makeMap);

function makeMap(error, counties, states) {
  citys.forEach(function (d) {
    pmData.get(d).forEach(function (data) {
      data.time = parseDate(data.time)
      if (data.value < 0){
        data.value = 0;
      }
    })
  })
  x2.domain(d3.extent(pmData.get(GUANGZHOU), function(d) { return d.time; }));

  updateHeight(0);
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(counties.features)
        .enter()
        .append("path")
        // .attr("class", function(d) { return "q" + rateById.get(d.id); })
        .attr("d", path)
        .attr("id", function(d) {return d.id;})
        .attr("name", function(d) {return d.properties.name;})
        .on("mouseover", function(d) {
            var m = d3.mouse(d3.select("body").node());
            tooltip.style("display", null)
                .style("left", m[0] + 10 + "px")
                .style("top", m[1] - 10 + "px");
            $("#tt_county").text(d.properties.name);
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function(d) {return d.id;})
    timer = setInterval(function () {
      updateHeight();
      drawColor();
      drawBarChart();
      drawLineChart();
    }, 250);
}

function getColor(value){
  if(value < 0){
    return 300;
  }
  return Math.min(300, value);
}

var citys = [GUANGZHOU, SHNAHGHAI, BEIJING, CHENGDU, SHENGYANG];

function drawColor(){
  var selector = new String('path[id="{0}"]');
  citys.forEach(function (d) {
    var value = pmData.get(d)[curIndex].value
    svg.select("path[id='{0}']".format(d))
      .attr("fill", function(d) {return colorScale(getColor(value))})
    ;
  })
}

function updateHeight(nHeight) {
  if(nHeight){
    curIndex = nHeight;
  }
  else{
    curIndex+=1;
  }
  // adjust the text on the range slider
  d3.select("#nHeight-value").text(pmData.get(GUANGZHOU)[curIndex].time);
  d3.select("#nHeight").property("value", curIndex);

}

function updateButton() {

  // adjust the text on the range slider
  var state =  d3.select("#button-value").text();
  if (state === 'Pause'){
    clearInterval(timer);
    d3.select("#button-value").text("Play");
  }
  else{
    timer = setInterval(function () {
      if(curIndex < 743){
        updateHeight();
        drawColor();
        drawBarChart();
      } else{
        clearInterval(timer)
      }
    }, 250);
    d3.select("#button-value").text("Pause");
  }
}

function drawBarChart() {
  var data = [],
    citystrs = ['Guangzhou', 'Shanghai', 'Beijing', 'Chengdu', 'Shenngyang']
  citys.forEach(function (d, index) {
    var value = pmData.get(d)[curIndex].value;
    data.push({name: citystrs[index], value: value})
  })
  x.domain(data.map(function(d) { return d.name; }));


  // another g element, this time to move the origin to the bottom of the svg element
  // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
  //   for everything in the selection\
  // the end result is g populated with text and lines!
  svg2.select('.x.axis').transition().duration(300).call(xAxis);

  // same for yAxis but with more transform and a title
  svg2.select(".y.axis").transition().duration(300).call(yAxis)

  // THIS IS THE ACTUAL WORK!
  var bars = svg2.selectAll(".bar").data(data, function(d) { return d.value; }) // (data) is an array/iterable thing, second argument is an ID generator function

  bars.exit()
    .attr("y", y(0))
    .attr("height", height - y(0))
    .style('fill-opacity', 1e-6)
    .remove();

  // data that needs DOM = enter() (a set/selection, not an event!)
  bars.enter().append("rect")
    .attr("class", "bar")
    .attr("y", y(0))
    .attr("height", height - y(0));

  // the "UPDATE" set:
  bars.attr("x", function(d) { return x(d.name) }) // (d) is one item from the data array, x is the scale object from above
    .attr("width", x.rangeBand()) // constant, so no callback function(d) here
    .attr("y", function(d) { return y(d.value); })
    .attr("fill", function(d) {return colorScale(getColor(d.value))})
    .attr("height", function(d) { return height - y(d.value); }); // flip the height, because y's domain is bottom up, but SVG renders top down
};
var city = svg3.selectAll(".city")
function drawLineChart() {
  cities = getLineChartData(curIndex);
  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x2(d.time); })
    .y(function(d) { return y2(d.value); });

  color.domain(citystrs);

  // y2.domain([
  //   d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
  //   d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
  // ]);

  svg3.select('.x.axis').transition().duration(300).call(xAxis2);

  // same for yAxis but with more transform and a title
  svg3.select(".y.axis").transition().duration(300).call(yAxis2)
  city.remove();
  city = svg3.selectAll(".city").data(cities)

  city.enter().append("g")
    .attr("class", "city");

  city.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return color(d.name); });

  city.append("text")
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) { return "translate(" + x2(d.value.time) + "," + y2(d.value.value) + ")"; })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });
};

function getLineChartData(number) {
  data = [];
  citystrs.forEach(function (name, index) {
    temp =  {name : name};
    temp.values = pmData.get(citys[index]).slice(0, number);
    data.push(temp)
  });
  return data;
}
