describe("SearchSelectController", function () {
  var element, controller;

  var defaultOptions = [
    { characterId: 1, name: 'Link', weapon: 'Sword' },
    { characterId: 2, name: 'Snake', weapon: 'Explosives' },
    { characterId: 3, name: 'Peach', weapon: 'Turnips' },
    { characterId: 4, name: 'Samus', weapon: 'Arm Cannon' },
    { characterId: 5, name: 'Pac-Man', weapon: 'Mouth' },
    { characterId: 6, name: 'Sonic', weapon: 'Speed' },
    { characterId: 7, name: 'Infernape', weapon: 'Fire' },
    { characterId: 8, name: 'Mia', weapon: 'Clumsiness' },
  ]

  var altOptions = [
    { characterId: 1, name: 'Link', weapon: 'Sword' },
    { characterId: 2, name: 'Snake', weapon: 'Explosives' },
    { characterId: 3, name: 'Peach', weapon: 'Turnips' },
  ]

  var currentOption = { characterId: 1, name: 'Link', weapon: 'Sword' };

  var elementString = '<search-select ng-model="currentOption' + '" options="options"' +
  ' id-key="{{idKey}}" label-keys="{{labelKeys}}" placeholder-text="{{placeholderText}}"' +
  ' font-awesome-icon="{{fontAwesomeIcon}}"></search-select>';

  beforeEach(module('searchSelect', 'search-select.html'));

  beforeEach(inject(function($templateCache, $rootScope, $compile) {
    $scope = $rootScope.$new();
    $scope.currentOption = currentOption;
    $scope.options = defaultOptions;
    $scope.idKey = 'characterId';
    $scope.labelKeys = 'name';
    $scope.placeholderText = 'Select Character';
    $scope.fontAwesomeIcon = 'fa-user';

    element = angular.element(elementString);
    element = $compile(element)($scope);

    $scope.$digest();

    controller = element.controller("searchSelect");
  }));

  // it ("should have options defined", inject(function() {
  //   expect (controller.options).toBeDefined();
  // }));

  // it ("should have Link as the current option", inject(function() {
  //   expect (controller.ngModel.name).toBe('Link');
  // }));

  it ("should throw an exception if options don't have the passed in id key", inject(function(){
    var badOptions = [
      { id: 1, name: 'Link', weapon: 'Sword' },
      { id: 2, name: 'Snake', weapon: 'Explosives' },
    ]

    controller.idKey = "characterId";
    controller.options = badOptions;

    expect (function(){
      $scope.$digest()
    }).toThrowError('No option attribute matched with specified idKey.');
  }));

  it ("should set the id key to 'id' when undefined", inject(function(){
    controller.idKey = undefined;
    controller.options = altOptions;
    $scope.$digest();

    expect (controller.idKey).toBe('id');
  }))

  it ("should add the ss_index attribute to all options on initialization", inject(function(){
    var options = controller.filteredOptions;
    for (var i=0; i<options.length; i++){
      expect (options[i].ss_index).toBeDefined();
    }
  }))

  it ("should have a null selected index when current option is null", inject(function(){
    controller.selectedIndex = null;
    controller.ngModel = null;
    controller.options = altOptions;
    $scope.$digest();

    expect(controller.selectedIndex).toBe(null);
  }))

  it ("should set the selected index appropriately if an option is already selected", inject(function(){
    controller.ngModel = { characterId: 2, name: 'Snake', weapon: 'Explosives' };
    controller.options = altOptions;
    $scope.$digest();

    expect (controller.selectedIndex).toBe(1);
  }))

  it ("Should throw an exception if label keys string does not match an option key", inject(function(){
    var badOptions = [
      { characterId: 1, mismatchedKey: 'Link', weapon: 'Sword' },
      { characterId: 2, mismatchedKey: 'Snake', weapon: 'Explosives' },
    ]

    controller.options = badOptions;

    expect (function(){
      $scope.$digest();
    }).toThrowError('No option attribute matched with any key in labelKeys.');
  }))

});
