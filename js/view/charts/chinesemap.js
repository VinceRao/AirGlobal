define([
  'backbone',
  'jquery',
  'view/common/panel',
  'd3'
], function (Backbone, $, Panel, d3) {
  var ChineseMap = Panel.extend({
    className : 'ag-panel',

    getTitle : function () {
      return this.title;
    },

    initialize : function (opts) {
      var self = this;
      this.margin = {top: 10, left: 10, bottom: 10, right: 10};
      this.municipalities = ['bei_jing', 'shang_hai', 'tian_jin', 'chong_qing'];
      this.title = opts.title;
      this.data = opts.data || {};
      this.root = opts.rootView;
      this.$el.width(opts.w);
      this.$el.height(opts.h);
      Panel.prototype.initialize.call(this);
      this.$el.appendTo(this.root.$el);
      this.color = d3.scale.linear()
        .domain([0,500])
        .range(["rgb(0, 255, 0)", "rgb(255, 0, 0)"]);
      d3.select(window).on('resize', function () {
        self.resize(self);
      });
    },

    draw : function () {
      var width = +this.$container.width()
        , width = width - this.margin.left - this.margin.right
        , height = +this.$el.height() - +this.$header.outerHeight(true)
        , height = height - this.margin.top - this.margin.bottom
        // , height = width * 0.5
        , self = this
        , $def = $.Deferred()
        ;

      this.legendLinear = d3.legend.color()
        .shapeWidth(30)
        .cells(6)
        .orient('horizontal')
        .scale(this.color);

      this.proj = d3.geo.mercator()
        .center([105, 38])
        .scale(height)
        .translate([width / 2, height / 2]);

      this.path = d3.geo.path()
        .projection(this.proj);

      this.map = d3.select("div.panel-body").append("svg")
        .attr("width", width)
        .attr("height", height);

      this.map.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");

      this.map.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");

      this.map.select(".legendLinear")
        .call(this.legendLinear);

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
          // .attr('fill', 'blue')
          // .attr("class", function(d) { return "q" + rateById.get(d.id); })
          .attr("d", self.path)
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
          $def.resolve();
        });
      });
      return $def;
    },

    index : 0,

    change : function (timestamp) {
      // console.log(this.getIndex(timestamp));
      var value = this.data.data_array[this.getIndex(timestamp)]
        , self = this
        ;
      value.forEach(function (d) {
        var v_pm = d.v;
        self.map.select("path[id='{0}']".format(d.id))
          .attr("fill", function() {return self.color(v_pm)})
        ;
      })
      this.index++;

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
    },

    getIndex : function (time) {
      var idx = this.data.date_array_number.indexOf(+time);
      if (idx === -1){
        console.info('bingo')
      }
      return idx;
      // return this.data.date_array.indexOf(new Date(time));
    },

  });
  return ChineseMap;
});