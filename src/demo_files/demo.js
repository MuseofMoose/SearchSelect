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
    vm.currentVideoGameCharacterOption = { characterId: 6, name: 'Sonic', weapon: 'Speed' }
    vm.disabled = false;

    vm.cleanOption = cleanOption;

    vm.fruitOptions = [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Strawberry' },
      { id: 4, name: 'Plum' },
      { id: 5, name: 'Kiwi' },
      { id: 6, name: 'Peach' },
      { id: 7, name: 'Orange' },
      { id: 8, name: 'Grapefruit' },
      { id: 9, name: 'Grape' },
      { id: 10, name: 'Mango' },
      { id: 11, name: 'Blueberry' },
    ]

    vm.userOptions = [
      { id: 1, first_name: 'Bob', last_name: 'Jones' },
      { id: 2, first_name: 'Sarah', last_name: 'Mitchell' },
      { id: 3, first_name: 'Hoon', last_name: 'Kim' },
      { id: 4, first_name: 'Nelson', last_name: 'Castelle' },
      { id: 5, first_name: 'Celeste', last_name: 'Blaroux' },
      { id: 6, first_name: 'Gabriela', last_name: 'Caristole' },
    ]

    vm.videoGameCharacterOptions = [
      { characterId: 1, name: 'Link', weapon: 'Sword' },
      { characterId: 2, name: 'Snake', weapon: 'Explosives' },
      { characterId: 3, name: 'Peach', weapon: 'Turnips' },
      { characterId: 4, name: 'Samus', weapon: 'Arm Cannon' },
      { characterId: 5, name: 'Pac-Man', weapon: 'Mouth' },
      { characterId: 6, name: 'Sonic', weapon: 'Speed' },
      { characterId: 7, name: 'Infernape', weapon: 'Fire' },
      { characterId: 8, name: 'Mia', weapon: 'Clumsiness' },
    ]

    function cleanOption(option){
      var copy = angular.copy(option);
      delete copy['ss_display_html'];
      return copy;
    }
  }

})();
