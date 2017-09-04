"use strict";

var root = typeof self == 'object' && self.self === self && self ||
	typeof global == 'object' && global.global === global && global ||
	this;

/**
 * Initializes the Toastify library.
 * 
 * @param {object} options The setting options for the toastify.
 * @return {Function} A function used to create new toasts.
 */
function Toastify(options) {
	/**
	 * The id of the toastify element.
	 */
	var id = '';

	var settings = {
		/**
		 * The root element that holds the toastify.
		 * @default body element.
		 */
		root: 'body',
		/**
		 * The maximum number of toasts that can be on screen at the same time (0 for unlimited).
		 * @default 0.
		 */
		max: 0,
		/**
		 * The position of the toastify relative to the root element.
		 * @default bottom - right.
		 */
		position: {
			/**
			 * The horizontal position.
			 * @default right.
			 */
			horizontal: 'right',
			/**
			 * The vertical position.
			 * @default bottom.
			 */
			vertical: 'bottom',
			/**
			 * Sets horizontal value after
			 * validating given value.
			 * 
			 * @param {string} value The given horizontal value.
			 */
			setHorizontal: function (value) {
				if (!value) return;
				if (value === 'right' || value === 'left')
					this.horizontal = value;
				else
					console.error('"' + value + '" is not a valid value for horizontal position');
			},
			/**
			 * Sets vertical value after
			 * validating given value.
			 * 
			 * @param {string} value The given vertical value.
			 */
			setVertical: function (value) {
				if (!value) return;
				if (value === 'top' || value === 'bottom')
					this.vertical = value;
				else
					console.error('"' + value + '" is not a valid value for vertical position');
			},
		},
		/**
		 * Configs settings with given options.
		 * 
		 * @param {object} options The given options.
		 */
		config: function (options) {
			if (!options) return;
			// If a root options exist checks if the the element
			// exist in the DOM.
			this.root = (options.root && document.querySelector(options.root)) ?
				options.root :
				this.root;
			this.max = options.max || this.max;
			if (!options.position) return;
			this.position.horizontal = this.position.setHorizontal(options.position.horizontal);
			this.position.vertical = this.position.setHorizontal(options.position.vertical);
		}
	}

	var utilities = {
		/**
		 * Returns the toastify element.
		 */
		getToastifyEl: function () {
			return document.getElementById(id);
		},
		/**
		 * Creates a unique string in combination with
		 * the given name for element id.
		 * 
		 * @param {string} name The name that will be used for the unique id.
		 */
		UUID: function (name) {
			return (name + '__xxxx-xxxxxx').replace(/[x]/g, function (c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		/**
		 * Indicates if the maximum number of toasts 
		 * that can be on screen at the same time has been reached.
		 */
		showToast: function () {
			return settings.max === 0 ||
				toasts.count < settings.max;
		},
		/**
		 * Adds an event listener to given element
		 * that executes given callback function
		 * when given animation has ended.
		 * 
		 * @param {string} animation The name of the animation.
		 * @param {object} el The element.
		 * @param {Function} callback The callback function.
		 */
		onAnimationEnded: function (animation, el, callback) {
			el.addEventListener('animationend', function (el) {
				if (el.animationName === animation) return callback(el);
			});
			el.addEventListener('mozanimationend', function (el) {
				if (el.animationName === animation) return callback(el);
			});
			el.addEventListener('webkitAnimationEnd', function (el) {
				if (el.animationName === animation) return callback(el);
			});
			el.addEventListener('oanimationend', function (el) {
				if (el.animationName === animation) return callback(el);
			});
			el.addEventListener('MSAnimationEnd', function (el) {
				if (el.animationName === animation) return callback(el);
			});
		}
	}

	var toast = {
		// Toast default values.
		/**
		 * Τhe background color.
		 * @default teal.
		 */
		color: 'teal',
		/**
		 * The duration that the toast will be on screen in ms.
		 * @default 3000
		 */
		duration: 0,
		/**
		 * If true the toast will be on screen until user clicks on it.
		 * @default false.
		 */
		sticky: false,
		/**
		 * If true when user clicks on toast it will be removed 
		 * no matter the other options are.
		 * @default false.
		 */
		closeOnClick: false,
		/**
		 * The show and hide animations of the toast.
		 * @default show-toast, hide-toast.
		 */
		animations: {
			/**
			 * The show animations.
			 * @default show-toast.
			 */
			show: 'show-toast',
			/**
			 * The hide animations.
			 * @default hide-toast.
			 */
			hide: 'hide-toast'
		},
		/**
		 * Merges given options to this toast type.
		 * 
		 * @param {object} options The given toast options.
		 */
		config: function (options) {
			this.color = options.color || this.color;
			this.duration = options.duration || this.duration;
			this.sticky =
				options.sticky !== undefined ?
				options.sticky :
				this.sticky;
			this.closeOnClick =
				options.closeOnClick !== undefined ?
				options.closeOnClick :
				this.sticky;
			this.animations = this.animations || {};
			this.animations.show =
				(options.animations && options.animations.show) ?
				options.animations.show :
				this.animations.show;
			this.animations.hide =
				(options.animations && options.animations.hide) ?
				options.animations.hide :
				this.animations.hide;

			return this;
		},
		/**
		 * Creates and returns a new toast type
		 * with the given options and the default values
		 * for everything not given in options.
		 * 
		 * @param {object} options The given toast options for the new type.
		 */
		createType: function (options) {
			// Creates a new toast type
			// with the default toast values.
			var newToastType = {
				color: this.color,
				duration: this.duration,
				sticky: this.sticky,
				closeOnClick: this.closeOnClick,
				animations: this.animations
			};
			// Configs the new toast type
			// with the given options.
			this.config.call(newToastType, options);
			return newToastType;
		},
		/**
		 * Creates a new toast and adds it to the DOM.
		 * 
		 * @param {object} type The type of the toast that is going to be created.
		 * @param {string} message The message that the toast is going to display.
		 */
		create: function (type, message) {
			// Creates and configs new toast.
			var toastId = utilities.UUID('toast');
			var newToastEl = document.createElement('div');
			newToastEl.setAttribute("id", toastId);
			newToastEl.classList.add('toast');
			newToastEl.classList.add(type.animations.show);
			// If type color is a hex color
			// adds it as an inline style
			// otherwise adds it as a class.
			if (type.color.startsWith('#'))
				newToastEl.style.backgroundColor = type.color;
			else
				newToastEl.classList.add(type.color);
			newToastEl.innerHTML = message;
			var toastifyEl = utilities.getToastifyEl();
			toastifyEl.appendChild(newToastEl);
			// If toast type is sticky or must closeOnClick
			// adds an event listener on click to play hide animation.
			if (type.sticky || type.closeOnClick)
				toast.addEventListener('click', function () {
					this.classList.add(type.animations.hide);
				});
			// If toast type is not sticky adds a timeout
			// after the types duration to play the hide animation.
			if (!type.sticky)
				setTimeout(function () {
					var el = document.getElementById(toastId);
					el.classList.add(type.animations.hide);
				}, type.duration);
			// Adds an event lister to toast when the hide animation
			// end to remove the toast from the DOM.
			utilities.onAnimationEnded(type.animations.hide, newToastEl, toasts.remove);
		},
		/**
		 * Removes given toast from the DOM.
		 * 
		 * @param {object} toastEl The element that is going to be removed.
		 */
		remove: function (toastEl) {
			var toastifyEl = utilities.getToastifyEl();
			toastifyEl.removeChild(toastEl);
		}
	}

	var toasts = {
		/**
		 * Number of toast currently on screen.
		 */
		count: 0,
		/**
		 * Array of toast pending to be show.
		 */
		pending: [],
		/**
		 * Adds the oldest pending toast 
		 * if any exist and
		 * if the count of current showing toasts are not
		 * more that the maximum number of toasts that can be on screen at the same time.
		 */
		addNextToast: function () {
			if (!utilities.showToast()) return;
			var nextToast = this.pending[0];
			this.pending.splice(0, 1);
			this.addToast(nextToast.type, nextToast.message);
		},
		/**
		 * Removes given toast, 
		 * updates the current toasts count
		 * and calls to add the next pending toast.
		 * 
		 * @param {object} toastEl The element that is going to be removed.
		 */
		removeToast: function (toastEl) {
			if (!utilities.getToastifyEl().contains(toastEl)) return;
			toast.remove(toastEl);
			this.count--;
			this.addNextToast();
		},
		/**
		 * Tries to add a new toast.
		 * Validates the given type and message.
		 * If there the maximum number of toasts that can be on screen at the same time
		 * has been reached add toast to the pending list.
		 * 
		 * @param {object} type The type of the toast that is going to be created.
		 * @param {string} message The message that the toast is going to display.
		 */
		addToast: function (type, message) {
			// Validates parameters.
			if (!message)
				return console.error('Toastify: no message was given for toast to display.');
			if (!type)
				return console.error('Toastify: toast type not found.');
			// If there is no room for the new toast
			// adds it to the pending list.
			if (!utilities.showToast()) {
				this.pending.add({
					type,
					message
				});
				return;
			}
			toast.create(type, message);
			this.count++;
		}
	}

	/**
	 * The default toast types.
	 */
	var types = {
		error: {
			color: "red",
			duration: 8000,
			sticky: false,
			closeOnClick: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
		},
		warning: {
			color: "orange",
			duration: 6000,
			sticky: false,
			closeOnClick: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
		},
		success: {
			color: "green",
			duration: 4000,
			sticky: false,
			closeOnClick: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
		},
		message: {
			color: "blue",
			duration: 2000,
			sticky: false,
			closeOnClick: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
		},
		sticky: {
			color: 'teal',
			duration: 0,
			sticky: true,
			closeOnClick: false,
			animations: {
				show: 'show-toast',
				hide: 'hide-toast'
			}
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
}

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
 *      @default body element.
 * max:
 *      Sets the maximum number of toasts that can be on screen at the same time (0 for unlimited).
 *      @default 0.
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

	


}