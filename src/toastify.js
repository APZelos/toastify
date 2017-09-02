"use strict";

var root = typeof self == 'object' && self.self === self && self ||
	typeof global == 'object' && global.global === global && global ||
	this;

/**
 * Initializes the toastify lib
 * and returns a function 
 * that is used to show toasts.
 * 
 * options: {
 * 		root: '#toastify',
 * 		max: 0,
 * 		postilion: {
 * 			horizontal: 'right',
 * 			vertical: 'bottom'
 * 		},
 * 		defaults : {
 * 			color: 'teal',
 * 			sticky: false,
 * 			closeOnClick: false,
 * 			duration: 1000,
 * 			animations: {
 * 				show: '',
 * 				hide: ''
 * 			}
 * 		},
 * 		types: {
 * 			custom: {
 * 				color: 'teal',
 * 				sticky: false,
 * 				closeOnClick: false,
 * 				duration: 1000,
 * 				animations: {
 * 					show: '',
 * 					hide: ''
 * 				}
 * 			}
 * 		}
 * } 
 * 
 * root: 
 *      The element that will hold the toasts.
 *      Default: body element.
 * max:
 *      Sets the maximum number of toasts that can be on screen at the same time (0 for unlimited).
 *      Default: 0.
 * position:
 *      Sets the horizontal ('left', 'right') and vertical ('top', 'bottom')
 *      position of the the toasts. The default values are 'right', 'bottom'.
 * defaults:
 *      The default toast type settings. Custom types that are missing a setting
 * 		will use the corresponding default value.
 * types:
 * 		Custom types defined by the user.
 * 
 * @param {object} options The setting options for the toastify.
 */
root.toastify = function (options) {
	/**
	 * The id of the element that holds the toasts.
	 */
	var id = '';

	/**
	 * The toastify settings.
	 */
	var settings = {};

	/**
	 * The default toast types.
	 */
	var types = {
		error: {
			color: "red",
			duration: 8000,
			sticky: false,
			button: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
		},
		warning: {
			color: "orange",
			duration: 6000,
			sticky: false,
			button: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
		},
		success: {
			color: "green",
			duration: 4000,
			sticky: false,
			button: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
		},
		message: {
			color: "blue",
			duration: 2000,
			sticky: false,
			button: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
		},
		sticky: {
			color: 'teal',
			duration: 0,
			sticky: true,
			button: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
		}
	}

	/**
	 * The toasts that are on the queue list.
	 */
	var pendingToasts = [];

	/**
	 * Configs the toastify settings based on the given options.
	 * 
	 * @param {object} options Given options.
	 */
	function configSettings(options) {
		// Configs given options.
		options = options || {};
		options.position = options.position || {};
		options.defaults = options.defaults || {};
		options.defaults.animations = options.defaults.animations || {};
		// Configs settings based on given options.
		settings.root = options.root || 'body';
		settings.max = options.max || 0;
		settings.position.horizontal = options.position.horizontal || 'right';
		settings.position.vertical = options.position.vertical || 'bottom';
		settings.defaults.color = options.defaults.color || 'teal';
		settings.defaults.sticky = options.defaults.sticky || false;
		settings.defaults.closeOnClick = options.defaults.closeOnClick || false;
		settings.defaults.duration = options.defaults.duration || 1000;
		settings.defaults.animations.show = options.defaults.animations.show || 'show-toast';
		settings.defaults.animations.hide = options.defaults.animations.hide || 'hide-toast';
		// Creates settings functions.
		// Returns a valid value for horizontal position.
		settings.position.getHorizontal = function () {
			var horizontal = settings.position.horizontal;
			if (horizontal === 'right' || horizontal === 'left')
				return horizontal;
			return 'right';
		}
		// Returns a valid value for vertical position.
		settings.position.getVertical = function () {
			var vertical = settings.position.vertical;
			if (vertical === 'top' || vertical === 'bottom')
				return vertical;
			return 'bottom';
		}
	}

	/**
	 * Creates a new toastify element with a unique id,
	 * sets its position classes and appends to selected
	 * root element.
	 */
	function init() {
		id = UUID('toastify');
		var root = document.querySelector(settings.root);
		var toastifyEl = document.createElement('div');
		// Sets attributes and classes of toastify element.
		toastifyEl.setAttribute('id', id);
		toastifyEl.classList.add('toastify');
		toastifyEl.classList.add('toastify--' + settings.position.getHorizontal());
		toastifyEl.classList.add('toastify--' + settings.position.getVertical());
		root.appendChild(toastifyEl);
	}

	/**
	 * Creates a unique string in combination with
	 * the given name for element id.
	 * 
	 * @param {string} name The name that will be used for the unique id.
	 */
	function UUID(name) {
		return (name + '__xxxx-xxxxxx').replace(/[x]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
}