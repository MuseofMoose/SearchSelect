describe("SearchSelect", function () {
  var element, controller;

  var videoGameCharacterOptions = [
    { characterId: 1, name: 'Link', weapon: 'Sword' },
    { characterId: 2, name: 'Snake', weapon: 'Explosives' },
    { characterId: 3, name: 'Peach', weapon: 'Turnips' },
    { characterId: 4, name: 'Samus', weapon: 'Arm Cannon' },
    { characterId: 5, name: 'Pac-Man', weapon: 'Mouth' },
    { characterId: 6, name: 'Sonic', weapon: 'Speed' },
    { characterId: 7, name: 'Infernape', weapon: 'Fire' },
    { characterId: 8, name: 'Mia', weapon: 'Clumsiness' },
  ]

  var currentOption = { characterId: 1, name: 'Link', weapon: 'Sword' };

  var elementString = '<search-select ng-model="currentOption' + '" options="options"' +
  ' id-key="characterId" label-keys="name" placeholder-text="Select Character"' +
  ' font-awesome-icon="fa-user"></search-select>';

  beforeEach(module('searchSelect', 'search-select.html'));

  beforeEach(inject(function($templateCache, $rootScope, $compile) {
    $scope = $rootScope.$new();
    $scope.currentOption = currentOption;
    $scope.options = videoGameCharacterOptions;

    element = angular.element(elementString);
    element = $compile(element)($scope);
    $scope.$digest();

    controller = element.controller("searchSelect");
  }));

  it("test", inject(function() {
  }));
});
