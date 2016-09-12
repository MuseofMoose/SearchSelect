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
        labelKeys: '@',
        placeholderText: '@',
        fontAwesomeIcon: '@',
      },
      controller: SearchSelectController,
      controllerAs: 'searchSelect',
      bindToController: true,
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

      var labelKeys = $scope.labelKeys.split(' ');
      var options = angular.copy($scope.options);

      // For older version of angular bindToController doesn't work
      //and we have to manually store the scope values as vm vars.
      vm.filteredOptions = {};
      vm.fontAwesomeIcon = $scope.fontAwesomeIcon;
      vm.placeholderText = $scope.placeholderText;
      vm.searching = false;
      vm.searchString = '';
      vm.selectedIndex = null;

      vm.isOptionSelected = isOptionSelected;
      vm.resetSearch = resetSearch;
      vm.searchOptions = searchOptions;
      vm.selectOption = selectOption;
      vm.setSearchStringToOptionName = setSearchStringToOptionName;

      //Watching the option list for pages that may not have
      //it as soon as the page loads.
      $scope.$watch(function(){
        return $scope.options;
      }, function(newVal, oldVal){
        options = angular.copy($scope.options);
        intializeSearchSelect();
      }, true);

      function intializeSearchSelect(){
        if (isUndefined($scope.ngModel)) { return; }

        for (var i=0; i<options.length; i++){
          setOptionIndex(i);
          checkIfSelected(i);
          setOptionDisplayName(i);
        }
        vm.filteredOptions = options;
        setSearchStringToOptionName();
      }

      function setOptionIndex(i){
        options[i].index = i;
      }

      //Sets selected index if an option is already selected.
      function checkIfSelected(i){
        if ($scope.ngModel === null) return;
        if ($scope.ngModel.id === options[i].id){
          $scope.ngModel = options[i];
          vm.selectedIndex = i;
        }
      }

      //Sets the display_name for an option based on the
      //keys specified in the labelKeys variable.
      function setOptionDisplayName(i){
        var option = options[i];
        var display_name = '';
        for (var j=0; j<labelKeys.length; j++){
          var key = labelKeys[j];
          if (!isUndefined(option[key])){
            display_name += (option[key] + ' ');
          }
        }
        if (display_name !== ''){
          //Remove the extra space at the end of the string.
          display_name = display_name.slice(0, -1);
        }
        options[i].display_name = display_name;
      }

      function selectOption(option){
        $scope.ngModel = option;
        vm.selectedIndex = option.index;
        $scope.triggerNgChange(option);
        setSearchStringToOptionName();
      }

      function setSearchStringToOptionName(){
        vm.searching = false;
        if (vm.selectedIndex === null){
          vm.searchString = "";
          return;
        }
        if (isUndefined(options[vm.selectedIndex])){
          return;
        }
        vm.searchString = options[vm.selectedIndex].display_name;
      }

      function searchOptions(){
        if (vm.searchString === '' || isUndefined(vm.searchString)){
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

      function resetSearch(){
        vm.searching = true;
        vm.searchString = '';
      }

      function isOptionSelected(){
        return (Object.keys($scope.ngModel).length !== 0 ? true : false);
      }

      function isUndefined(variable){
        return (typeof variable === 'undefined' ? true : false);
      }
    }
  }

})();
