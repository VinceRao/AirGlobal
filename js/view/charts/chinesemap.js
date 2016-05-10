define([
  'backbone',
  'jquery',
  'view/common/panel',
  'd3',
  // 'd3-legend'
], function (Backbone, $, Panel, d3) {
  var ChineseMap = Backbone.View.extend({

    getTitle : function () {
      return this.title;
    },

    initialize : function (opts) {
      var self = this;
      this.margin = {top: 10, left: 10, bottom: 10, right: 10};
      this.municipalities = ['bei_jing', 'shang_hai', 'tian_jin', 'chong_qing'];
      this.title = opts.title;
      this.data = opts.data
      this.root = opts;
      this.$el= $('#chinamap');
      this.color = d3.scale.linear()
        .domain([0,300])
        .range(["rgb(0, 255, 0)", "rgb(255, 0, 0)"]);
    },

    draw : function () {
      var width = +this.$el.width()
        , width = width - this.margin.left - this.margin.right
        , height = +this.$el.height()
        , height = height - this.margin.top - this.margin.bottom
        // , height = width * 0.5
        , self = this
        , $def = $.Deferred()
        ;


      this.proj = d3.geo.mercator()
        .center([105, 38])
        .scale(height)
        .translate([width / 2, height / 2]);

      this.path = d3.geo.path()
        .projection(this.proj);
      var temp = d3.select('#chinamap').selectAll("svg");
      if(temp.length > 0){
        temp.remove();
      }
      this.map = d3.select('#chinamap').append("svg")
        .attr("width", width)
        .attr("height", height);

      this.tooltip = d3.select('#chinamap').append("div")
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
          .attr('fill', 'white')
          .attr("d", self.path)
          .attr("id", function(d) {return d.id;})
          .attr("name", function(d) {return d.properties.name;})
          .on("mouseover", function(d) {
            var m = d3.mouse(d3.select('#chinamap').node());
            self.tooltip.style("display", null)
              .style("left", m[0] + 10 + "px")
              .style("top", m[1] - 10 + "px");
            $("#tt_county").text(function () {
              var name = self.getCityEnglishName(d.id);
              if(!name){
                name = d.properties.name;
              }
              return name;
            });
          })
          .on('click', function (d) {
            var eng_name = self.getCityEnglishName(d.id);
            self.root.linechart.change(eng_name);
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
          self.municipalities.forEach(function (d) {
            d3.select('#' + d)
              .on("mouseover", function(d) {
                var m = d3.mouse(d3.select('#chinamap').node());
                self.tooltip.style("display", null)
                  .style("left", m[0] + 10 + "px")
                  .style("top", m[1] - 10 + "px");
                $("#tt_county").text(function () {
                  var name = self.getCityEnglishName(d.id);
                  if(!name){
                    name = d.properties.name;
                  }
                  return name;
                });
              })
              .on('click', function (d) {
                var eng_name = self.getCityEnglishName(d.id);
                self.root.linechart.change(eng_name);
              })
              .on("mouseout", function() {
                self.tooltip.style("display", "none");
              });
          });
          $def.resolve();
        });
      });
      return $def;
    },

    change : function (timestamp) {
      var path = $('#smallmultiple').find('.cityname:visible').toArray(),
          dayIndex = +this.data.getDayIndex(timestamp),
          self = this
          ;
      path.forEach(function (d) {
        var city_id = self.data.getMapID(d.textContent),
            val = +self.data.getAllDayForCity(d.textContent)[dayIndex];
        self.map.select("path[id='{0}']".format(city_id))
          .attr("fill", function() {return self.data.getColor(val)})
        ;
      })

    },

    reset : function (array) {
      var path = $('#smallmultiple').find('.cityname:visible').toArray(),
          self = this
          ;
      path.forEach(function (d) {
        var city_id = self.data.getMapID(d.textContent),
            city_index = self.data.getCityIndex(d.textContent),
            val = +array[city_index]
            ;
        self.map.select("path[id='{0}']".format(city_id))
          .attr("fill", function() {return self.data.getColor(val)})
        ;
      })
    },

    setCityColor : function (city_name, x) {
      var city_id = this.data.getMapID(city_name)
      var color = x ? this.data.getColor(x) : 'white';
      this.map.select("path[id='{0}']".format(city_id))
        .attr("fill", function() {return color})
      ;
    },
    
    getIndex : function (time) {
      var idx = this.data.date_array_number.indexOf(+time);
      if (idx === -1){
        console.info('bingo')
      }
      return idx;
      // return this.data.date_array.indexOf(new Date(time));
    },
    
    getCityEnglishName : function (id) {
      return this.data.getCityNameByID(id);
    }

  });
  return ChineseMap;
});