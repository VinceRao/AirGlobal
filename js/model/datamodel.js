/**
 * Created by Shuai on 5/1/16.
 */
define([
    'backbone',
    'd3',
    'jquery'
], function (Backbone, d3, $) {
    var DataModel = Backbone.Model.extend({
        load_def : $.Deferred(),

        init : function(){
            console.log("DataModel init.");
        },

        //get all city data for a particular time point
        getByTime : function(){
            console.log("getByTime()");
        },

        //get all time point data for a particular city
        getByCity : function(){
            console.log("getByCity()");
        },

        finish : function (){
            this.load_def.resolve();
        }
    });

    return DataModel;

});