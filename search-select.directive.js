(function() {
  'use strict';

  angular.module('searchSelectApp', []).directive('searchSelect', searchSelect);

  /** @ngInject */
  function searchSelect() {
    var directive = {
      require: "ngModel",
      restrict: 'EA',
      templateUrl: 'app/components/search-select/search-select.html',
      scope: {
        ngModel: '=',
        options: '=',
        optionLabelKeys: '@',
        placeholderText: '@',
        fontAwesomeIcon: '@',
      },
      controller: SearchSelectController,
      controllerAs: 'searchSelect',
      bindToController: true,
      link: function(scope, elt, attrs, ctrl){
        scope.triggerNgChange = function(value){
          ctrl.$setViewValue(value);
        }
      }
    };

    return directive;

    /** @ngInject */
    function SearchSelectController($scope) {
      var vm = this;

      var options = {};

      vm.filteredOptions = angular.copy(vm.options);
      vm.searching = false;
      vm.searchString = '';
      vm.selectedIndex = null;

      vm.initializeSearch = initializeSearch;
      vm.searchOptions = searchOptions;
      vm.selectOption = selectOption;
      vm.setSearchStringToOptionName = setSearchStringToOptionName;


      $scope.$watch(function(){
        return vm.options;
      }, function(newVal, oldVal){
        options = angular.copy(vm.options);
        initializeIndexes();
        getOptionDisplayNames();
      }, true);

      function initializeSearch(){
        vm.searching = true;
        vm.searchString = '';
      }

      function initializeIndexes(){
        if (typeof vm.ngModel === 'undefined'){ return; }
        for (var i=0; i<options.length; i++){
          options[i].index = i;
          if (vm.ngModel.id === options[i].id){
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
        vm.ngModel = option;
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
    }
  }

})();
