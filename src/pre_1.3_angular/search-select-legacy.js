//This version of the js does not use the bindToController feature which was added in
//Angular 1.3. Thus, it is compatible with Angular 1.2 (and potentially older). Simply add
//an override to your bower file for search-select and specify this file in the "main" attribute

(function() {
  'use strict';

  angular.module('searchSelect', []).directive('searchSelect', searchSelect);

  /** @ngInject */
  function searchSelect() {
    var directive = {
      require: "ngModel",
      restrict: 'EA',
      templateUrl: 'search-select.html',
      scope: {
        ngModel: '=',
        options: '=',
        optionLabelKeys: '@',
        placeholderText: '@',
        fontAwesomeIcon: '@',
      },
      controller: SearchSelectController,
      controllerAs: 'searchSelect',
      link: function(scope, elt, attrs, ctrl){
        scope.triggerNgChange = function(value){
          ctrl.$setViewValue(value);
        };
      }
    };

    return directive;

    /** @ngInject */
    function SearchSelectController($scope) {
      var vm = this;

      var options = {};


      // For older version of angular bindToController doesn't work
      //and we have to manually store the scope values as vm vars.
      vm.filteredOptions = angular.copy($scope.options);
      vm.fontAwesomeIcon = $scope.fontAwesomeIcon;
      vm.optionLabelKeys = $scope.optionLabelKeys;
      vm.placeholderText = $scope.placeholderText;
      vm.searching = false;
      vm.searchString = '';
      vm.selectedIndex = null;

      vm.initializeSearch = initializeSearch;
      vm.isOptionSelected = isOptionSelected;
      vm.searchOptions = searchOptions;
      vm.selectOption = selectOption;
      vm.setSearchStringToOptionName = setSearchStringToOptionName;


      $scope.$watch(function(){
        return $scope.options;
      }, function(newVal, oldVal){
        options = angular.copy($scope.options);
        initializeIndexes();
        getOptionDisplayNames();
      }, true);

      function initializeSearch(){
        vm.searching = true;
        vm.searchString = '';
      }

      function initializeIndexes(){
        if (typeof $scope.ngModel === 'undefined'){ return; }
        for (var i=0; i<options.length; i++){
          options[i].index = i;
          if ($scope.ngModel.id === options[i].id){
            vm.selectedIndex = i;
          }
        }
      }

      function getOptionDisplayNames(){
        //need to make optionlabelkey search a little safer
        //if object has name and full_name attributes and you specify full_name
        //in optionLabelKey, both will be added

        for(var i=0; i<options.length; i++){
          var option = options[i];
          var display_name = '';
          for(var key in option){
            if (vm.optionLabelKeys.indexOf(key) !== -1){
              display_name += (option[key] + ' ');
            }
          }
          if (display_name !== ''){
            display_name = display_name.slice(0, -1);
          }
          options[i].display_name = display_name;
        }

        initializeFilteredOptions();
      }

      function initializeFilteredOptions(){
        vm.filteredOptions = options;
        for (var i=0; i<vm.filteredOptions.length; i++){
          vm.filteredOptions[i].index = i;
        }

        setSearchStringToOptionName();
      }

      function setSearchStringToOptionName(){
        vm.searching = false;
        if (vm.selectedIndex === null){
          vm.searchString = "";
          return;
        }
        if (typeof options[vm.selectedIndex] === 'undefined'){
          return;
        }
        vm.searchString = options[vm.selectedIndex].display_name;
      }

      function selectOption(option){
        $scope.ngModel = option;
        vm.selectedIndex = option.index;
        $scope.triggerNgChange(option);
        setSearchStringToOptionName();
      }

      function searchOptions(){
        if (vm.searchString === '' || typeof vm.searchString === 'undefined'){
          vm.filteredOptions = options;
          return;
        }

        var result = [];
        var searchString = vm.searchString.toLowerCase();

        for (var i=0; i<options.length; i++){
          var name = options[i].display_name;
          if (name.toLowerCase().indexOf(searchString) !== -1){
            var option = angular.copy(options[i]);
            result.push(option);
          }
        }
        vm.filteredOptions = result;
      }

      function isOptionSelected(){
        return (Object.keys($scope.ngModel).length !== 0 ? true : false);
      }
    }
  }

})();
