"use strict";

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
		 * @default top - right.
		 */
		position: {
			/**
			 * The horizontal position.
			 * @default right.
			 */
			horizontal: 'right',
			/**
			 * The vertical position.
			 * @default top.
			 */
			vertical: 'top',
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
					console.error('Toastify: "' + value + '" is not a valid value for horizontal position');
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
					console.error('Toastify: "' + value + '" is not a valid value for vertical position');
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
			var getOptionsRoot = options.root && document.querySelector(options.root);
			if (!getOptionsRoot) console.error('Toastify: "' + options.root + '" was not found in the DOM, "' + this.root + '" element will be used instead');
			this.root = getOptionsRoot ?
				options.root :
				this.root;
			this.max = options.max || this.max;
			if (!options.position) return;
			this.position.setHorizontal(options.position.horizontal);
			this.position.setHorizontal(options.position.vertical);
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
			el.addEventListener('animationend', function (event) {
				if (event.animationName === animation) return callback(el);
			});
			el.addEventListener('mozanimationend', function (event) {
				if (event.animationName === animation) return callback(el);
			});
			el.addEventListener('webkitAnimationEnd', function (event) {
				if (event.animationName === animation) return callback(el);
			});
			el.addEventListener('oanimationend', function (event) {
				if (event.animationName === animation) return callback(el);
			});
			el.addEventListener('MSAnimationEnd', function (event) {
				if (event.animationName === animation) return callback(el);
			});
		},
		/**
		 * Loops thought the properties of an object.
		 * 
		 * @param {object} object The object we want to loop.
		 * @param {function} callback A callback that gets the name of the property as argument.
		 */
		forEachProperty: function (object, callback) {
			for (var property in object) {
				if (object.hasOwnProperty(property) && typeof object[property] !== 'function') {
					callback(property);
				}
			}
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
		duration: 3000,
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
			if (!options) return;
			this.color = options.color || this.color;
			this.duration = options.duration || this.duration;
			this.sticky =
				options.sticky !== undefined ?
				options.sticky :
				this.sticky;
			this.closeOnClick =
				options.closeOnClick !== undefined ?
				options.closeOnClick :
				this.closeOnClick;
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
				animations: {
					show: this.animations.show,
					hide: this.animations.hide
				}
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
			newToastEl.classList.add('toastify__toast');
			newToastEl.classList.add(type.animations.show);
			// If type color is a HEX, RGB, RGBA, HSL, HSLA color
			// adds it as an inline style
			// otherwise adds it as a class.
			if (type.color.startsWith('#') ||
				type.color.startsWith('rgb(') ||
				type.color.startsWith('rgba(') ||
				type.color.startsWith('hsl(') ||
				type.color.startsWith('hsla('))
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
			utilities.onAnimationEnded(type.animations.hide, newToastEl, toasts.removeToast.bind(toasts));
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
			if (!nextToast) return;
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
					type: type,
					message: message
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
			duration: 8000
		},
		warning: {
			color: "orange",
			duration: 6000
		},
		success: {
			color: "green",
			duration: 4000
		},
		message: {
			color: "blue",
			duration: 2000
		},
		sticky: {
			color: 'teal',
			duration: 0,
			sticky: true
		},
		/**
		 * Configs the predefined types with the custom settings
		 * and adds any new type.
		 * 
		 * @param {object} customTypes The custom types and the custom settings for the predefined types.
		 */
		config: function (customTypes) {
			// Loops through the predefined types
			// and configs the with the default values.
			utilities.forEachProperty(types, function (type) {
				types[type] = toast.createType(types[type]);
			});
			if (!customTypes) return;
			// Loops through the custom types 
			// and if type already exist configs it
			// else creates a new type.
			utilities.forEachProperty(customTypes, function (type) {
				if (types[type]) toast.config.call(types[type], customTypes[type]);
				else types[type] = toast.createType(customTypes[type]);
			});
		}
	}

	/**
	 * Creates a new toastify element with a unique id,
	 * sets its position classes and appends to selected
	 * root element.
	 */
	function init() {
		id = utilities.UUID('toastify');
		var root = document.querySelector(settings.root);
		var toastifyEl = document.createElement('div');
		// Sets attributes and classes of toastify element.
		toastifyEl.setAttribute('id', id);
		toastifyEl.classList.add('toastify');
		toastifyEl.classList.add('toastify--' + settings.position.horizontal);
		toastifyEl.classList.add('toastify--' + settings.position.vertical);
		root.appendChild(toastifyEl);
	}

	// Runs configurations and initialize.
	settings.config(options);
	// Ensures that the fallowing
	// calls wont throw undefined error.
	options = options || {};
	toast.config(options.defaults);
	types.config(options.types);
	init();

	// The return function of Toastify.
	// It accepts toasts in the form:
	//		* of a single toast (type, message)
	// 		* of an array of toast objects ([ { type, message }, { type, message } ])
	// The type of a toast can be given:
	// 		* as a string with the name of the type (if the type is predefined)
	// 		* as an object with the desired toast options (all the not included options will be filled with the default toast values)
	return function (type, message) {
		// If type is an Array then users
		// gave a list of toasts. It enumerates
		// the array and tries to add every toast in the array.
		if (type instanceof Array)
			for (var i = 0; i < type.length; i++)
				tryToAddToast(type[i].type, type[i].message);
		else tryToAddToast(type, message);

		/**
		 * Tries to add given toast. 
		 * If given type is a string tries to retrieve type from the predefined ones.
		 * Else it assumes that type is options for a new custom type and tries to create that type. 
		 * 
		 * @param {any} type The type of the toast that is going to be created.
		 * @param {string} message The message that the toast is going to display.
		 */
		function tryToAddToast(type, message) {
			if (typeof type === 'string') toasts.addToast(types[type], message);
			else toasts.addToast(toast.createType(type), message);
		}
	}
}