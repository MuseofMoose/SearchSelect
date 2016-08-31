# SearchSelect
Search Select is a simple Angular directive for turning pesky dropdowns into something much more user friendly. More specifically,
it adds a search bar right into the input, allowing your users to narrow down a dropdown list by typing in key words or letters.

**Note:** This is still very much a work in progress. It's lacking a good deal of flexibility as it was originally built
to solve a problem for a personal project. I'm working on gradually improving it to the point where it can be easily implemented
and customized by anyone.

### Options:
  * ngModel - an object variable for storing the selected option
  * options - an array containing all of the selectable option objects
  * optionLabelKeys - a string with the name of the key on the option object to be used a display name
  * placeholderText - a string with the placeholder text for the select
  * fontAwesomeIcon (optional) - a string with the class name of the font-awesome icon to be displayed on the right side of the input portion of the select
  * ngChange (optional) - an expression to be evaluated when the user selects an option

### Basic Usage (Work in Progress):
  * Pass in your array of option objects via the "options" param.
  * Pass in a string with the name of the attribute of each option that you want to use as the display name.
  * Think of the ngModal param as the container for storing the "output" of the directive. Whatever the user selects will end up there and be usable in whatever scope you declared the container.

### Planned Improvements:
  * Improve this ReadMe
  * Package as a module and make it available on Bower
  * Keyboard Tabbing/Arrow Key Support
  * More Custom Styling Options
  * A Couple Default Styling Options to Choose From
  * Expand to Other Frameworks
  * Specify Id Key?
