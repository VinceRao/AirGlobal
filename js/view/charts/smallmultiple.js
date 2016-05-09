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
        this.$grid.css('overflow', 'scroll');
        this.$grid.width('1000px');
      },
      render : function () {
        var self = this;
        var m = 10,
          r = 50;

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

        var locks = div.append('span').attr("class", "glyphicons glyphicons-unlock")
        var texts = svg.append("text")
          .attr("dy", "-3px")
          .attr("dx", "0px")
          .attr("class", "cityname")
          .attr("text-anchor", "middle")
          .attr("font-size", "12")
          .text(function(d) { return d; });

        var rects = svg.append('rect')
          .attr("x", "-40px")
          .attr("y", "-2px")
          .attr("width", "80")
          .attr("height", "18")
          // .attr("fill-opacity", "0.4")
        ;

        var texts2 = svg.append("text")
          .attr("dx", "0px")
          .attr("dy", "11px")
          .attr("class", "value")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .attr("font-weight", "900")
          .text(function(d, i) {
            return (+d3.max(self.data.getAllDayForCity(d))).toFixed(2);
          });

        rects.attr("fill", function () {
            var value = $(this.parentElement).find('.value').text()
            return self.data.getColor(+value);
          })

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
              return self.data.getAllDayForCity(d)[i].toFixed(2);
            });
            rects.attr("fill", function () {
              var value = $(this.parentElement).find('.value').text()
              return self.data.getColor(+value);
            })
            texts3.text(function(d){
              return new Intl.DateTimeFormat('en-US').format(new Date(self.data.getMicroseconds(i)));
            });
          })

          .on('mouseout', function (d, i) {
            paths.forEach(function (path) {
              var a = d3.select(path[i]);
              a.attr('stroke', null);
              a.attr('stroke-width', null);
            });
            texts2.text(function(d) {
              return(+d3.max(self.data.getAllDayForCity(d))).toFixed(2)
            });
            rects.attr("fill", function () {
              var value = $(this.parentElement).find('.value').text()
              return self.data.getColor(+value);
            })
            texts3.text(function(d){
              return new Intl.DateTimeFormat('en-US').format(new Date(self.data.getMicroseconds(0)));
              // return new Date(self.data.getMicroseconds(i));
            });
          })
        $('.grid').isotope({
          itemSelector: '.chart',
          layoutMode: 'fitRows',
          getSortData: {
            name: '.cityname',
            value: function (e) {
              return +$(e).find('.value').text();
            }
          }
        });
      },
      events : {
        'click .filter-attr' : 'setFilterAttr',
        'click .filter-opt' : 'setFilterOpt',
        'click .filter-opt' : 'setFilterOpt',
        'click #search' : 'search',
        'click #reset' : 'reset',

      },
      showEvent : function (e) {
        console.info(e);
      },
      setFilterAttr : function(e) {
        this.$filter.find('#attr-name').text(e.currentTarget.text);
      },
      setFilterOpt : function(e) {
        this.$filter.find('#opt-name').text(e.currentTarget.text);
      },
      search : function(e) {
        var attr = this.$filter.find('#attr-name').text(),
            opt = this.$filter.find('#opt-name').text(),
            value = this.$filter.find('input').val();
        this.filter(attr, opt, value);
      },
      filter : function (attr, opt, value) {
        var self = this;
        if(_.isNaN(+value)){
          value = d3.max(this.data.getAllDayForCity(value));
        }
        $('.grid').isotope({
          filter: function (e) {
            var target = e;
            if (e === 0){
              target = this;
            }
            var number = $(target).find('.value').text(),
                result;
            if(opt === 'Larger Than'){
              result = parseFloat( number, 10 ) >= +value;
            } else if (opt === 'Less Than'){
              result = parseFloat( number, 10 ) <= +value;
            } else {
              result = parseFloat( number, 10 ) == +value;
            }
            return result;
          }
        });
      },
      reset : function () {
        this.$grid.isotope({
          filter: ''
        });
      }
    });
    return SmallMultiple;
});