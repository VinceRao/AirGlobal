define([
  'd3',
  'backbone',
  'text!template/filter.html'
  ]
  , function (d3, Backbone, tmpl) {
    var SmallMultiple =  Backbone.View.extend({
      initialize : function (opts) {
        this.data = opts.data;
        this.root =  opts;
        // this.$el.appendTo(opts.rootView.$el);
        this.$el= $('#smallmultiple');
        this.curAttr;
        this.max_array = [];
        this.min_array = [];
        this.med_array = [];
        this.curAttrAry = this.med_array;
        this.curAttrClass = '.med'
      },
      render : function () {
        var self = this;
        var m = 10,
          r = 50;

        // this.$filter.append(_.template(tmpl))
        var div = d3.select("#smallmultiple").selectAll("div");
        if(div.length > 0){
          div.remove();
        }
        div = d3.select("#smallmultiple").selectAll("div").data(self.data.getAllCities())
          .enter().append("div")
          .attr("class", 'chart');

        var svg = div.append("svg")
          .attr("width", (r + m) * 2)
          .attr("height", (r + m) * 2)
          .append("g")
          .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")")
        var cities = svg.append("text")
          .attr("dy", "-3px")
          .attr("dx", "0px")
          .attr("class", "cityname")
          .attr("text-anchor", "middle")
          .attr("font-size", "12")
          .on('click', function (d) {
            self.root.linechart.change(d);
          })
          .text(function(d) { return d; });

        this.rects = svg.append('rect')
          .attr("x", "-40px")
          .attr("y", "-2px")
          .attr("width", "80")
          .attr("height", "18")
        ;

        var cur = svg.append("text")
          .attr("dx", "0px")
          .attr("dy", "11px")
          .attr("class", "value")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .attr("font-weight", "900")
          .attr("display", "none")
          ;

        this.max = svg.append("text")
          .attr("dx", "0px")
          .attr("dy", "11px")
          .attr("class", "max")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .attr("font-weight", "900")
          .attr("display", "none")
          .text(function(d, i) {
            var max = +d3.max(self.getCityValueArray(d));
            self.max_array[i] = max;
            return max.toFixed(2);
          });

        this.min = svg.append("text")
          .attr("dx", "0px")
          .attr("dy", "11px")
          .attr("class", "min")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .attr("font-weight", "900")
          .attr("display", "none")
          .text(function(d, i) {
            var min = +d3.min(self.getCityValueArray(d));
            self.min_array[i] = min;
            return min.toFixed(2);
          });

        this.med = svg.append("text")
          .attr("dx", "0px")
          .attr("dy", "11px")
          .attr("class", "med")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .attr("font-weight", "900")
          .attr("display", null)
          .text(function(d, i) {
            var med = +Math.median(self.getCityValueArray(d));
            self.med_array[i] = med;
            return med.toFixed(2);
          });

        this.curAttr = this.med;
        this.curAttrAry = this.med_array;
        self.root.chineseMap.reset(self.curAttrAry);


        this.rects.attr("fill", function () {
            var value = $(this.parentElement).find('.max').text()
            return self.data.getColor(+value);
          })

        var times = svg.append("text")
          .attr("dx", "0px")
          .attr("dy", "26px")
          .attr("text-anchor", "middle")
          .attr("font-size", "10")
          // .text(function(d, i) { return new Intl.DateTimeFormat('en-US').format(new Date(self.data.getMicroseconds(0)));});

        var pie = d3.layout.pie();
        pie.sort(null);
        pie.value(function (d) {
          return 1;
        })
        pie.startAngle(0);

        var pie2 = function (d){
          var array = self.getCityData(d);
          return pie(array);
        };

        var paths = svg.selectAll("path")
          .data(pie2)
          .enter().append("path")
          .attr("d", d3.svg.arc()
            .innerRadius(r/1.4)
            .outerRadius(r))
          .attr('name' , function(d,i){return i})
          .style("fill", function(d) {
            return self.data.getColor(+d.data.value); })
          .on('mouseover', function(d, i){
            paths.forEach(function (path) {
              var a = d3.select(path[i]);
              a.attr('stroke', 'red');
              a.attr('stroke-width', 2);
            });
            cur.attr("display", null)
              .text(function(d){
              return self.getCityValueArray(d)[i].toFixed(2);
            });
            self.curAttr.attr("display", "none");
            self.rects.attr("fill", function () {
              var value = $(this.parentElement).find('.value').text()
              return self.data.getColor(+value);
            })
            times.text(function(){
              return new Intl.DateTimeFormat('en-US').format(new Date(d.data.date));
            });
            self.root.chineseMap.change(d.data.date);
          })

          .on('mouseout', function (d, i) {
            paths.forEach(function (path) {
              var a = d3.select(path[i]);
              a.attr('stroke', null);
              a.attr('stroke-width', null);
            });
            cur.attr("display", "none");

            self.curAttr.attr("display", null);

            self.rects.attr("fill", function (d, i) {
              // var value = $(this.parentElement).find('text:visible')[1].textContent;
              return self.data.getColor(self.curAttrAry[i]);
            })

            self.root.chineseMap.reset(self.curAttrAry);
            times.text(function(d){
              return "";
            });
          })
        $("#smallmultiple").isotope({
          itemSelector: '.chart',
          layoutMode: 'fitRows',
          getSortData: {
            name: '.cityname',
            max: function (e) {
              return +$(e).find('.max').text();
            },
            min: function (e) {
              return +$(e).find('.min').text();
            },
            med: function (e) {
              return +$(e).find('.med').text();
            },
          }
        });
        $("#smallmultiple").isotope('reloadItems');
        $('#smallmultiple').isotope({
          sortBy: 'name',
          sortAscending: true
        });
      },

      sorttByMin : function(){
        var self = this;
        this.curAttr.attr("display", "none");
        this.curAttr = this.min;
        this.curAttrAry = this.min_array;
        self.root.chineseMap.reset(self.curAttrAry);
        this.curAttr.attr("display", null);
        this.curAttrClass = '.min'
        this.rects.attr("fill", function () {
          var value = $(this.parentElement).find('.min').text()
          return self.data.getColor(+value);
        })
        $('#smallmultiple').isotope({
          sortBy: 'min',
          sortAscending: true
        });
      },

      sorttByName : function(){
        var self = this;
        this.curAttr.attr("display", "none");
        this.curAttr = this.med;
        this.curAttrAry = this.med_array;
        self.root.chineseMap.reset(self.curAttrAry);
        this.curAttr.attr("display", null);
        this.curAttrClass = '.med'
        this.rects.attr("fill", function () {
          var value = $(this.parentElement).find('.max').text()
          return self.data.getColor(+value);
        })
        $('#smallmultiple').isotope({
          sortBy: 'name',
          sortAscending: true
        });
      },

      sorttByMax : function(){
        var self = this;
        this.curAttr.attr("display", "none");
        this.curAttr = this.max;
        this.curAttrAry = this.max_array;
        self.root.chineseMap.reset(self.curAttrAry);
        this.curAttr.attr("display", null);
        this.curAttrClass = '.max'
        this.rects.attr("fill", function () {
          var value = $(this.parentElement).find('.max').text()
          return self.data.getColor(+value);
        })
        $('#smallmultiple').isotope({
          sortBy: 'max',
          sortAscending: false
        });
      },

      sorttByMed : function(){
        var self = this;
        this.curAttr.attr("display", "none");
        this.curAttr = this.med;
        this.curAttrAry = this.med_array;
        self.root.chineseMap.reset(self.curAttrAry);
        this.curAttr.attr("display", null);
        this.curAttrClass = '.med'
        this.rects.attr("fill", function () {
          var value = $(this.parentElement).find('.med').text()
          return self.data.getColor(+value);
        })
        $('#smallmultiple').isotope({
          sortBy: 'med',
          sortAscending: false
        });
      },

      f : function (range_id) {
        var self = this;
        $('#smallmultiple').isotope({
          filter: function (e) {
            var target = e;
            if (e === 0){
              target = this;
            }
            var x = +$(target).find(self.curAttrClass).text(),
                city_name = $(target).find('.cityname').text(),
                result;
            switch (+range_id){
              case 0:
                result = true;
                break;
              case 1:
                result = x >= 0 && x <= 50;
                break;
              case 2:
                result = x >= 51 && x <= 100;
                break;
              case 3:
                result = x >= 101 && x <= 150;
                break;
              case 4:
                result = x >= 151 && x <= 200;
                break;
              case 5:
                result = x >= 201 && x <= 300;
                break;
              case 6:
                result = x >= 301 && x <= 500;
                break;
              case 7:
                result = x >500;
                break;
              default:
                result = false;
            }
            if(result){
              self.root.chineseMap.setCityColor(city_name, x);
            }
            else {
              self.root.chineseMap.setCityColor(city_name);
            }
            return result;
          }
        });
      },

      getCityData : function (cityname) {
        var from = this.data.getMilliseconds($('#from').val());
        var to = this.data.getMilliseconds($('#to').val());
        return this.data.getOneCityInTimeRange(cityname, from, to);
      },

      getCityValueArray : function (cityname) {
        var from_idx = this.data.getDayIndex(this.data.getMilliseconds($('#from').val()));
        var to_idx = this.data.getDayIndex(this.data.getMilliseconds($('#to').val()));
        return this.data.getAllDayForCity(cityname).slice(from_idx, to_idx + 1);
      },

      search : function () {
        var self = this;
        var search_context = $('#search').val();
        var cities = search_context.split(',');
        $('#smallmultiple').isotope({
          filter: function (e) {
            var target = e;
            if (e === 0){
              target = this;
            }
            var citynanme = $(target).find('text.cityname').text();
            var x = +$(target).find(self.curAttrClass).text();
            var result;
            result = cities.indexOf(citynanme) > -1 ? true : false;
            if (cities.length < 1){
              result =  true;
            } else if (cities.length === 1 && cities[0].trim() === ""){
              result  = true;
            }
            if(result){
              self.root.chineseMap.setCityColor(citynanme, x);
            }
            else {
              self.root.chineseMap.setCityColor(citynanme);
            }
            return result;
          }
        });
      }
    });
    return SmallMultiple;
});