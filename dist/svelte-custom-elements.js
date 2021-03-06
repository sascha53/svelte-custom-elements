(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.svelteCustomElements = global.svelteCustomElements || {})));
}(this, (function (exports) { 'use strict';

function register ( tagName, Component, props = [] ) {
	class SvelteElement extends HTMLElement {
		constructor () {
			super();

			this.target = this;
			this.data = {};
		}

		connectedCallback () {
			props.forEach( prop => {
				const value = this[ prop ];
				if ( value !== undefined ) {
					this.data[ prop ] = this[ prop ];
				}
			});

			this.instance = new Component({
				target: this.target,
				data: this.data
			});

			props.forEach( prop => {
				this.instance.observe( prop, value => {
					this.setAttribute( prop, value );
				});
			});
		}

		detachedCallback () {
			this.instance.destroy();
			this.instance = null;
		}

		attributeChangedCallback ( attr, oldValue, newValue ) {
			const value = isNaN( newValue ) ? newValue : +newValue;
			this.data[ attr ] = value;
			if ( this.instance ) this.instance.set({ [ attr ]: value });
		}
	}

	Object.defineProperty( SvelteElement, 'observedAttributes', {
		get () {
			return props;
		}
	});

	props.forEach( prop => {
		Object.defineProperty( SvelteElement.prototype, prop, {
			get () {
				return this.instance ? this.instance.get( prop ) : this.data[ prop ];
			},

			set ( value ) {
				this.data[ prop ] = value;
				if ( this.instance ) this.instance.set({ [ prop ]: value });
			}
		});
	});

	customElements.define( tagName, SvelteElement );
	return SvelteElement;
}

exports.register = register;

Object.defineProperty(exports, '__esModule', { value: true });

})));
