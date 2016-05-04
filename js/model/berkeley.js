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
                cities.forEach(function (city, i) {
                    city_map[city.value] = city.id; //value is city name, id is an integer
                    city_index[city.value] = i;

                });
                self.city_map = city_map;
                self.city_index = city_index;
                //console.log(Berkeley.city_map);
                //console.log(Berkeley.city_index);

                d3.csv('Data/China_Station_PM25.csv', function (time_rows) {
                    /*get the time frame of the date*/
                    var first_row = time_rows[0];
                    var start_date = new Date(first_row.Year, first_row.Month - 1, first_row.Day, first_row.Hour);//start date of the data
                    var absolute_start = +start_date;
                    var second_row = time_rows[1];
                    var second_date = new Date(second_row.Year, second_row.Month - 1, second_row.Day, second_row.Hour);
                    var interval = +second_date-absolute_start; //3600,000 ms, an hour

                    self.start = absolute_start;
                    self.interval = interval;


                   /*construct Berkeley.by_time and Berkeley.by_city, both are arrays of arrays */
                    self.by_time = [];//has 2928 elements, each being an array of length 182
                    self.by_city = []; // has 182 elements, each being an array of 2928 elements
                    //initialize the 182 empty arrays for each city
                    for(idx = 0; idx < 182; idx++ ){
                        self.by_city.push([]);
                    }
                    //remove the time related key-value pairs
                    time_rows.forEach(function (entry, index) {
                        /*var date = new Date(entry.Year, entry.Month-1, entry.Day, entry.Hour);
                        console.log(self.getTimeIndex(+date));*/

                        //remove the time related key-value pairs
                        delete entry.Year;
                        delete entry.Month;
                        delete entry.Day;
                        delete entry.Hour;
                    });

                    //create the arrays inside Berkeley.by_time and Berkeley.by_city
                    time_rows.forEach(function (entry, index) {
                        var t_data = []; // length of 182 eventually
                        for (var city in entry) {
                            t_data.push(entry[city]);
                            var idx = self.getCityIndex(city);
                            self.by_city[idx].push(entry[city]);
                        }
                        self.by_time.push(t_data);
                    });
                    //console.log(Berkeley.by_time);
                    //console.log(Berkeley.by_city);

                    self.finish();
                });
            };

            /* load the data*/
            d3.csv('Data/china_cities.csv', callback);
            return this.load_def.promise();
        },

        //get data for all cities at timepoint t
        getAllCityAtTime: function(microseconds){
            var t;
            if(microseconds <=2928) { //index
                t = microseconds;
            }else{
                t = this.getTimeIndex(microseconds);//absolute microseconds
            }
            return this.by_time[t];
        },

        //get data for all timepoints for a city
        getAllTimeForCity: function(cityname){
            var city = this.getCityIndex(cityname);
            return this.by_city[city];
        },

        //select time range, input are start time and end time, output is array[length of range]
        getTimeRangeData: function(start, end){
            var ts = this.getTimeIndex(start);
            var te = this.getTimeIndex(end);
            return this.by_time.slice(ts, te+1);
        },

        //select cities, return all timepoints data for the cities in a map.me
        getCitiesData: function(names){
            var map = {};
            for(var i = 0; i < names.length; i++){
                var name = names[i];
                var citydata = this.getAllTimeForCity(name);
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
                if(t <= 2928){ //time indices
                    idx = t;
                    microsecond = this.getMicroseconds(idx);
                }else{//microseconds
                    var idx = this.getTimeIndex(t);
                    microsecond = t;
                }
                indices.push(idx);
                microseconds.push(microsecond);
            }

            map.cities = names;
            map.timepoints = microseconds;
            map.timeindices = indices;
            for (var city in citiesAllTime){
                var alltimearray = citiesAllTime[city];
                map[city] = [];
                for( var i = 0 ; i < map.timeindices.length; i++){
                    var idx = map.timeindices[i];
                    map[city].push(alltimearray[idx]);
                }
            }
            return map;
        },

        //get time index in the by_time array (length 2928)
        getTimeIndex: function(microseconds){
            return (microseconds - this.start)/this.interval;
        },

        //get microsecond from time index
        getMicroseconds: function(time_index){
          return this.start + this.interval * time_index;
        },

        //get city index in the by_city array (length 182)
        getCityIndex: function(cityname){
            return this.city_index[cityname];
        },

        //get all city names
        getAllCities: function(){
            return Object.keys(this.city_map);
        }
    });

    return Berkeley;

});