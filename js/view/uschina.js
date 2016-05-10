'use stick';

define([
  'backbone',
  'jquery',
  'view/charts/chinesemap',
  'view/charts/linechart',
  'view/charts/smallmultiple',
  'view/control',
  'text!template/chinaair.html',
  'jquery-ui'
], function (Backbone, $, ChineseMap, LineChart, Smallmultiple, Control, tmpl) {
  var USChina = Backbone.View.extend({

    // className: '',
    template : _.template(tmpl),
    initialize : function (options) {;
      this.options = options
      this.data = options.data.berkeley;
      this.root = options.root;
      this.$el.html(this.template());
      this.$el.height('100%')

    },

    render : function () {
      var self = this;
      this.$el.appendTo(this.root.el);
      this.smallmultiple = new Smallmultiple(this);
      this.linechart = new LineChart(this);

      $( "#from" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 3,
        defaultDate : self.data.getDateString(self.data.start),
        minDate : self.data.getDateString(self.data.start),
        maxDate : self.data.getDateString(self.data.end),
        onClose: function( selectedDate ) {
          $( "#to" ).datepicker( "option", "minDate", selectedDate );
        },
        onSelect: function (selectedDate, e) {
          self.smallmultiple.render();
        }
      });
      $( "#from" ).datepicker( "setDate", self.data.getDateString(self.data.start) );

      $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 3,
        defaultDate : self.data.getDateString(self.data.start),
        minDate : self.data.getDateString(self.data.start),
        maxDate : self.data.getDateString(self.data.end),
        onClose: function( selectedDate ) {
          $( "#from" ).datepicker( "option", "maxDate", selectedDate );
        },
        onSelect: function (selectedDate, e) {
          self.smallmultiple.render();
        }
      });
      $( "#to" ).datepicker( "setDate", self.data.getDateString(self.data.end) );


      this.chineseMap = new ChineseMap(this);
      $.when(this.chineseMap.draw()).done(function () {
        self.smallmultiple.render();
        self.linechart.render();
      });
    },

    destory : function(){
      $( "#to" ).datepicker("destroy");
      $( "#from" ).datepicker("destroy");
    },

    changeDataSource : function () {
      this.data = this.options.data[$('#datasource').val()];
      this.destory();
      this.render();
    },

    sort : function () {
      var sortBy = $('#sort').val();
      switch (sortBy){
        case "max":
          this.smallmultiple.sorttByMax();
          break;
        case "min":
          this.smallmultiple.sorttByMin();
          break;
        case "name":
          this.smallmultiple.sorttByName();
          break;
        case "med":
          this.smallmultiple.sorttByMed();
          break;
        default:
          return;
      }
    },
    
    filterByRange : function () {
      var filter_id = $('#filter').val();
      this.smallmultiple.f(filter_id);
    },
    
    search : function(){
      this.smallmultiple.search();
    },

    events : {
      'change #datasource' : 'changeDataSource',
      'change #sort' : 'sort',
      'change #filter' : 'filterByRange',
      'change #search' : 'search',
    }
  });
  return USChina
});