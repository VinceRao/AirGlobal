define([
  'backbone',
  'jquery',
  'text!template/panel.html'
], function (Backbone, $, tmpl) {
  var Panel = Backbone.View.extend({
    tempalte : _.template(tmpl),
    
    initialize : function () {
      var self = this;
      this.$el.html(this.tempalte(tmpl));
      this.$header = this.$('.panel-heading h3').html(this.getTitle()).parent();
      this.$container = this.$('div.panel-body');
    },
    
    getHeader : function () {
      return this.$header;
    },
    
    getContainer : function () {
      return this.$container;
    }
    
  });
  return Panel;
});