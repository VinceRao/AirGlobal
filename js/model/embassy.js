define([
    'model/datamodel',
    'd3'
], function(DataModel, d3){
    var Embassy = DataModel.extend({
        init : function(){
            console.log("Embassy init");
            console.log(d3);
            console.log($.Deferred());
        },
        load : function(){
            var self = this;

            /* load the data, resolve in callback function:"$load_def.resolve();"*/
            d3.csv('Data/China_Station_PM25.csv', function(data){
               // console.log(data);
                self.finish();
            });

            return this.load_def.promise();
        }
    });

    return Embassy;

});