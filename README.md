## This repo is for projects using pre-1.3 versions of Angular

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

### Usage:
  * Some simple examples can be found [here.](https://museofmoose.github.io/SearchSelectLegacy/dist/)

### Dependencies:
  * ngAnimate, if you want animation when you make your first selection (assuming it starts out empty)


---


### In Progress:
  * Package as a module and make it available on Bower
  * Add seperate repo for angular versions that don't include "bindToController"

### The Future:
  * Improve this ReadMe
  * Keyboard Tabbing/Arrow Key Support
  * More Custom Styling Options
  * A Couple Default Styling Options to Choose From
  * Expand to Other Frameworks
  * Specify Id Key?
