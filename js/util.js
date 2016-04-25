'use stick';

define([
  'jquery'
], function ($) {
    var Util, util;

    String.prototype.format = function() {
      var args = arguments;
      return this.replace( /\{(\d+)\}/g, function(match, number) {
        return args[number] !== undefined ? args[number] : match;
      });
    };

    Util = function() {
    };

    Util.prototype = {
      
    };

    util = new Util();

    return util;
  }
);