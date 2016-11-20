[![Bower version](https://badge.fury.io/bo/search-select.svg)](https://badge.fury.io/bo/search-select)
# SearchSelect v 1.3.0
Search Select is a simple Angular directive for turning pesky dropdowns into something much more user friendly. More specifically,
it adds a search bar right into the input, allowing your users to narrow down a dropdown list by typing in key words or letters.

### Options:
  * **ngModel** - An object variable for storing the selected option.
  * **options** - An array containing all of the selectable option objects.
  * **idKey** (default: 'id') - A string with the attribute to id the option objects by. Use an attribute
  that has unique values between options unless you want to have a bad time.
  * **labelKeys** - A string with the name of the attributes on the option object to be used as a display name. You can specify multiple keys (space-separate them) if you want them concatenated as one display name.
  * **placeholderText** - A string with the placeholder text for the search select input.
  * **fontAwesomeIcon** (optional) - A string with the class name of the font-awesome icon to be displayed on the right side of the search select input.
  * **ngChange** (optional) - An expression to be evaluated when the user selects an option.
  * **disabled** (optional) - A boolean expression which represents whether the searchselect is disabled or not.
  * **required** (optional) - A boolean expression which represents whether the searchselect is required or not (for form validity).

### Installation:
SearchSelect is available through Bower. Simply run the following command from your terminal:

```sh
$ bower install --save search-select
```

### Usage:
  * Some examples can be found [here.](https://museofmoose.github.io/SearchSelect/dist/)
  * You can scroll through the options with a mouse or via the arrow keys.
  * Select an option by clicking or hitting enter/ Close out of the dropdown by clicking away or hitting escape.
  * Narrow down the option list by typing into the input.

### Dependencies:
  * angular 1.3.0
  * angular-animate 1.3.0, if you want animation when you make your first selection.
  * angular-sanitize 1.3.0

---

## Feature Road Map
Done for now. Open to any requests or concerns.

