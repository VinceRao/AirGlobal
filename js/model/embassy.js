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

                self.finish();

            }
            d3.csv('Data/beijing_combined.csv', callback);
            return this.load_def.promise();
        }
    });

    return Embassy;

});