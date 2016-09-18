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
        idKey: '@',
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

      var labelKeys = vm.labelKeys.split(' ');
      var options = angular.copy(vm.options);

      vm.filteredOptions = {};
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
        return vm.options;
      }, function(newVal, oldVal){
        options = angular.copy(vm.options);
        intializeSearchSelect();
      }, true);

      function intializeSearchSelect(){
        if (isUndefined(vm.ngModel)) { return; }

        validateParams();
        setParamDefaults();
        for (var i=0; i<options.length; i++){
          setOptionIndex(i);
          checkIfSelected(i);
          setOptionDisplayName(i);
        }
        vm.filteredOptions = options;
        setSearchStringToOptionName();
      }

      function validateParams(){
        if (!isUndefined(vm.idKey) && !vm.options[0].hasOwnProperty(vm.idKey)){
          throw 'Error: No option attribute matched with specified idKey.';
        }
      }

      function setParamDefaults(){
        if (isUndefined(vm.idKey)) { vm.idKey = 'id'; }
      }

      function setOptionIndex(i){
        options[i].index = i;
      }

      //Sets selected index if an option is already selected.
      function checkIfSelected(i){
        if (vm.ngModel === null) { return; }
        if (vm.ngModel[vm.idKey] === options[i][vm.idKey]){
          vm.ngModel = options[i];
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
        if (display_name === ''){
          throw 'Error: No option attribute matched with any key in labelKeys.';
        }
        display_name = display_name.slice(0, -1);
        options[i].display_name = display_name;
      }

      function selectOption(option){
        vm.ngModel = option;
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
        return (Object.keys(vm.ngModel).length !== 0 ? true : false);
      }

      function isUndefined(variable){
        return (typeof variable === 'undefined' ? true : false);
      }
    }
  }

})();
