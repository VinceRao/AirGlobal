'use stick';

define([
  'backbone',
  'jquery',
  'view/charts/chinesemap',
  'view/charts/linechart',
  'view/control',
  'd3-legend'
], function (Backbone, $, ChineseMap, LineChart, Control) {
  var USChina = Backbone.View.extend({

    className: 'uschina-container',

    initialize : function (options) {

      this.root = options.root;
      this.$el.height('100%')
      this.chineseMap = new ChineseMap({
        w : '800px',
        h : '600px',
        title : 'Chinese Map With PM2.5',
        rootView : this,
        data : options.data
      });
      this.lineChart = new LineChart({
        w : '1000px',
        h : '600px',
        title : 'Five Major Cities Line Chart',
        rootView : this,
        data : options.data
      });
      this.lineChart2 = new LineChart({
        w : '800px',
        h : '300px',
        title : 'Cusstom Line Chart',
        rootView : this,
        data : options.data
      });
      this.control = new Control({
        w : '1000px',
        h : '300px',
        title : 'Control',
        rootView : this,
        data : options.data
      });
    },

    render : function () {
      var self = this;
      this.$el.appendTo(this.root.el);
      a = this.chineseMap.draw();
      this.lineChart.draw();
      // this.lineChart2.draw()
      $.when(a).done(function () {
        self.control.draw();
      });
    }
  });
  return USChina
});