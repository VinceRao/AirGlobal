'use stick';

define([
  'jquery',
  'backbone',
  'util',
  'd3',
  'view/uschina',
  'd3-legend',
], function (
  $,
  Backbone,
  util,
  d3,
  USChina
) {
  var Console = function () {
  };

  Console.prototype = {
    init : function () {
      var root, uschinaContainer, options = {},
        $def = $.Deferred();

      root = new Backbone.View({el: $('#ag-root')});
      options.rootView = root;
      options.data = {};
      d3.csv('Data/china_cities.csv', function (cities) {
        var city_map = {},
            cities = cities;
        options.data.cities = cities;
        options.data.city_map = city_map;
        cities.forEach(function (city) {
          city_map[city.value] = city.id;
        });
        d3.csv('Data/China_Station_PM25.csv', function (origin_data) {
          var date_array = [], data_array = [], date_array_number = [], city_data= [];
          city_data = [
            {name : 'Guangzhou', value : []},
            {name : 'Shanghai', value : []},
            {name : 'Beijing', value : []},
            {name : 'Chengdu', value : []},
            {name : 'Shenyang', value : []},
          ];
          options.data.origin_data = origin_data;
          options.data.date_array = date_array;
          options.data.date_array_number = date_array_number;
          options.data.data_array = data_array;
          options.data.city_data = city_data;
          origin_data.forEach(function (entry, index) {
            var date = new Date(entry.Year, entry.Month - 1, entry.Day, entry.Hour);
            options.data.origin_data[index].time = date;
            date_array.push(date);
            date_array_number.push(+date);
            var temp = [];
            cities.forEach(function (city) {
              if(entry[city.value]){
                temp.push({id:city.id, v:entry[city.value]})
              }
              var v = entry[city.value];
              switch(city.value){
                case 'Guangzhou':
                  city_data[0].value.push({time : date, value : isNaN(v) ? 0 : v});
                  break;
                case 'Shanghai':
                  city_data[1].value.push({time : date, value : isNaN(v) ? 0 : v});
                  break;
                case 'Beijing':
                  city_data[2].value.push({time : date, value : isNaN(v) ? 0 : v});
                  break;
                case 'Chengdu':
                  city_data[3].value.push({time : date, value : isNaN(v) ? 0 : v});
                  break;
                case 'Shenyang':
                  city_data[4].value.push({time : date, value : isNaN(v) ? 0 : v});
                  break;
              }
            });
            data_array.push(temp);
          });
          $def.resolve();
        })
        // console.log(options.data)

      });
      $.when($def).done(function () {
        uschinaContainer = new USChina({root : options.rootView, data : options.data})
        uschinaContainer.render();
      });
    }
  };
  return Console;
});