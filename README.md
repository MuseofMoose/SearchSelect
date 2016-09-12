# SearchSelect
Search Select is a simple Angular directive for turning pesky dropdowns into something much more user friendly. More specifically,
it adds a search bar right into the input, allowing your users to narrow down a dropdown list by typing in key words or letters.

### Options:
  * ngModel - an object variable for storing the selected option
  * options - an array containing all of the selectable option objects
  * optionLabelKeys - a string with the name of the key on the option object to be used a display name
  * placeholderText - a string with the placeholder text for the select
  * fontAwesomeIcon (optional) - a string with the class name of the font-awesome icon to be displayed on the right side of the input portion of the select
  * ngChange (optional) - an expression to be evaluated when the user selects an option

### Installation:
SearchSelect is available through Bower. Simply run the following command from your terminal:

```sh
$ bower install --save search-select
```

### Usage:
  * Some simple examples can be found [here.](https://museofmoose.github.io/SearchSelect/dist/)

### Dependencies:
  * ngAnimate, if you want animation when you make your first selection (assuming it starts out empty)

### Angular 1.2 Support
An Angular 1.2 compatible version of the js can be found at dist/search-select-legacy.js. In order to use it, simply add an override to your bower.json file like so:

```
"overrides": {
  "search-select": {
    "main": [
      "dist/search-select-legacy.js",
      "dist/search-select.css"
    ],
  },
}
```

Note that you may also need to update the "resolutions" section of your bower file as the search-select module specifies a need for angular/angular-animate 1.3 or higher. To do so, add something like this to your bower.json file (replace the versions to match your project's):

```
"resolutions": {
    "angular": "~1.2.0",
    "angular-animate": "~1.2.0"
  },
```

---

## Feature Road Map

### In Progress:
  * Handle option IDing internally (less work for users)

### On-Deck
  * Improve this ReadMe
    * Create fleshed out demo page
    * Convert "demo" page to full documentation gh-pages "site"
  * Allow specification of attribute to search by.


### The Distant Future, The Year 2000:
  * Keyboard Tabbing/Arrow Key Support
  * More Custom Styling Options
  * A Couple Default Styling Options to Choose From
