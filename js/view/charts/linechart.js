define([
  'backbone',
  'jquery',
  'd3',
  'view/common/panel',
  'd3-legend'

], function (Backbone, $, d3, Panel) {
  var LineChart = Panel.extend({
    className : 'ag-panel linechart',

    getTitle : function () {
      return this.title;
    },

    initialize : function (opts) {
      var self = this;
      this.margin = {top: 20, right: 80, bottom: 30, left: 50};
      this.title = opts.title;
      this.data = opts.data || {};
      this.root = opts.rootView;
      this.$el.width(opts.w);
      this.$el.height(opts.h);
      Panel.prototype.initialize.call(this);
      this.$el.appendTo(this.root.$el);
      d3.select(window).on('resize', function () {
        self.resize(self);
      });

      //chart elems
      this.x = d3.time.scale().domain([opts.data.date_array[0], opts.data.date_array[opts.data.date_array.length - 1]]);
      // this.x = d3.time.scale().domain([opts.data.date_array[0], opts.data.date_array[500]]);
      this.y = d3.scale.linear().domain([0, 500]);

      this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
      this.yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(5);
      this.color = d3.scale.ordinal()
        .domain(this.citystrs)
        .range([ "green", "red", "blue", "orange", "purple"]);
    },

    draw : function () {
      var width = +this.$container.width()
        , width = width - this.margin.left - this.margin.right
        , height = +this.$el.height() - +this.$header.outerHeight(true) - 15
        , height = height - this.margin.top - this.margin.bottom
        , self = this
        ;
      this.x.range([0, width]);
      this.y.range([height, 0]);

      this.svg = d3.select(this.el).select("div.panel-body").append("svg")
        .attr("width", width + this.margin.left + this.margin.right)
        .attr("height", height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
        ;
      this.svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(" + width +",20)");

      var legendOrdinal = d3.legend.color()
        .shape("path", d3.svg.symbol().type("triangle-up").size(150)())
        .shapePadding(10)
        .scale(self.color);

      this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(this.xAxis);

      this.svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value")

      this.svg.select(".legendOrdinal")
        .call(legendOrdinal);

      this.city  = this.svg.selectAll(".city");
    },

    citystrs : ['Guangzhou', 'Shanghai', 'Beijing', 'Chengdu', 'Shenyang'],
    change : function (timestammp) {
      var self = this
        ;
      var cities = this.getLineChartData(this.getIndex(timestammp));
      // console.log(timestammp)
      var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return self.x(d.time); })
        .y(function(d) { return self.y(d.value); });

      this.color.domain(this.citystrs);
      this.city.remove();
      this.city = this.svg.selectAll(".city").data(cities)

      this.city.enter().append("g")
        .attr("class", "city");

      this.city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .attr("opacity", 0.5)
        .style("stroke", function(d) { return self.color(d.name); });

      this.city.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform",
          function(d) {
            return "translate(" + self.x(d.value.time) + "," + self.y(d.value.value) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .attr("fill", function(d) { return self.color(d.name); } )
        .text(function(d) { return d.name; });
    },

    resize : function (self) {
    },

    getLineChartData : function (index) {
      var data = [];
      var self = this;;
      var last = index === 0 ? 1 : index;
      this.citystrs.forEach(function (name, index) {
        temp =  {name : name};
        temp.values = self.data.city_data[index].value.slice(0, last);
        data.push(temp)
      });
      return data;
    },

    getIndex : function (time) {
      var idx = this.data.date_array_number.indexOf(+time);
      return idx;
      // return this.data.date_array.indexOf(new Date(time));
    }

  });
  return LineChart;
});