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
          options.data.embassy.city_map = options.data.berkeley.city_map;
          //console.log(options.data.embassy);
          var b = options.data.berkeley;
          var e = options.data.embassy;
          //console.log(options.data.embassy);

          var shanghaidata = b.getAllDayForCity("Shanghai");
          console.log(shanghaidata);

          //test embassy
          var t1 = e.beijing.start;
          var t3 = e.shanghai.start;
          var t2 = e.chengdu.start;
          var t4 = e.shenyang.start;

          var t5 = e.beijing.end;
          var t6 = e.shanghai.end;
          var t7 = e.chengdu.end;
          var t8 = e.shenyang.end;
          /*console.log(t5);
          console.log(t6);
          console.log(t7);
          console.log(t8);

          console.log(e.getAllCityAtDay(t1));
          console.log(e.getAllCityAtDay(t2));
          console.log(e.getAllCityAtDay(t3));
          console.log(e.getAllCityAtDay(t4));

          console.log(e.getAllCityAtDay(t5));
          console.log(e.getAllCityAtDay(t6));
          console.log(e.getAllCityAtDay(t7));
          console.log(e.getAllCityAtDay(t8));

          console.log(e.getAllDayForCity("Beijing"));
          console.log(e.getAllDayForCity("Shanghai"));
          console.log(e.getAllDayForCity("Chengdu"));
          console.log(e.getAllDayForCity("Shenyang"));


          console.log(e.getOneCityInTimeRange("Beijing", t1, t5));
          console.log(e.getOneCityInTimeRange("Shanghai", t3, t6));
          console.log(e.getOneCityInTimeRange("Chengdu", t2, t7));
          console.log(e.getOneCityInTimeRange("Shenyang", t4, t8));
*/

          /*// an array of all cities
           var cities = options.data.berkeley.getAllCities();
           console.log(cities);

          //get all days data for a city
           var beijingdata = options.data.berkeley.getAllDayForCity("Beijing");
           console.log(beijingdata);

             // get all days data for a set of cities
           var somecities = ["Anshan","Beijing","Zunyi"] //0, 6, 181 in cities
           var somecitiesAlltime = options.data.berkeley.getCitiesData(somecities);
           console.log(somecitiesAlltime);

           //get all cities data for a day
           var d0 = options.data.berkeley.start; //in microseconds, day 0
           var d1 = 1; //day 1
           var allcityDay0 = options.data.berkeley.getAllCityAtDay(d0);
           var allcityDay1 = options.data.berkeley.getAllCityAtDay(d1);
           console.log(allcityDay0);
           console.log(allcityDay1);

          //get all cities data for a time range, consecutive
           var start = options.data.berkeley.start; //in microseconds
           var end = start + options.data.berkeley.interval * 3;
           var allcityTimeRange = options.data.berkeley.getTimeRangeData(start, end);
           console.log(allcityTimeRange);

           //get certain timepoints for a set of cities, return a map with timepoints, indices, and city-array pairs
           //timepoints can be indices or microseconds
           var timepoints = [options.data.berkeley.start, 1, 121];
           //var somecities = ["Anshan","Beijing","Zunyi"] //0, 6, 181 in cities //already defined above
           var selecteddata = options.data.berkeley.getCitiesTimepoints(somecities, timepoints);
           console.log(selecteddata);
 */
/*        uschinaContainer = new USChina({root : options.rootView, data : options.data})
        uschinaContainer.render();*/
      });
    }
  };
  return Console;
});