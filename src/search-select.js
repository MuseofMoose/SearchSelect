(function() {
  'use strict';

  angular.module('searchSelect', ['ngSanitize']).directive('searchSelect', searchSelect);

  /** @ngInject */
  function searchSelect() {
    var directive = {
      require: 'ngModel',
      restrict: 'EA',
      templateUrl: 'search-select.html',
      scope: {
        selectedOption: '=ngModel',
        options: '=',
        disabled: '=?',
        required: '=?',
        idKey: '@',
        labelKeys: '@',
        placeholderText: '@',
        fontAwesomeIcon: '@'
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
    function SearchSelectController($scope, $sanitize, $element) {
      var vm = this;

      var inputHandler = new KeyInputHandler();
      var labelKeys = vm.labelKeys.split(' ');
      var options = angular.copy(vm.options);
      var readyForKeyInput = true;

      vm.filteredOptions = {};
      vm.isOptionSelected = false;
      vm.keyboardFocusIndex = null;
      vm.searching = false;
      vm.searchString = '';
      vm.selectedIndex = null;

      vm.searchOptions = searchOptions;
      vm.selectOption = selectOption;
      vm.ssBlur = ssBlur;
      vm.ssFocus = ssFocus;

      //Watching the option list for pages that may not
      //have it as soon as the page loads.
      $scope.$watch(function(){
        return vm.options;
      }, function(newVal, oldVal){
        options = angular.copy(vm.options);
        intializeSearchSelect();
      }, true);

      function intializeSearchSelect(){
        validateParams();
        setParamDefaults();
        setIsOptionSelectedBoolean();
        for (var i=0; i<options.length; i++){
          setOptionIndex(i);
          checkIfSelected(i);
          setOptionDisplayName(i);
        }
        vm.filteredOptions = options;
        setSearchStringToOptionName();
      }

      function validateParams(){
        //consider a stronger set of vm.selectedOption validations
        if (isUndefined(vm.selectedOption)) {
          throw new Error('selectedOption variable for storing selected option is undefined.');
        }
        if (!isUndefinedOrEmptyString(vm.idKey) && !vm.options[0].hasOwnProperty(vm.idKey)){
          throw new Error('No option attribute matched with specified idKey.');
        }
      }

      function setParamDefaults(){
        if (isUndefinedOrEmptyString(vm.idKey)) { vm.idKey = 'id'; }
      }

      function setIsOptionSelectedBoolean(){
        if (vm.selectedOption !== null && Object.keys(vm.selectedOption).length !== 0){
          vm.isOptionSelected = true;
          return;
        }
        vm.isOptionSelected = false;
      }

      function setOptionIndex(i){
        options[i].ss_index = i;
      }

      //Sets selected index if an option is already selected.
      function checkIfSelected(i){
        if (!vm.isOptionSelected) { return; }
        if (vm.selectedOption[vm.idKey] === options[i][vm.idKey]){
          vm.selectedOption = options[i];
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
          throw new Error('No option attribute matched with any key in labelKeys.');
        }
        ss_display_name = ss_display_name.slice(0, -1);
        options[i].ss_display_name = ss_display_name;
        options[i].ss_display_html = $sanitize(ss_display_name);
      }

      function selectOption(option){
        vm.selectedOption = option;
        vm.selectedIndex = option.ss_index;
        vm.isOptionSelected = true;
        $scope.triggerNgChange(option);
        setSearchStringToOptionName();
      }

      function setSearchStringToOptionName(){
        vm.searching = false;
        if (vm.selectedIndex === null){
          vm.searchString = "";
          return;
        }
        vm.searchString = options[vm.selectedIndex].ss_display_name;
      }

      //Enables arrow key detection and resets search.
      function ssFocus(){
        if (vm.disabled) { return; }
        $element.on('keydown', inputHandler.run);
        $element.on('keyup', refreshKeyInput);

        resetSearch();
        searchOptions();
      }

      function resetSearch(){
        vm.searching = true;
        vm.searchString = '';
      }

      //Disables arrow key detection and sets the displayed input string.
      function ssBlur(){
        $element.off('keydown', inputHandler.run);
        $element.off('keyup', refreshKeyInput);
        setSearchStringToOptionName();
      }

      //Main search function.
      function searchOptions(keyCode){
        if (isInputHandlerKeyCode(keyCode)){
          return;
        }
        vm.keyboardFocusIndex = 0;
        if (vm.searchString === '' || isUndefined(vm.searchString)){
          vm.filteredOptions = options;
          return;
        }

        var result = [];
        var searchString = vm.searchString.toLowerCase();

        for (var i=0; i<options.length; i++){
          var name = options[i].ss_display_name;
          var searchIndex = name.toLowerCase().indexOf(searchString);
          if (searchIndex !== -1){
            var option = angular.copy(options[i]);
            //Splitting option display name in order to style the matched substring.
            var substringOne = option.ss_display_name.substring(0, searchIndex);
            var substringTwo = option.ss_display_name.substring(searchIndex, searchIndex + searchString.length);
            var substringThree = option.ss_display_name.substring(searchIndex + searchString.length);
            option.ss_display_html = buildDisplayHtml(substringOne, substringTwo, substringThree);

            result.push(option);
          }
        }
        vm.filteredOptions = result;
      }

      //An object for handling key inputs while focused on search-select.
      function KeyInputHandler(){
        this.run = function(e){
          if (readyForKeyInput === false){
            return;
          }
          var key = e.keyCode ? e.keyCode : e.which;
          readyForKeyInput = false;

          if (key === 38) { up(e); }
          else if (key === 40) { down(e); }
          else if (key === 13) { enter(e); }
          else if (key === 27) { escape(e); }
          else { return; }

          $scope.$apply();
        };

        //Move to previous option on up key press.
        function up(e){
          e.preventDefault();
          if (vm.keyboardFocusIndex === 0 || vm.keyboardFocusIndex === null){
            return;
          }
          vm.keyboardFocusIndex -= 1;
          adjustScroll(false);
        }

        //Move to next option on down key press.
        function down(e){
          e.preventDefault();
          if (vm.keyboardFocusIndex >= vm.filteredOptions.length - 1){
            return;
          }
          vm.keyboardFocusIndex += 1;
          adjustScroll(true);
        }

        //Close out search and select option on enter key press.
        function enter(e){
          e.preventDefault();
          if (vm.keyboardFocusIndex === null){
            return;
          }
          selectOption(vm.filteredOptions[vm.keyboardFocusIndex]);
          e.target.blur();
          readyForKeyInput = true;
        }

        //Close out search on escape key press.
        function escape(e){
          e.preventDefault();
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

      //Takes the divided display name, wraps the matched substring in a bold-styled span,
      //and creates the displayHtml.
      function buildDisplayHtml(substringOne, substringTwo, substringThree){
        var displayHtml = '';
        var boldSubstring = '<span class="search-bold">' + substringTwo + '</span>';

        return $sanitize(substringOne + boldSubstring + substringThree);
      }

      function refreshKeyInput(e){
        readyForKeyInput = true;
      }

      function isUndefined(variable){
        return (typeof variable === 'undefined') ? true : false;
      }

      function isUndefinedOrEmptyString(variable){
        return (isUndefined(variable) || variable.trim() === '') ? true : false;
      }

      function isInputHandlerKeyCode(keyCode){
        if (keyCode === 38 || keyCode === 40 || keyCode === 13 || keyCode === 27){
          return true;
        }
        return false;
      }
    }
  }

})();
