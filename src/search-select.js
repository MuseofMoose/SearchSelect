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

      var inputHandler = new KeyInputHandler();
      var labelKeys = vm.labelKeys.split(' ');
      var options = angular.copy(vm.options);
      var readyForKeyInput = true;

      vm.filteredOptions = {};
      vm.keyboardFocusIndex = null;
      vm.searching = false;
      vm.searchString = '';
      vm.selectedIndex = null;

      vm.ssBlur = ssBlur;
      vm.ssFocus = ssFocus;
      vm.isOptionSelected = isOptionSelected;
      vm.searchOptions = searchOptions;
      vm.selectOption = selectOption;

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
        options[i].ss_index = i;
      }

      //Sets selected index if an option is already selected.
      function checkIfSelected(i){
        if (vm.ngModel === null) { return; }
        if (vm.ngModel[vm.idKey] === options[i][vm.idKey]){
          vm.ngModel = options[i];
          vm.selectedIndex = i;
        }
      }

      //Sets the ss_display_name for an option based on the
      //keys specified in the labelKeys variable.
      function setOptionDisplayName(i){
        var option = options[i];
        var ss_display_name = '';
        for (var j=0; j<labelKeys.length; j++){
          var key = labelKeys[j];
          if (!isUndefined(option[key])){
            ss_display_name += (option[key] + ' ');
          }
        }
        if (ss_display_name === ''){
          throw 'Error: No option attribute matched with any key in labelKeys.';
        }
        ss_display_name = ss_display_name.slice(0, -1);
        options[i].ss_display_name = ss_display_name;
      }

      function selectOption(option){
        vm.ngModel = option;
        vm.selectedIndex = option.ss_index;
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
        vm.searchString = options[vm.selectedIndex].ss_display_name;
      }

      //Enables arrow key detection and resets search.
      function ssFocus(){
        angular.element(document).on('keydown', inputHandler.run);
        angular.element(document).on('keyup', refreshKeyInput);
        resetSearch();
        searchOptions();
      }

      //Disables arrow key detection and sets the displayed input string.
      function ssBlur(){
        vm.keyboardFocusIndex = null;
        angular.element(document).off('keydown', inputHandler.run);
        angular.element(document).off('keyup', refreshKeyInput);
        setSearchStringToOptionName();
      }

      function searchOptions(){
        if (vm.searchString === '' || isUndefined(vm.searchString)){
          vm.filteredOptions = options;
          return;
        }

        var result = [];
        var searchString = vm.searchString.toLowerCase();

        for (var i=0; i<options.length; i++){
          var name = options[i].ss_display_name;
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

      //An object for handling key inputs while focused on search-select.
      function KeyInputHandler(){

        this.run = function(e){
          if (readyForKeyInput === false){
            return;
          }
          var key = e.keyCode ? e.keyCode : e.which;
          readyForKeyInput = false;

          if (key === 38) { up(); }
          if (key === 40) { down(); }
          if (key === 13) { enter(e); }
          if (key === 27) { escape(e); }

          $scope.$apply();
        };

        //Move to previous option on up key press.
        function up(){
          if (vm.keyboardFocusIndex === 0 || vm.keyboardFocusIndex === null){
            return;
          }
          vm.keyboardFocusIndex -= 1;
          adjustScroll(false);
        }

        //Move to next option on down key press.
        function down(){
          if (vm.keyboardFocusIndex === null){
            vm.keyboardFocusIndex = 0;
            adjustScroll(true);
            $scope.$apply();
            return;
          }
          if (vm.keyboardFocusIndex >= vm.filteredOptions.length - 1){
            return;
          }
          vm.keyboardFocusIndex += 1;
          adjustScroll(true);
        }

        //Close out search and select option on enter key press.
        function enter(e){
          if (vm.keyboardFocusIndex === null){
            return;
          }
          selectOption(vm.filteredOptions[vm.keyboardFocusIndex]);
          e.target.blur();
          readyForKeyInput = true;
        }

        //Close out search on escape key press.
        function escape(e){
          e.target.blur();
          readyForKeyInput = true;
        }

        //Adjusts the scroll value of the list based on which listItem is currently focused.
        function adjustScroll(isDownKey){
          var listId = 'option-list';
          var listItemId = 'option-list-item-' + vm.keyboardFocusIndex;

          //Gets the "next" list item based on whether the down key or up key was pressed.
          var nextListItemDirection = isDownKey ? 1 : -1;
          var nextListItemId = 'option-list-item-' + (vm.keyboardFocusIndex + nextListItemDirection);

          var list = document.getElementById(listId);
          var listItem = document.getElementById(listItemId);
          var nextListItem = document.getElementById(nextListItemId) || listItem;

          //Adjusts scroll value when the nextListItem is ~below~ the viewable window.
          if (nextListItem.offsetTop >= (list.offsetHeight + list.scrollTop)){
            list.scrollTop = nextListItem.offsetTop - list.offsetHeight + nextListItem.offsetHeight;
          }

          //Adjusts scroll value when the nextListItem is ~above~ the viewable window.
          if (list.scrollTop > nextListItem.offsetTop){
            list.scrollTop = nextListItem.offsetTop;
          }
        }
      }

      function refreshKeyInput(e){
        readyForKeyInput = true;
      }
    }
  }

})();
