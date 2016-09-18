# SearchSelect
Search Select is a simple Angular directive for turning pesky dropdowns into something much more user friendly. More specifically,
it adds a search bar right into the input, allowing your users to narrow down a dropdown list by typing in key words or letters.

### Options:
  * **ngModel** - An object variable for storing the selected option.
  * **options** - An array containing all of the selectable option objects.
  * **idKey** (default: 'id') - A string with the attribute to id the option objects by. Use an attribute
  that has unique values between options unless you want to have a bad time.
  * **labelKeys** - A string with the name of the attributes on the option object to be used as a display name. You can specify multiple keys (space-separate them) if you want them concatenated as one display name.
  * **placeholderText** - A string with the placeholder text for the select.
  * **fontAwesomeIcon** (optional) - A string with the class name of the font-awesome icon to be displayed on the right side of the input portion of the select.
  * **ngChange** (optional) - An expression to be evaluated when the user selects an option.

### Installation:
SearchSelect is available through Bower. Simply run the following command from your terminal:

```sh
$ bower install --save search-select
```

### Usage:
  * Some simple examples can be found [here.](https://museofmoose.github.io/SearchSelect/dist/)

### Dependencies:
  * ngAnimate, if you want animation when you make your first selection (assuming it starts out empty)

---

## Feature Road Map

### In Progress:
  * Better compatibility with tablets and phones (input being hidden by keyboard, need to snap input to top of screen)

### On-Deck:
  * Improve this ReadMe
    * Create fleshed out demo page
    * Convert "demo" page to full documentation gh-pages "site"

### The Distant Future, The Year 2000:
  * Keyboard Tabbing/Arrow Key Support
  * More Custom Styling Options
  * A Couple Default Styling Options to Choose From

### Completed:
  * Improve optionLabelKeys parsing.
  * Pull the plug on Legacy Support
  * Instead of requiring an "id" attribute on options, allow specification of a custom attribute to ID by.
  * Change names of index and display_name attributes so they are less likely to conflict with passed in objects.

