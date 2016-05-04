'use stick';

define([
  'jquery',
  'backbone',
  'util',
  'd3',
  'view/uschina',
  'model/berkeley',
  'model/embassy',
  'd3-legend',
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
        // an array of all cities
        var cities = options.data.berkeley.getAllCities();
        console.log(cities);

        //get all time data for a city
        var beijingdata = options.data.berkeley.getAllTimeForCity("Beijing");
        console.log(beijingdata);

        // get all time data for a set of cities
        var somecities = ["Anshan","Beijing","Zunyi"] //0, 6, 181 in cities
        var somecitiesAlltime = options.data.berkeley.getCitiesData(somecities);
        console.log(somecitiesAlltime);

        //get all cities data for a timepoint
        var t0 = options.data.berkeley.start; //in microseconds
        var t1 = 1; //in index
        var allcityT0 = options.data.berkeley.getAllCityAtTime(t0);
        var allcityT1 = options.data.berkeley.getAllCityAtTime(t1);
        console.log(allcityT0);
        console.log(allcityT1);

       //get all cities data for a time range, consecutive
        var start = options.data.berkeley.start; //in microseconds
        var end = start + options.data.berkeley.interval * 2;
        var allcityTimeRange = options.data.berkeley.getTimeRangeData(start, end);
        console.log(allcityTimeRange);
        //get certain timepoints for a set of cities, return a map with timepoints, indices, and city-array pairs
        //timepoints can be indices or microseconds
        var timepoints = [options.data.berkeley.start, 1, 2928];
        var selecteddata = options.data.berkeley.getCitiesTimepoints(somecities, timepoints);
        console.log(selecteddata);

        uschinaContainer = new USChina({root : options.rootView, data : options.data})
        uschinaContainer.render();
      });
    }
  };
  return Console;
});