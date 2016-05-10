define([
  'backbone',
  'jquery',
  'view/common/panel',
  'chroniton-bundle',
  'jquery-ui',
  'd3'
], function (Backbone, $, Panel, chroniton, ui,  d3) {
  var Contorl = Panel.extend({
    className : 'ag-panel control',

    getTitle : function () {
      return this.title;
    },

    initialize : function (opts) {
      var self = this;
      this.margin = {top: 10, left: 10, bottom: 10, right: 10};
      this.title = opts.title;
      this.data = opts.data || {};
      this.root = opts.rootView;
      this.$el.width(opts.w);
      this.$el.height(opts.h);
      Panel.prototype.initialize.call(this);
      this.$el.appendTo(this.root.$el);

      this.dateFormat = d3.time.format("%Y%m%d%H");
      this.filterValue = 0;
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

      var c = chroniton()
        .domain([this.data.date_array[0], this.data.date_array[this.data.date_array.length - 1]])
        .width(900)
        .loop(false)
        .playButton(true)
        .on('change', function(d) {
          // var cur = self.dateFormat(d3.time.hour(d));
          var cur = d3.time.hour(d);
          if(cur !== self.filterValue){
            self.filterValue = cur;
            self.root.chineseMap.change(cur);
            self.root.lineChart.change(cur);
          }
        })
        ;

      var datepicker = this.$el.find(".panel-body");

      datepicker
        .append('<p>From: <input type="text" id="from"> To: <input type="text" id="to"></p>');

      $( "#from" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3,
        defaultDate : self.data.date_array[0],
        minDate : self.data.date_array[0],
        maxDate : self.data.date_array[self.data.date_array.length - 1],
        onClose: function( selectedDate ) {
          $( "#to" ).datepicker( "option", "minDate", selectedDate );
        },
        onSelect: function (selectedDate, e) {
          bar.remove();
          var domain = c.domain();
          domain[0] = new Date(selectedDate);
          c.domain(domain);
          bar = d3.select(self.el).select("div.panel-body")
            .append('div')
            .attr('class', 'theme-example')
            .call(c);
        }
      });
      $( "#from" ).datepicker( "setDate", self.data.date_array[0] );

      $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3,
        defaultDate : self.data.date_array[self.data.date_array.length - 1],
        minDate : self.data.date_array[0],
        maxDate : self.data.date_array[self.data.date_array.length - 1],
        onClose: function( selectedDate ) {
          $( "#from" ).datepicker( "option", "maxDate", selectedDate );
        },
        onSelect: function (selectedDate, e) {
          bar.remove();
          var domain = c.domain();
          domain[1] = new Date(selectedDate);
          c.domain(domain);
          bar = d3.select(self.el).select("div.panel-body")
            .append('div')
            .attr('class', 'theme-example')
            .call(c);
        }
      });

      $( "#to" ).datepicker( "setDate", self.data.date_array[self.data.date_array.length - 1] );


      var bar = d3.select(this.el).select("div.panel-body")
          .append('div')
          .attr('class', 'theme-example')
          .call(c);
    },

    change : function () {

    },

    resize : function (self) {
    },
    fromChange : function (self, selectedDate) {

    }

  });
  return Contorl;
});