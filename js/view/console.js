'use stick';

define([
  'jquery',
  'backbone',
  'util',
  'd3',
  'view/uschina',
  'model/berkeley',
  'model/embassy',
], function (
  $,
  Backbone,
  util,
  d3,
  USChina,
  Berkeley,
  Embassy
) {
    var Console = function () {
    };

    Console.prototype = {
        init : function () {
            var root, uschinaContainer, options = {},

                root = new Backbone.View({el: $('#ag-root')});
            options.rootView = root;
            options.data = {};

            options.data.berkeley = new Berkeley();
            var defer_berkeley = options.data.berkeley.load();
            options.data.embassy = new Embassy();
            var defer_embassy = options.data.embassy.load();

      $.when(defer_berkeley, defer_embassy).done(function () {
          options.data.embassy.city_map = options.data.berkeley.city_map;
          uschinaContainer = new USChina({root : options.rootView, data : options.data})
          uschinaContainer.render();
      });
    }
  };
  return Console;
});