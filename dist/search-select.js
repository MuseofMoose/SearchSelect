/*!
 * search-select
 * 
 * Version: 1.3.0 - 2016-12-10T03:46:20.944Z
 * License: MIT
 */


(function() {
  'use strict';

  angular.module('searchSelect', ['ngSanitize']).directive('searchSelect', searchSelect);

  /** @ngInject */
  function searchSelect() {
    var directive = {
      require: "ngModel",
      restrict: 'EA',
      templateUrl: 'search-select.html',
      scope: {
        ngModel: '=',
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
        //consider a stronger set of vm.ngModel validations
        if (isUndefined(vm.ngModel)) {
          throw new Error('ngModel variable for storing selected option is undefined.');
        }
        if (!isUndefinedOrEmptyString(vm.idKey) && !vm.options[0].hasOwnProperty(vm.idKey)){
          throw new Error('No option attribute matched with specified idKey.');
        }
      }

      function setParamDefaults(){
        if (isUndefinedOrEmptyString(vm.idKey)) { vm.idKey = 'id'; }
      }

      function setIsOptionSelectedBoolean(){
        if (vm.ngModel !== null && Object.keys(vm.ngModel).length !== 0){
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
          throw new Error('No option attribute matched with any key in labelKeys.');
        }
        ss_display_name = ss_display_name.slice(0, -1);
        options[i].ss_display_name = ss_display_name;
        options[i].ss_display_html = $sanitize(ss_display_name);
      }

      function selectOption(option){
        vm.ngModel = option;
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

angular.module("searchSelect").run(["$templateCache", function($templateCache) {$templateCache.put("search-select.html","<div class=\"search-select-container\" ng-class=\"{\'disabled\': searchSelect.disabled}\"><div class=\"ss-input-container\" ng-class=\"{\'container-expanded\': searchSelect.isOptionSelected}\"><div class=\"cover-base\" ng-class=\"{\'cover-expanded\': searchSelect.isOptionSelected}\">{{searchSelect.placeholderText}}</div><input name=\"search_string\" type=\"text\" class=\"input-base\" placeholder=\"{{searchSelect.placeholderText}}\" autocomplete=\"off\" ng-class=\"{\'input-expanded\': searchSelect.isOptionSelected}\" ng-model=\"searchSelect.searchString\" ng-focus=\"searchSelect.ssFocus()\" ng-keyup=\"searchSelect.searchOptions($event.keyCode)\" ng-blur=\"searchSelect.ssBlur()\" ng-disabled=\"searchSelect.disabled\" ng-required=\"searchSelect.required\"> <i class=\"icon-base fa\" ng-class=\"{\'icon-expanded\': searchSelect.isOptionSelected, \'{{searchSelect.fontAwesomeIcon}}\': true}\"></i></div><div class=\"results-container\" ng-show=\"searchSelect.searching\"><ul id=\"option-list\" class=\"option-list\" ng-show=\"searchSelect.filteredOptions.length > 0\"><li id=\"option-list-item-{{$index}}\" class=\"option-list-item\" ng-class=\"{\'kb-focused\': searchSelect.keyboardFocusIndex === $index}\" ng-repeat=\"option in searchSelect.filteredOptions track by $index\" ng-mousedown=\"searchSelect.selectOption(option)\" ng-bind-html=\"option.ss_display_html\"></li></ul></div></div>");
$templateCache.put("demo_files/index.html","<!doctype html><html ng-app=\"demo\"><head><meta charset=\"utf-8\"><title>AngularJS1 Search Select demo</title><link rel=\"stylesheet\" href=\"https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.css\"><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css\"><link rel=\"stylesheet\" href=\"search-select.css\"><link rel=\"stylesheet\" href=\"demo.css\"></head><body><div class=\"container\" ng-controller=\"MainController as main\"><h1 class=\"text-muted\">Demo</h1><div class=\"instructions usage row\"><h3>Instructions:</h3><p class=\"title\">* Mouse Controls</p><p>Move with the mouse, click an option to select, click away from the dropdown to close.</p><p class=\"title\">* Keyboard Controls</p><p>Up/Down to move, Enter to select, Escape to close.</p><p class=\"title\">* Searching</p><p>Type into the input to narrow down the option list.</p></div><div class=\"usage row\"><h3>Basic example:</h3><pre>\n  &lt;search-select\n    ng-model=\"main.currentFruitOption\"\n    options=\"main.fruitOptions\"\n    label-keys=\"name\"\n    placeholder-text=\"Select Fruit\"\n    font-awesome-icon=\"fa-lemon-o\"&gt;\n  &lt;/search-select&gt;\n</pre><h3>Results in:</h3><search-select ng-model=\"main.currentFruitOption\" options=\"main.fruitOptions\" label-keys=\"name\" placeholder-text=\"Select Fruit\" font-awesome-icon=\"fa-lemon-o\"></search-select><h4>Selected Option: {{main.cleanOption(main.currentFruitOption)}}</h4></div><div class=\"usage row\"><h3>Multiple label-keys and Disabling:</h3><h5>Controller:</h5><pre>\n  vm.disabled = false;\n</pre><h5>HTML:</h5><pre>\n  &lt;button ng-click=\"main.disabled = !main.disabled\"&gt;\n    Toggle Disable Value\n  &lt;/button&gt;\n\n  &lt;search-select\n    ng-model=\"main.currentUserOption\"\n    options=\"main.userOptions\"\n    label-keys=\"first_name last_name\"\n    placeholder-text=\"Select User\"\n    font-awesome-icon=\"fa-user\"\n    disabled=\"main.disabled\"&gt;\n  &lt;/search-select&gt;\n</pre><h3>Results in:</h3><button ng-click=\"main.disabled = !main.disabled\">Toggle Disable Value</button><search-select ng-model=\"main.currentUserOption\" options=\"main.userOptions\" label-keys=\"first_name last_name\" placeholder-text=\"Select User\" font-awesome-icon=\"fa-user\" disabled=\"main.disabled\"></search-select><h4>Selected Option: {{main.cleanOption(main.currentUserOption)}}</h4><h4>Disabled: {{main.disabled}}</h4></div><div class=\"usage row\"><h3>Pre-selected option and Custom idKey:</h3><h5>Controller:</h5><pre>\n  vm.currentVideoGameCharacterOption = { characterId: 6, name: \'Sonic\', weapon: \'Speed\' }\n</pre><h5>HTML:</h5><pre>\n  &lt;search-select\n    ng-model=\"main.currentVideoGameCharacterOption\"\n    options=\"main.videoGameCharacterOptions\"\n    id-key=\"characterId\"\n    label-keys=\"name\"\n    placeholder-text=\"Select Character\"\n    font-awesome-icon=\"fa-user\"&gt;\n  &lt;/search-select&gt;\n</pre><h3>Results in:</h3><search-select ng-model=\"main.currentVideoGameCharacterOption\" options=\"main.videoGameCharacterOptions\" id-key=\"characterId\" label-keys=\"name\" placeholder-text=\"Select Character\" font-awesome-icon=\"fa-user\"></search-select><h4>Selected Option: {{main.cleanOption(main.currentVideoGameCharacterOption)}}</h4></div><div class=\"bottom-spacer\"></div></div><script src=\"bower_components/angular/angular.js\"></script><script src=\"bower_components/angular-animate/angular-animate.js\"></script><script src=\"bower_components/angular-sanitize/angular-sanitize.js\"></script><script src=\"search-select.js\"></script><script src=\"demo.js\"></script></body></html>");}]);