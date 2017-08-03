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
 */
root.toastify = function (options) {

}