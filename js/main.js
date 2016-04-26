'use stick'

require.config({
  urlArgs: 'v=' + (((1+Math.random())*0x1000000)|0).toString(16).substring(1),
  baseUrl : '.',
  paths : {
    view : 'js/view',
    model : 'js/model',
    template : 'templates',

    // third_party
    'd3' : 'js/third_party/d3',
    'd3-legend' : 'js/third_party/d3-legend',
    'jquery' : 'js/third_party/jquery-2.2.3',
    'jquery-ui' : 'js/third_party/jquery-ui',
    'bootstrap' : 'js/third_party/bootstrap',
    'backbone' : 'js/third_party/backbone',
    'underscore' : 'js/third_party/underscore',
    'text' : 'js/third_party/text',
    'chroniton-only' : 'js/third_party/chroniton-only',
    'chroniton-bundle' : 'js/third_party/chroniton-bundle',

    // Utilities
    'util' : 'js/util',

    'console' : 'js/view/console'
  },
  shim : {
    'bootstrap' : {deps : ['jquery']},

    'backbone' : {deps : ['underscore', 'jquery']},

    'd3-legend' : {deps: ['d3']},

    'chroniton-only' : {deps:['d3']}
  }
});

require([
  'console',
], function (Console) {
  var app = new Console();
  app.init();
});