define([
  'd3',
  'backbone',
  'text!template/filter.html'
]
  , function (d3, Backbone, tmpl) {
    var SmallMultiple =  Backbone.View.extend({
      initialize : function (opts) {
        this.data = opts.data.berkeley;
        this.$el.appendTo(opts.rootView.$el);
        this.$el.append("<div id='filter'></div>");
        this.$el.append("<div class='grid'></div>");
        this.$filter = $("#filter");
        this.$grid = $(".grid");
      },
      render : function () {
        var self = this;
        var m = 10,
          r = 50,
          z = d3.scale.category20c();

        this.$filter.append(_.template(tmpl))
        var div = d3.select(".grid").selectAll("div")
          .data(self.data.getAllCities())
          .enter().append("div")
          .attr("class", 'chart');

        var svg = div.append("svg")
          .attr("width", (r + m) * 2)
          .attr("height", (r + m) * 2)
          .append("g")
          .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")")
        var texts = svg.append("text")
          .attr("dy", "-3px")
          .attr("dx", "0px")
          .attr("class", "cityname")
          .attr("text-anchor", "middle")
          .attr("font-size", "12")
          .text(function(d) { return d; });

        var texts2 = svg.append("text")
          .attr("dx", "0px")
          .attr("dy", "11px")
          .attr("class", "value")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .text(function(d, i) {
            return d3.max(self.data.getAllDayForCity(d));
          });

        var texts3 = svg.append("text")
          .attr("dx", "0px")
          .attr("dy", "26px")
          .attr("text-anchor", "middle")
          .attr("font-size", "10")
          .text(function(d, i) { return new Intl.DateTimeFormat('en-US').format(new Date(self.data.getMicroseconds(0)));});

        var pie = d3.layout.pie();
        pie.sort(null);
        pie.value(function () {
          return 1;
        })
        pie.startAngle(0);

        var pie2 = function (d){
          return pie(self.data.getAllDayForCity(d));
        };

        var paths = svg.selectAll("path")
          .data(pie2)
          .enter().append("path")
          .attr("d", d3.svg.arc()
            .innerRadius(r/1.4)
            .outerRadius(r))
          .attr('name' , function(d,i){return i})
          .style("fill", function(d, i) {
            return self.data.getColor(+d.data); })
          .on('mouseover', function(d, i){
            paths.forEach(function (path) {
              var a = d3.select(path[i]);
              a.attr('stroke', 'red');
              a.attr('stroke-width', 2);
            });
            texts2.text(function(d){
              return self.data.getAllDayForCity(d)[i];
            });
            texts3.text(function(d){
              return new Intl.DateTimeFormat('en-US').format(new Date(self.data.getMicroseconds(i)));
              // return new Date(self.data.getMicroseconds(i));
            });
          })

          .on('mouseout', function (d, i) {
            paths.forEach(function (path) {
              var a = d3.select(path[i]);
              a.attr('stroke', null);
              a.attr('stroke-width', null);
            });
            texts2.text(function(d) {
              return d3.max(self.data.getAllDayForCity(d));
            });
            texts3.text(function(d){
              return new Intl.DateTimeFormat('en-US').format(new Date(self.data.getMicroseconds(0)));
              // return new Date(self.data.getMicroseconds(i));
            });
          })

        var setupIsoytpe = function() {
          self.$grid.isotope({
            itemSelector: '.chart',
            layoutMode: 'fitRows',
            getSortData: {
              name: '.cityname',
              value: function (e) {
                return +$(e).find('.value').text();
              }
            }
          });

          // $(".grid").isotope({sortBy: 'value'});
          setTimeout(function () {
            self.$grid.isotope({
              // filter element with numbers greater than 50
              filter: function(e) {
                // _this_ is the item element. Get text of element's .number
                var number = $(e).find('.value').text()
                // return true to show, false to hide
                console.info(number);
                return parseInt( number, 10 ) < 100;
              }
            })
          }, 5000)
        };
        setupIsoytpe();
      }
    });
    return SmallMultiple;
});