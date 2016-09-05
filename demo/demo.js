(function() {
  'use strict';

var app = angular
  .module('demo', ['ngSanitize', 'ngAnimate', 'searchSelectApp'])
  .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;

    vm.currentOption = {};
    vm.options = [
      {
        id: 1,
        first_name: 'Bob',
        last_name: 'Jones',
      },
      {
        id: 2,
        first_name: 'Sarah',
        last_name: 'Mitchell',
      },
      {
        id: 3,
        first_name: 'Hoon',
        last_name: 'Kim',
      },
    ]
  }

})();
