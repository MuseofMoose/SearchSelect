describe ("SearchSelectController", function () {
  var element, controller, buildController;

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

  var defaultCurrentOption = { characterId: 1, name: 'Link', weapon: 'Sword' };

  var defaultElementString = '<search-select ng-model="currentOption' + '" options="options"' +
  ' id-key="{{idKey}}" label-keys="{{labelKeys}}" placeholder-text="{{placeholderText}}"' +
  ' font-awesome-icon="{{fontAwesomeIcon}}" disabled="disabled" required="required"></search-select>';

  beforeEach(module('searchSelect', 'search-select.html'));

  beforeEach(inject(function($templateCache, $rootScope, $compile) {
    $scope = $rootScope.$new();
    $scope.currentOption = defaultCurrentOption;
    $scope.options = defaultOptions;
    $scope.idKey = 'characterId';
    $scope.labelKeys = 'name';
    $scope.placeholderText = 'Select Character';
    $scope.fontAwesomeIcon = 'fa-user';
    $scope.disabled = null;
    $scope.required = null;

    buildDirective = function(elementString){
      if (typeof elementString === 'undefined') { elementString = defaultElementString };
      element = angular.element(elementString);
      element = $compile(element)($scope);
      $scope.$digest();
      controller = element.controller('searchSelect');
    }
  }));

  //*
  //Initialization Function Tests
  //*

  it ("should throw an exception if ngModel is undefined", inject(function(){
    $scope.currentOption = undefined;

    expect (function(){
      buildDirective();
    }).toThrowError('ngModel variable for storing selected option is undefined.');
  }));

  it ("should throw an exception if options don't have the passed in id key", inject(function(){
    var badOptions = [
      { id: 1, name: 'Link', weapon: 'Sword' },
      { id: 2, name: 'Snake', weapon: 'Explosives' },
    ]
    $scope.options = badOptions;

    expect (function(){
      buildDirective();
    }).toThrowError('No option attribute matched with specified idKey.');
  }));

  it ("should set the id key to 'id' when the id key is an empty string", inject(function(){
    $scope.idKey = '';
    buildDirective();

    expect (controller.idKey).toBe('id');
  }))

  it ("should set the isOptionSelected boolean to true when an option is already selected", inject(function(){
    buildDirective();

    expect (controller.isOptionSelected).toBe(true);
  }))

  it ("should set the isOptionSelected boolean to false when no option is already selected", inject(function(){
    $scope.currentOption = null;
    buildDirective();

    expect (controller.isOptionSelected).toBe(false);
  }))

  it ("should add the ss_index attribute to all options on initialization", inject(function(){
    buildDirective();
    var options = controller.filteredOptions;

    for (var i=0; i<options.length; i++){
      expect (options[i].ss_index).toBeDefined();
    }
  }))

  it ("should have a null selected index when current option is null", inject(function(){
    $scope.currentOption = null;
    buildDirective();

    expect(controller.selectedIndex).toBe(null);
  }))

  it ("should set the selected index appropriately if an option is already selected", inject(function(){
    $scope.currentOption = { characterId: 2, name: 'Snake', weapon: 'Explosives' };
    buildDirective();

    expect (controller.selectedIndex).toBe(1);
  }))


  it ("should throw an exception if label keys string does not match an option key", inject(function(){
    $scope.labelKeys = 'potato';

    expect (function(){
      buildDirective();
    }).toThrowError('No option attribute matched with any key in labelKeys.');
  }))

  it ("should add the ss_display_name and ss_display_html attributes to all options on initialization", inject(function(){
    buildDirective();
    var options = controller.filteredOptions;

    for (var i=0; i<options.length; i++){
      expect (options[i].ss_display_name).toBeDefined();
      expect (options[i].ss_display_html).toBeDefined();
      //display name and html should be the same when initialized
      expect (options[i].ss_display_html).toBe(options[i].ss_display_name);
    }
  }))

  it ("should set the search string to an empty string if no option is already selected", inject(function(){
    $scope.currentOption = null;
    buildDirective();

    expect (controller.searchString).toBe('');
  }))

  it ("should set the search string to the options ss_display_name if an option is already selected", inject(function(){
    buildDirective();

    expect (controller.searchString).toBe(controller.ngModel.ss_display_name);
  }))

  //*
  //General Usage Tests
  //*

  it ("should correctly update directive variables when an option is selected", inject(function(){
    buildDirective();
    var selectedOption = controller.filteredOptions[2];
    controller.selectOption(selectedOption);

    expect (controller.ngModel).toBe(selectedOption);
    expect (controller.selectedIndex).toBe(selectedOption.ss_index);
    expect (controller.isOptionSelected).toBe(true);
    expect ($scope.currentOption).toBe(selectedOption);
    expect (controller.searchString).toBe(selectedOption.ss_display_name);
  }))

  it ("should immediately return on focus when disabled attribute is set to true", inject(function(){
    $scope.disabled = true;
    buildDirective();
    element.find('input').triggerHandler('focus');

    expect (controller.searching).toBe(false);
  }))

  it ("should reset search attributes and generate search results on focus", inject(function(){
    buildDirective();
    var preFocusFilteredOptions = controller.filteredOptions;
    element.find('input').triggerHandler('focus');

    expect (controller.searching).toBe(true);
    expect (controller.searchString).toBe('');
    expect (controller.filteredOptions).toBe(preFocusFilteredOptions);
  }))

  it ("should reset search string on blur", inject(function(){
    buildDirective();
    controller.searchString = "potato";
    controller.keyboardFocusIndex = 1;
    element.find('input').triggerHandler('blur');

    expect (controller.searchString).toBe(controller.ngModel.ss_display_name);
  }))

  it ("should filter list based on key input", inject(function(){
    $scope.currentOption = null;
    buildDirective();
    var expectedResult = [{
      characterId: 1,
      name: 'Link',
      weapon: 'Sword',
      ss_index: 0,
      ss_display_name: 'Link',
      ss_display_html: '<span class="search-bold">Li</span>nk'
    }];
    controller.searchString = 'li';
    controller.searchOptions()

    expect (controller.filteredOptions).toEqual(expectedResult);
  }))
});
