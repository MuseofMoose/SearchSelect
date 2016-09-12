(function() {
  'use strict';

var app = angular
  .module('demo', ['ngAnimate', 'searchSelect'])
  .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;

    vm.currentFruitOption = {};
    vm.currentUserOption = {};
    vm.currentVideoGameCharacterOption = { id: 6, name: 'Sonic', weapon: 'Speed' }
;

    vm.fruitOptions = [
      { id: 1, name: 'Apple', },
      { id: 2, name: 'Banana', },
      { id: 3, name: 'Strawberry', },
      { id: 4, name: 'Plum', },
      { id: 5, name: 'Kiwi', },
      { id: 6, name: 'Peach', },
      { id: 7, name: 'Orange', },
      { id: 8, name: 'Grapefruit', },
      { id: 9, name: 'Grape', },
      { id: 10, name: 'Mango', },
      { id: 11, name: 'Blueberry', },
    ]

    vm.userOptions = [
      { id: 1, first_name: 'Bob', last_name: 'Jones', },
      { id: 2, first_name: 'Sarah', last_name: 'Mitchell', },
      { id: 3, first_name: 'Hoon', last_name: 'Kim', },
      { id: 4, first_name: 'Nelson', last_name: 'Castelle', },
      { id: 5, first_name: 'Celeste', last_name: 'Blaroux', },
      { id: 6, first_name: 'Gabriela', last_name: 'Caristole', },
    ]

    vm.videoGameCharacterOptions = [
      { id: 1, name: 'Link', weapon: 'Sword', },
      { id: 2, name: 'Snake', weapon: 'Explosives', },
      { id: 3, name: 'Peach', weapon: 'Turnips', },
      { id: 4, name: 'Samus', weapon: 'Arm Cannon', },
      { id: 5, name: 'Pac-Man', weapon: 'Mouth', },
      { id: 6, name: 'Sonic', weapon: 'Speed', },
      { id: 7, name: 'Infernape', weapon: 'Fire', },
      { id: 8, name: 'Mia', weapon: 'Clumsiness', },
    ]
  }

})();
