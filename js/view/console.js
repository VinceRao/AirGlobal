'use stick';

define([
  'jquery',
  'backbone',
  'util',
  'view/uschina'
], function (
  $,
  Backbone,
  util,
  USChina
) {
  var Console = function () {
  };

  Console.prototype = {
    init : function () {
      var root, uschinaContainer, options = {};

      root = new Backbone.View({el: $('#ag-root')});
      options.rootView = root;
      uschinaContainer = new USChina({root : options.rootView})
      uschinaContainer.render();
    }
  };
  return Console;
});