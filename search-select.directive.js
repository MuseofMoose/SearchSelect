(function() {
  'use strict';

  angular.module('engageAngularApp').directive('searchSelect', searchSelect);

  /** @ngInject */
  function searchSelect() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/search-select/search-select.html',
      scope: {
        ngModel: '=',
        options: '=',
        optionLabelKeys: '=',
        placeholderText: '=',
      },
      controller: SearchSelectController,
      controllerAs: 'searchSelect',
      bindToController: true,
    };

    return directive;

    /** @ngInject */
    function SearchSelectController($scope) {
      var vm = this;


      vm.filteredOptions = vm.options;
      vm.optionHashTable = {};
      vm.searching = false;
      vm.searchString = '';
      vm.selectedIndex = 0;

      vm.initializeSearch = initializeSearch;
      vm.searchOptions = searchOptions;
      vm.selectOption = selectOption;
      vm.setSearchStringToOptionName = setSearchStringToOptionName;


      $scope.$watch(function(){
        return vm.options;
      }, function(newVal, oldVal){
        getOptionDisplayNames();
        initializeSelectedIndex();
      }, true);

      function initializeSearch(){
        vm.searching = true;
        vm.searchString = '';
      }

      function initializeSelectedIndex(){
        for (var i=0; i<vm.options.length; i++){
          if (vm.ngModel.id === vm.options[i].id){
            vm.selectedIndex = i;
          }
        }
      }

      function getOptionDisplayNames(){
        for(var i=0; i<vm.options.length; i++){
          var option = vm.options[i];
          var display_name = '';
          for(var key in option){
            if (vm.optionLabelKeys.indexOf(key) !== -1){
              display_name += (option[key] + ' ');
            }
          }
          if (display_name !== ''){
            display_name = display_name.slice(0, -1);
          }
          vm.options[i].display_name = display_name;
        }

        initializeFilteredOptions();
      }

      function initializeFilteredOptions(){
        vm.filteredOptions = vm.options;
        for (var i=0; i<vm.filteredOptions.length; i++){
          vm.filteredOptions[i].index = i;
        }

        setSearchStringToOptionName();
      }

      function setSearchStringToOptionName(){
        vm.searching = false;
        if (typeof vm.filteredOptions[vm.selectedIndex] === 'undefined'){
          return;
        }
        vm.searchString = vm.filteredOptions[vm.selectedIndex].display_name;
      }

      function selectOption(option){
        vm.ngModel = option;
        vm.selectedIndex = option.index;
        setSearchStringToOptionName();
      }

      function searchOptions(){
        if (vm.searchString === '' || typeof vm.searchString === 'undefined'){
          vm.filteredOptions = vm.options;
          return;
        }

        var result = [];
        var indexCounter = 0;
        var searchString = vm.searchString.toLowerCase();

        for (var i=0; i<vm.options.length; i++){
          var name = vm.options[i].display_name;
          if (name.toLowerCase().indexOf(searchString) !== -1){
            var option = angular.copy(vm.options[i]);
            option.index = indexCounter;
            result.push(option);
            indexCounter++;
          }
        }
        vm.filteredOptions = result;
      }
    }
  }

})();
