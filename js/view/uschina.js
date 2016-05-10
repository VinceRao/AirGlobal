'use stick';

define([
  'backbone',
  'jquery',
  'view/charts/chinesemap',
  'view/charts/linechart',
  'view/charts/smallmultiple',
  'view/control',
  'text!template/chinaair.html'
], function (Backbone, $, ChineseMap, LineChart, Smallmultiple, Control, tmpl) {
  var USChina = Backbone.View.extend({

    // className: '',
    template : _.template(tmpl),
    initialize : function (options) {;
      this.options = options
      this.data = options.data.embassy;
      this.root = options.root;
      this.$el.html(this.template());
      this.$el.height('100%')
    },

    render : function () {
      var self = this;
      this.$el.appendTo(this.root.el);
      this.smallmultiple = new Smallmultiple(this);
      this.linechart = new LineChart(this);

      this.chineseMap = new ChineseMap(this);
      $.when(this.chineseMap.draw()).done(function () {
        // self.smallmultiple.render();
        self.linechart.render();
      });
    },

    changeDataSource : function () {
      this.data = this.options.data[$('#datasource').val()]
      this.render()
    },

    events : {
      'change #datasource' : 'changeDataSource'
    }
  });
  return USChina
});