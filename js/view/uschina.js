'use stick';

define([
  'backbone',
  'jquery',
  'view/charts/chinesemap'
], function (Backbone, $, ChineseMap) {
  var USChina = Backbone.View.extend({

    className: 'uschina-container',

    initialize : function (options) {

      this.root = options.root;
      this.$el.height('100%')
      this.chineseMap = new ChineseMap({
        w : '800px',
        h : '600px',
        title : 'Chinese Map',
        rootView : this
      });
    },

    render : function () {
      var self = this;
      this.$el.appendTo(this.root.el);
      a = this.chineseMap.draw();
      $.when(a).done(function () {
        self.chineseMap.fill();
      });
    }
  });
  return USChina
});