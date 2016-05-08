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
            function callback(data){
                /*var AQI = [];
                data.forEach(function(t){
                    if(t['Value'] <= 50){
                        AQI.push("Good");
                    }else if(t['Value'] <= 100){
                        AQI.push("Moderate");
                    }else if(t['Value'] <= 150){
                        AQI.push("USG");
                    }else if(t['Value'] <= 200){
                        AQI.push("Unhealthy");
                    }else if(t['Value'] <= 300){
                        AQI.push("Very Unhealthy");
                    }else {
                        AQI.push("Hazardous");
                    }
                });*/
              //  console.log(AQI);
                self.finish();

            }
            d3.csv('Data/beijing_combined.csv', callback);
            return this.load_def.promise();
        }
    });

    return Embassy;

});