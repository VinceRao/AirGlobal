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

    Math.median = function(ary) {
      var  numA, i;
      for (i = ary.length-1; i >= 0; i--) {
          ary[i] = +ary[i];
      }
      numA = function(a, b){return (a-b);};
      ary.sort(numA);
      while (ary.length > 1 && !isFinite(ary[0])) ary.shift();
      return ary[Math.floor(ary.length/2)];
    }

    Util = function() {
    };

    Util.prototype = {
      
    };

    util = new Util();

    return util;
  }
);