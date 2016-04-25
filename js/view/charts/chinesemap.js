define([
  'backbone',
  'jquery',
  'd3',
  'view/common/panel'
], function (Backbone, $, d3, Panel) {
  var ChineseMap = Panel.extend({
    className : 'ag-panel',

    getTitle : function () {
      return this.title;
    },

    initialize : function (opts) {
      var self = this;
      this.margin = {top: 10, left: 10, bottom: 10, right: 10}
      this.title = opts.title;
      this.$el.width(opts.w);
      this.$el.height(opts.h);
      Panel.prototype.initialize.call(this);
      d3.select(window).on('resize', function () {
        self.resize(self);
      });
    },

    draw : function () {
      var margin = {top: 10, left: 10, bottom: 10, right: 10}
        , width = parseInt(this.$container.width())
        , width = width - margin.left - margin.right
        , height = parseInt(this.$el.height() - this.$header.outerHeight(true))
        , height = height - margin.top - margin.bottom
        // , height = width * 0.5
        , self = this
        ;
      this.proj = d3.geo.mercator()
        .center([105, 38])
        .scale(height)
        .translate([width / 2, height / 2]);

      this.path = d3.geo.path()
        .projection(this.proj);

      this.map = d3.select("div.panel-body").append("svg")
        .attr("width", width)
        .attr("height", height);
      this.tooltip = d3.select("div.panel-body").append("div")
        .attr("id", "tooltip")
        .style("display", "none")
        .style("position", "absolute")
        .html("<label><span id=\"tt_county\"></span></label>");

      d3.json("Data/ChineseMap/china_cities.json", function (error, cities) {
        self.map.append("g")
          .attr("class", "counties")
          .selectAll("path")
          .data(cities.features)
          .enter()
          .append("path")
          // .attr("class", function(d) { return "q" + rateById.get(d.id); })
          .attr("d", self.path)
          .attr("fill", 'red')
          .attr("id", function(d) {return d.id;})
          .attr("name", function(d) {return d.properties.name;})
          .on("mouseover", function(d) {
            var m = d3.mouse(d3.select("body").node());
            self.tooltip.style("display", null)
              .style("left", m[0] + 10 + "px")
              .style("top", m[1] - 10 + "px");
            $("#tt_county").text(d.properties.name);
          })
          .on("mouseout", function() {
            self.tooltip.style("display", "none");
          });
          d3.json("Data/ChineseMap/china_provinces.json", function (error, provinces) {
            self.map.append("g")
              .attr("class", "states")
              .selectAll("path")
              .data(provinces.features)
              .enter()
              .append("path")
              .attr("d", self.path)
              .attr("id", function(d) {return d.id;})
          });
      })

    },

    resize : function (self) {
      var width = parseInt(self.$container.width())
        , width = width - self.margin.left - self.margin.right
        , height = parseInt(self.$el.height() - self.$header.height())
        , height = height - self.margin.top - self.margin.bottom
        // , height = width * 0.5
        ;
      self.proj
        .translate([width / 2, height / 2])
        .scale(height);
      self.map
        .attr("width", width)
        .attr("height", height);
      self.map.selectAll('path').attr('d', self.path);
    }

  });
  return ChineseMap;
});