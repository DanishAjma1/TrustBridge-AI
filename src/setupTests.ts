// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock window.matchMedia for jsdom
if (!window.matchMedia) {
	window.matchMedia = function (query) {
		return {
			matches: false,
			media: query,
			onchange: null,
			addListener: function () {}, // deprecated
			removeListener: function () {}, // deprecated
			addEventListener: function () {},
			removeEventListener: function () {},
			dispatchEvent: function () { return false; }
		};
	};
}

// Robust mock for localStorage for jsdom
let store: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
	value: {
		getItem: (key: string) => (key in store ? store[key] : null),
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
		key: (i: number) => Object.keys(store)[i] || null,
		get length() {
			return Object.keys(store).length;
		},
	},
	configurable: true
});
