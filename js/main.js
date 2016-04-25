'use stick'

require.config({
  baseUrl : '.',
  paths : {
    view : 'js/view',
    model : 'js/model',
    template : 'templates',

    // third_party
    'd3' : 'js/third_party/d3',
    'jquery' : 'js/third_party/jquery-2.2.3',
    'jquery-ui' : 'js/third_party/jquery-ui',
    'bootstrap' : 'js/third_party/bootstrap',
    'backbone' : 'js/third_party/backbone',
    'underscore' : 'js/third_party/underscore',

    // Utilities
    'util' : 'js/util',

    'console' : 'js/view/console'
  },
  shim : {
    'bootstrap' : {deps : ['jquery']},

    'backbone' : {deps : ['underscore', 'jquery']}
  }
});

require([
  'console',
], function (Console) {
  var app = new Console();
  app.init();
});