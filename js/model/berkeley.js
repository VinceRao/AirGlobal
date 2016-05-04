define([
    'model/datamodel',
    'd3'
], function(DataModel, d3){
    var Berkeley = DataModel.extend({
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

        //get time index in the by_time array (length 2928)
        getTimeIndex: function(microseconds){
            console.log(microseconds);
            console.log(this.start);
            return (microseconds - this.start)/this.interval;
        },

        //get city index in the by_city array (length 182)
        getCityIndex: function(cityname){
            return this.city_index[cityname];
        },
    });

    return Berkeley;

});