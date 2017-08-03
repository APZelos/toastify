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
 * 		postition: {
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
 *      The default toast type settings. Custom types that are missing a settin
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
}