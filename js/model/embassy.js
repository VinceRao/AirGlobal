define([
    'model/datamodel',
    'd3'
], function(DataModel, d3){
    var Embassy = DataModel.extend({
        load_def : $.Deferred(),
        init : function(){
            console.log("Embassy init");
            console.log(d3);
            console.log($.Deferred());
        },
        load : function(){
            var self = this;
            self.beijing = {};
            self.beijing.data = [];
            self.chengdu = {};
            self.chengdu.data = [];
            self.guangzhou = {};
            self.guangzhou.data = [];
            self.shanghai = {};
            self.shanghai.data = [];
            self.shenyang = {};
            self.shenyang.data = [];
            self.interval = 3600000*24;
            self.city_map = {}; //get initialized from an instance of Berkeley

            var beijing = function (data){
                self.beijing.start = self.getUTCMilliseconds(data[0].Date);
                self.beijing.end = self.getUTCMilliseconds(data[data.length-1].Date);
                data.forEach(function(entry){
                    self.beijing.data.push(+entry['Value']);
                });
                var chengdu = function(data){
                    self.chengdu.start = self.getUTCMilliseconds(data[0].Date);
                    self.chengdu.end = self.getUTCMilliseconds(data[1491].Date);
                    data.forEach(function(entry){
                        self.chengdu.data.push(+entry['Value']);
                    });
                    var guangzhou = function(data){
                        self.guangzhou.start = self.getUTCMilliseconds(data[0].Date);
                        self.guangzhou.end = self.getUTCMilliseconds(data[1856].Date);
                        data.forEach(function(entry){
                            self.guangzhou.data.push(+entry['Value']);
                        });
                        var shanghai = function(data){
                            self.shanghai.start = self.getUTCMilliseconds(data[0].Date);
                            self.shanghai.end = self.getUTCMilliseconds(data[1856].Date);

                            data.forEach(function(entry){
                                self.shanghai.data.push(+entry['Value']);
                            });
                            var shenyang = function(data){
                                self.shenyang.start = self.getUTCMilliseconds(data[0].Date);
                                self.shenyang.end = self.getUTCMilliseconds(data[1125].Date);
                                data.forEach(function(entry){
                                    self.shenyang.data.push(+entry['Value']);
                                });
                                self.finish();
                            };
                            d3.csv('Data/US_mission_China/shenyang_daily.csv', shenyang);
                        };
                        d3.csv('Data/US_mission_China/shanghai_daily.csv', shanghai);
                    };
                    d3.csv('Data/US_mission_China/guangzhou_daily.csv', guangzhou);
                };
                d3.csv('Data/US_mission_China/chengdu_daily.csv', chengdu);
            };
            d3.csv('Data/US_mission_China/beijing_daily.csv', beijing);
            return this.load_def.promise();
        },


        //get all city data for a time range
        getOneCityInTimeRange: function(city, start, end){
            var res = [];
            var alltime = this.getAllDayForCity(city);
            var istart = this.getDayIndex(city, start);
            var iend = this.getDayIndex(city, end);
            for(var i = istart; i <= iend; i++){
                var datapoint = {};
                datapoint.date = this.getMicroseconds(city, i);
                datapoint.value = alltime[i];
                res.push(datapoint);
            }
            return res;
        },

        //get data for all days for a city
        getAllDayForCity: function(cityname){
            return this[cityname.toLowerCase()].data;
        },

        //get data for all days for a city
        getAllTimeForCity: function(cityname){
            return this[cityname.toLowerCase()].data;
        },

        //get data for all cities at day
        getAllCityAtDay: function(day){
            var fivecities = [];
            if(day < this.beijing.start || day > this.beijing.end){
                fivecities.push(+NaN);
            }else{
                var idx = this.getDayIndex("beijing", day);
                fivecities.push(this.beijing.data[idx]);
            }
            if(day < this.chengdu.start || day > this.chengdu.end){
                fivecities.push(+NaN);
            }else{
                var idx = this.getDayIndex("chengdu", day);
                fivecities.push(this.chengdu.data[idx]);
            }
            if(day < this.guangzhou.start || day > this.guangzhou.end){
                fivecities.push(+NaN);
            }else{
                var idx = this.getDayIndex("guangzhou", day);
                fivecities.push(this.guangzhou.data[idx]);
            }
            if(day < this.shanghai.start || day > this.shanghai.end){
                fivecities.push(+NaN);
            }else{
                var idx = this.getDayIndex("shanghai", day);
                fivecities.push(this.shanghai.data[idx]);
            }
            if(day < this.shenyang.start || day > this.shenyang.end){
                fivecities.push(+NaN);
            }else{
                var idx = this.getDayIndex("shenyang", day);
                fivecities.push(this.shenyang.data[idx]);
            }
            return fivecities;
        },

        //get city index in the by_city array (length 5)
        getCityIndex: function(cityname){
            switch(cityname){
                case "beijing": return 0;
                case "chengdu": return 1;
                case "guangzhou": return 2;
                case "shanghai":return 3;
                case "shenyang": return 4;
                default: return -1;
            }
        },

        //get map id
        getMapID: function(cityname){
            return this.city_map[cityname];
        },

        //get day index in the by_day array (length 122)
        getDayIndex: function(city, microseconds){
            return (microseconds - this[city.toLowerCase()].start)/this.interval;
        },

        //get microsecond from day index
        getMicroseconds: function(city, day_index){
            return this[city.toLowerCase()].start + this.interval * day_index;
        },

        getStart: function(city){
            var name = city.toLowerCase();
            return this[name].start;
        },
        getEnd: function(city){
            return this[city.toLowerCase()].end;
        },

        getUTCMilliseconds : function(date_string){
            var date = date_string.split("/");
            return Date.UTC(+date[2]+2000, +(date[0]-1), +date[1]);
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
            }else {
                return "#663300";  //brown
            }
        }
    });

    return Embassy;

});