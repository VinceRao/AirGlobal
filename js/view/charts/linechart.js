define([
  'backbone',
  'jquery',
  'd3'
], function (Backbone, $, d3) {
  var LineChart = Backbone.View.extend({
    initialize : function (opts) {
      this.data = opts.data.berkeley;
      this.$el.appendTo(opts.rootView.$el);
      this.linchartData = [];
      this.id = 1;
    },

    chart : function(elem) {
      var color, defs, height, line, margin, maxDays, minDays, svg, width, x, xAxis, y, yAxis, zoom;
      margin = {
        top: 20,
        right: 100,
        bottom: 50,
        left: 50
      };

      width = 1500 - margin.left - margin.right;
      height = 400 - margin.top - margin.bottom;
      maxDays = 50;
      minDays = 4;
      x = d3.scale.linear().range([0, width]);
      y = d3.scale.linear().range([height, 0]);
      color = d3.scale.category10();
      xAxis = d3.svg.axis().scale(x).tickFormat(function(d) {
        //console.log(d);
        if (Math.floor(d) !== d) {

        } else {
          return 'day ' + d;
        }
      }).orient("bottom");

      yAxis = d3.svg.axis().scale(y).orient("left");
      line = d3.svg.line().interpolate("monotone").x(function(d) {
        //console.log(d);
        return x(d.day);
      }).y(function(d) {
        return y(d.temp);
      });

      zoom = d3.behavior.zoom().x(x).scaleExtent([1, 2]).on('zoom', function() {
        var tx, ty;
        tx = d3.event.translate[0];
        ty = d3.event.translate[1];
        tx = Math.min(1, Math.max(tx, width - Math.round(x(maxDays) - x(1)), width - Math.round(x(maxDays) - x(1)) * d3.event.scale));
        zoom.translate([tx, ty]);
        svg.select('.x.axis').call(xAxis);
        svg.selectAll('.line').attr("d", function(d) {
          return line(d.temps);
        }).style("stroke", function(d) {
          return color(d.name);
        });
        return svg.selectAll('circle.dot').attr('cy', function(d) {
          return y(d.temp);
        }).attr('cx', function(d) {
          return x(d.day);
        }).attr('r', 2);
      });

      //if(svg){
      //  svg.remove();
      //}
      var tempro = d3.select(elem).selectAll("svg");
      tempro.remove();
      svg = d3.select(elem).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      svg.append("rect")
          .attr('class', 'zoom-panel')
          .attr("width", width)
          .attr("height", height)
          .call(zoom);
      defs = svg.append('svg')
          .attr('width', 0)
          .attr('height', 0)
          .append('defs');
      defs.append('clipPath')
          .attr('id', 'clipper')
          .append('rect').attr('x', 0)
          .attr('y', 0).attr('width', width)
          .attr('height', height);
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0,0)")
          .call(yAxis).append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -40).attr('x', -180)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Temperature");

      //compute the maxday minday and maxtemp and mintemp for scale extent
      return function(data) {
        //console.log(data)
        var city, cityEnter;
        maxDays = d3.max(data, function(m) {
          return d3.max(m.temps, function(d) {
            return d.day;
          });
        });
        //console.log(maxDays);
        x.domain([1, maxDays]);
        y.domain([
          d3.min(data, function(d) {
            return d3.min(d.temps, function(t) {
              return t.temp;
            });
          }), d3.max(data, function(d) {
            return d3.max(d.temps, function(t) {
              return t.temp;
            });
          })
        ]);

        zoom.scaleExtent([1, maxDays / minDays]);
        svg.selectAll('.x.axis').transition().duration(500).call(xAxis);
        svg.selectAll('.y.axis').transition().duration(500).call(yAxis);
        city = svg.selectAll(".city").data(data, function(c) {
          return c.id;
        });
        //console.log(city);
        cityEnter = city.enter().append("g").attr("class", "city");
        cityEnter.append("path").attr('clip-path', 'url(#clipper)').attr("class", "line");
        city.select('path').transition().duration(500).attr("d", function(d) {
          return line(d.temps);
        }).style("stroke", function(d) {
          return color(d.name);
        });

        cityEnter.append('g')
            .attr('class', 'dots')
            .attr('clip-path', 'url(#clipper)')
            .selectAll('circle')
            .data(function(d) {
              //console.log(d);
              return d.temps;
            }).enter().append('circle').attr('class', 'dot');
        city.select('.dots').style('stroke', function(d) {
          return color(d.name);
        }).selectAll('circle').transition().duration(500).attr('cy', function(d) {
          //console.log(d.temp);
          return y(d.temp);
        }).attr('cx', function(d) {
          return x(d.day);
        }).attr('r', 2);
        cityEnter.append("text").attr('class', 'city-name');
        city.select("text.city-name").attr("x", width + 20).attr("y", function(d, i) {
          return i * 20;
        }).attr("dy", ".35em").text(function(d) {
          return d.name;
        });
        cityEnter.append('circle').attr('class', 'city-dot');
        city.select('circle.city-dot').attr('cx', width + 10).attr('cy', function(d, i) {
          return i * 20;
        }).attr('r', 2).style('fill', function(d) {
          return color(d.name);
        });
        city.exit().remove();
        return zoom.x(x);
      };
    },

    formateDataForDrawLine : function(city) {
      var data, j;
      var airData = this.data.getAllDayForCity(city);
      console.log("I am formate" + airData);
      data = {
        id: this.id,
        name: "City " + city,
        temps: (function() {
          var results;
          results = [];
          for (j = 0; j < airData.length; j++) {
            //console.log("I am Nan" + airData[j]);
            if(_.isNaN(+airData[j]))
              continue;
            results.push({
              day: j+1,
              temp: Math.round(airData[j])
            });
          }
          return results;
        })()
      };
      this.id = this.id + 1;
      return data;
    },


    //airDataGen : (function() {
    //  return (function(id) {
    //    return function() {
    //      var data, j, nums, tempSeed;
    //      //nums = Math.ceil(Math.random() * 11) + 4;
    //      //tempSeed = Math.round(Math.random() * 30);
    //      data = {
    //        id: id,
    //        name: "City " + "beijing",
    //        temps: (function() {
    //          var results;
    //          results = [];
    //          for (j = 1; j < 11; j++) {
    //            if(j==1){
    //              continue;
    //            }
    //            results.push({
    //              day: j,
    //              temp: Math.round(Math.random() * 50)
    //            });
    //          }
    //          return results;
    //        })()
    //      };
    //      id = id + 1;
    //      return data;
    //    };
    //  })(1);
    //})(),



    drawLineByCity : function (cityName){
      var self = this;
      var data = self.formateDataForDrawLine(cityName);
      console.log("I am draw");
      console.log(data);
      cityCheck = document.getElementById(cityName);
      cityCheck.addEventListener('change', function(){
      if(cityCheck.checked){
        self.linchartData.push(data);
        return self.chart(self.el)(self.linchartData);
      }else {
        for(var i = 0; i<self.linchartData.length;i++){
          if(self.linchartData[i].name=="City "+cityName){
            console.log("I am remove");
            self.linchartData.splice(i,1);
            return self.chart(self.el)(self.linchartData);
          }
        }
      }
    });
    },



    render : function () {
      var data = this.formateDataForDrawLine("Shanghai");
      //console.log("I adata);

      this.linchartData.push(data);

      //this.linchartData.push(aa);
      this.chart(this.el)(this.linchartData);
      this.drawLineByCity("Beijing");
    }
  })
  return LineChart;
});