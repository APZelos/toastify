# Toastify
A lightweight and easy to customize notification library.

## Table of Contents
1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Types and Colors](#types-and-colors)
4. [Customization](#customization)
    * [Options](#options)
    * [Toast Defaults](#toast-defaults)
    * [Toast Types](#toast-types)
    * [Animation Libraries](#animation-libraries)
5. [Toastifying](#toastifying)
6. [TODO](#todo)
7. [License](#license)

## Installation
Download [toastify.zip](https://github.com/APZelos/toastify/blob/master/dist/toastify.zip?raw=true), extract and include the js and CSS files to your project.

Add a reference to the toastify.min.css and toastify.min.js files to your HTML page.

```html
<link rel="stylesheet" href=".../toastify.min.css">
<script src=".../toastify.min.js"></script>
```

## Getting Started
Initialize the Toastify library.

```js
var toastify = Toastify();
```

Display your first notification with toastify.

```js
toastify('success', 'Hooray!');
```

## Types and Colors
Predefined types that are included:
`error`, `warning`, `success`, `message`, `sticky`

Predefined background colors that are included:
`red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`, `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`, `yellow`, `amber`, `orange`, `deep-orange`, `brown`, `grey`, `blue-grey`

## Customization
### Options
The Toastify() method accepts an options object that configs the library.

Example:
```js
var toastify = Toastify({
    root: '.my-toastify-holder',
    max: 9000,
    position: {
        horizontal: 'right',
        vertical: 'top'
    }
    defaults: {},
    types: {}
});
```

| Option | Description | Type | Default |
|---|---|---|---|
| root | The root element that holds the toastify. | `string` | `body` |
| max | The maximum number of toasts that can be on screen at the same time. (0 for unlimited) | `number` | `0` |
| position | The position of the toastify relative to the root element. | `object` | { horizontal: `'right'`, vertical: `'top'` } |
| defaults | The default settings for every toast type. | `object` | See [Toast Defaults](#toast-defaults) |
| types | Custom toast types and the custom settings for the predefined toast types. | `object` | See [Toast Types](#toast-types) |

### Toast Defaults
The default values for creating toast types. For every toast type that is created, custom or predefined, the values that are not provided by the user will be filled with the corresponding default value. 

Example:
```js
var toastify = Toastify({
    defaults: {
        color: 'teal',
        duration: 3000,
        sticky: false,
        closeOnClick: false,
        animations: {
            show: 'show-toast',
            hide: 'hide-toast'
        }
    }
});
```

| Option | Description | Type | Default |
|---|---|---|---|
| color | The background color of the toast. Color can be given as class name, HEX, RGB, RGBA, HSL or HSLA. | `string` | `teal` |
| duration | The duration in milliseconds that the toast will be displayed on the screen. | `number` | `3000` |
| sticky | If set to true the toast will not be removed from screen until the user clicks on it. | `boolean` | `false` |
| closeOnClick | If set to true the toast will be removed if the user clicks on it, even if its duration hasn't ended. | `boolean` | `false` |
| animations | The names of the classes that contain the hide and show animation. | `object` | { show: `'show-toast'`, hide: `''hide-toast'` } |

### Toast Types
Customization for the predefined types and creation of new custom types. If the name of the type already exists the type will be modified, otherwise a new type will be created and every option that's not included will be filled with the default value. See the table at [Toast Defaults](#toast-defaults) for the available options.

Example:
```js
var toastify = Toastify({
    types: {
        error: {
            sticky: true
        },
        theBestToastEver: {
            color: '',
            animations: {
                show: 'ultra-jumpy'
            }
        }
    }
});
```

### Animation Libraries
You can easily use external CSS animation libraries, such as [Animate.css](https://daneden.github.io/animate.css/), for the show and hide animation of a toast, just set the animation with the name of the class as provided by the library.

## Toastifying
There are two ways you can display a toast, by giving the name of the toast type and the message you want to display `toastify('error', 'Something went wrong!')` or by giving a custom toast type object and the message you want to display `toastify({ color: 'teal', animation: { show: 'bounceIn' } }, 'Bouncy!')`. In the second case, every option not provided by the user will be filled with the default value.

It's also possible to pass an array of toast to be displayed. Each one of the toast types can be given with any of the two ways we described above.

Example:
```js
toastify([
    {
        type: 'error',
        message: 'Something went wrong!'
    }, 
    {
        type: {
            color: 'teal',
            animation: {
                show: 'bounceIn'
            }
        },
        message: 'Bouncy!'
    }
]);
```

## TODO
* Convert to ES6 syntax with the use of BABEL.
* Create and publish NPM package.

## License
MIT 