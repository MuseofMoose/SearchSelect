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

---

## Feature Road Map

### In Progress:
  * Package as a module and make it available on Bower
  * Improve this ReadMe
    * Create fleshed out demo page
    * Convert "demo" page to full documentation gh-pages "site"

### On-Deck
  * Handle option IDing internally (less work for users)

### The Distant Future, The Year 2000:
  * Keyboard Tabbing/Arrow Key Support
  * More Custom Styling Options
  * A Couple Default Styling Options to Choose From
