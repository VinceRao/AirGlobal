/**
 * Created by Shuai on 5/7/16.
 */
define([
    'model/datamodel',
    'd3'
], function(DataModel, d3){
    var Berkeley = DataModel.extend({
        load_def : $.Deferred(),

        init : function(){
            console.log("Berkeley init");
        },

        load : function(){
            var self = this;
            /*call back function as argument for ds.csv, applied on each row object of the data*/
            var callback = function (cities) {
                var city_map = {};
                var city_index = {};
                var city_id_map = {};
                cities.forEach(function (city, i) {
                    city_map[city.value] = city.id; //value is city name, id is an integer
                    city_id_map[city.id] = city.value; //value is city name, id is an integer
                    city_index[city.value] = i;

                });
                self.city_map = city_map;
                self.city_index = city_index;
                self.city_id_map = city_id_map;
                //console.log(Berkeley.city_map);
                //console.log(Berkeley.city_index);

                d3.csv('Data/berkeley_daily(max).csv', function (time_rows) {
                    /*set the time frame of the date*/
                    self.start = 1396681200000;
                    self.interval = 3600000*24;
                    self.end = self.start + self.interval * 122;
                    //console.log(self.start);
                    //console.log(self.interval);

                    /*construct Berkeley.by_time and Berkeley.by_city, both are arrays of arrays */
                    self.by_day = []; //has 2928/24 = 122 days, each being an array of length 182
                    self.by_city = []; // has 182 elements, each beijing an array of length 122

                    //initialize the 182 empty arrays for each city
                    for(idx = 0; idx < 182; idx++ ){
                        self.by_city.push([]);
                    }
                    //create the arrays inside Berkeley.by_day and Berkeley.by_city
                    time_rows.forEach(function (entry, index) {
                        var day_array = []; // length of 182 eventually
                        for (var city in entry) {
                            day_array.push(+entry[city]);
                            var idx = self.getCityIndex(city);
                            self.by_city[idx].push(+entry[city]);
                        }
                        self.by_day.push(day_array);
                    });

                    //console.log(self.by_day);
                    //console.log(self.by_city);

                    self.finish();
                });
            };

            /* load the data*/
            d3.csv('Data/china_cities.csv', callback);
            return this.load_def.promise();
        },

        //get all city data for a time range
        getOneCityInTimeRange: function(city, start, end){
            var res = [];
            var alltime = this.getAllDayForCity(city);
            var istart = this.getDayIndex(start);
            var iend = this.getDayIndex(end);
            for(var i = istart; i <= iend; i++){
                var datapoint = {};
                datapoint.date = this.getMicroseconds(i);
                datapoint.value = alltime[i];
                res.push(datapoint);
            }
            return res;
        },

        //get data for all cities at time
        getAllCityAtDay: function(time){
            var day;
            if(time < 122) { //index
                day = time;
            }else{
                day = this.getDayIndex(time);//absolute microseconds
            }
            return this.by_day[day];
        },

        //get data for all days for a city
        getAllDayForCity: function(cityname){
            var city = this.getCityIndex(cityname);
            return this.by_city[city];
        },


        //select time range, input are start time and end time, output is array[length of range]
        getTimeRangeData: function(start, end){
            var ts = this.getDayIndex(start);
            var te = this.getDayIndex(end);
            return this.by_day.slice(ts, te+1);
        },

        //select cities, return all days data for the cities in a map
        getCitiesData: function(names){
            var map = {};
            for(var i = 0; i < names.length; i++){
                var name = names[i];
                var citydata = this.getAllDayForCity(name);
                map[name] = citydata;
            }
            return map;
        },

        //select cities for a set of timepoints, return a map, timepoints can be indices or microseconds
        getCitiesTimepoints: function(names, timepoints){
            var citiesAllTime = this.getCitiesData(names);
            var map = {};
            var indices = [];
            var microseconds = [];
            for(var i = 0; i < timepoints.length; i++){
                var t = timepoints[i];
                var idx;
                var microsecond;
                if(t <122){ //time indices
                    idx = t;
                    microsecond = this.getMicroseconds(idx);
                }else{//microseconds
                    var idx = this.getDayIndex(t);
                    microsecond = t;
                }
                indices.push(idx);
                microseconds.push(microsecond);
            }

            map.cities = names;
            map.timepoints = microseconds;
            map.dayindices = indices;
            for (var city in citiesAllTime){
                var alltimearray = citiesAllTime[city];
                map[city] = [];
                for( var i = 0 ; i < map.dayindices.length; i++){
                    var idx = map.dayindices[i];
                    map[city].push(alltimearray[idx]);
                }
            }
            return map;
        },

        //get day index in the by_day array (length 122)
        getDayIndex: function(microseconds){
            return (microseconds - this.start)/this.interval;
        },

        //get microsecond from day index
        getMicroseconds: function(day_index){
            return this.start + this.interval * day_index;
        },

        //get city index in the by_city array (length 182)
        getCityIndex: function(cityname){
            return this.city_index[cityname];
        },

        //get map id
        getMapID: function(cityname){
            return this.city_map[cityname];
        },

        getCityNameByID: function(id){
            return this.city_id_map[id];
        },

        //get all city names
        getAllCities: function(){
            return Object.keys(this.city_map);
        },
        getStart: function(){
            return this.start;
        },
        getEnd: function(){
            return this.end;
        },

        //given concentration calculate AQI
        getAQI: function(concentration){
            if(_.isNaN(concentration)){
                return null;
            } else if(concentration <= 50){
                return "Good";
            }else if(concentration <= 100){
                return "Moderate";
            }else if(concentration <= 150){
                return "USG";
            }else if(concentration <= 200){
                return "Unhealthy";
            }else if(concentration <= 300){
                return "Very Unhealthy";
            }else {
                return "Hazardous";
            }
        },
        //given concentration get color
        getColor: function(concentration){
            if(_.isNaN(concentration)){
                return "#ffffff";
            } else if(concentration <= 50){
                return "#00cc00"; //green
            }else if(concentration <= 100){
                return "#ffff00"; //yellow
            }else if(concentration <= 150){
                return "#ff8000"; //orange
            }else if(concentration <= 200){
                return "#ff0000";  //red
            }else if(concentration <= 300){
                return "#993366";  //purple
            }else if(_.isNaN(concentration)){
                return "#ffffff";  //white
            }else {
                return "#663300";  //brown
            }
        }
    });

    return Berkeley;

});
