define([
  'backbone',
  'jquery',
  'd3'
], function (Backbone, $, d3) {
  var LineChart = Backbone.View.extend({
    initialize : function (opts) {
      this.data = opts.data;
      this.$el = $('#linechart')
      this.linchartData = [];
      this.id = 1;
      this.daydate;
    },

    chart : function(elem) {
      var color, defs, height, line, margin, maxDays, minDays, svg, width, x, xAxis, y, yAxis, zoom;
      margin = {
        top: 20,
        right: 100,
        bottom: 50,
        left: 50
      };

      var div = d3.select("body").append("div")
        .attr("class", "tooltipline")
        .style("opacity", 0);

      var self = this;
      width = +this.$el.width() - margin.left - margin.right;
      height = +this.$el.height() - margin.top - margin.bottom;
      maxDays = 50;
      minDays = 4;
      x = d3.scale.linear().range([0, width]);
      y = d3.scale.linear().range([height, 0]);
      color = d3.scale.category10();
      xAxis = d3.svg.axis().scale(x).tickFormat(function(d) {
        if (Math.floor(d) !== d) {

        } else {
          //var date = self.data.getMicroseconds(d);
          //var time = new Date(date);
          //daydate = (time.getMonth()+1).toString()+'/'
          //    +(time.getDate()-1).toString()+'/'+time.getFullYear().toString();
          return  self.showSpecificDate(d);
        }
      }).orient("bottom");

      yAxis = d3.svg.axis().scale(y).orient("left");
      line = d3.svg.line().interpolate("monotone").x(function(d) {
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
        }).attr('r', 3).on('mouseover',function(d){
          var day = self.showSpecificDate(d.day);
          var pm = "PM: " + d.temp;
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html(day + "<br/>"  + pm)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        }).on("mouseout", function() {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
      });

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
        .style("text-anchor", "center")
        .style("font-size","13px")
        .text("Air Pollution PM25");


      //compute the maxday minday and maxtemp and mintemp for scale extent
      return function(data) {
        var city, cityEnter;
        maxDays = d3.max(data, function(m) {
          return d3.max(m.temps, function(d) {
            return d.day;
          });
        });
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
            return d.temps;
          }).enter().append('circle').attr('class', 'dot');
        city.select('.dots').style('stroke', function(d) {
          return color(d.name);
        }).selectAll('circle').transition().duration(500).attr('cy', function(d) {
          return y(d.temp);
        }).attr('cx', function(d) {
          return x(d.day);
        }).attr('r', 3);
        cityEnter.append("text").attr('class', 'city-name');
        city.select("text.city-name").attr("x", width + 20).attr("y", function(d, i) {
          return i * 20;
        }).attr("dy", ".35em").text(function(d) {
          return d.name;
        });
        cityEnter.append('circle').attr('class', 'city-dot');
        city.select('circle.city-dot').attr('cx', width + 10).attr('cy', function(d, i) {
          return i * 20;
        }).attr('r', 3).style('fill', function(d) {
          return color(d.name);
        });
        city.exit().remove();
        return zoom.x(x);
      };
    },

    formateDataForDrawLine : function(city) {
      var data, j;
      var airData = this.data.getAllDayForCity(city);
      var results = this.formateDataforDays(airData);
      data = {
        id: this.id,
        name: city,
        temps: results
      };
      this.id = this.id + 1;
      return data;
    },

    formateDataforDays : function(airData){
      var results;
      results = [];
      for (j = 0; j < airData.length; j++) {

        if(_.isNaN(+airData[j]))
          continue;
        results.push({
          day: j+1,
          temp: Math.round(airData[j])
        });
      }
      return results;
    },

    showSpecificDate : function (d) {
      var date = this.data.getMicroseconds(d-1);
      var time = new Date(date);
      daydate = new Intl.DateTimeFormat('en-US').format(time);
      return daydate;
    },

    drawLineByCity : function (cityName){
      var self = this;
      var data = self.formateDataForDrawLine(cityName);
      cityCheck = document.getElementById(cityName);
      cityCheck.addEventListener('change', function(){
        if(cityCheck.checked){
          self.listenAddCity(cityName);
        }else {
          self.listenRemoveCity(cityName);
        }
      });
    },
    
    change : function (cityName) {
      for(var i = 0; i<this.linchartData.length;i++){
        if(this.linchartData[i].name==cityName){
          this.linchartData.splice(i,1);
          return this.chart('#linechart')(this.linchartData);
        }
      }
      var data = this.formateDataForDrawLine(cityName);
      this.linchartData.push(data);
      return this.chart('#linechart')(this.linchartData);
    },

    listenAddCity : function(cityName){
      var data = this.formateDataForDrawLine(cityName);
      this.linchartData.push(data);
      return this.chart('#linechart')(this.linchartData);
    },

    listenRemoveCity : function(cityName){
      for(var i = 0; i<this.linchartData.length;i++){
        if(this.linchartData[i].name==cityName){
          this.linchartData.splice(i,1);
          return this.chart('#linechart')(this.linchartData);
        }
      }
    },


    render : function () {
      var data = this.formateDataForDrawLine("Beijing");
      this.linchartData.push(data);
      console.info(this.linchartData);
      //this.linchartData.push(aa);
      this.chart('#linechart')(this.linchartData);
      // this.drawLineByCity("Beijing");
    }
  })
  return LineChart;
});