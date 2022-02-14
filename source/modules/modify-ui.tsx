import { observe } from 'selector-observer'

// Hide ads and promotions
observe('.banner', {
	add(el) {
		el.classList.remove('banner')
		document.body.classList.remove('promo')
	},
})

// Injext CSS
const className = [
	['u-color-js-gray', 'link-gray'],
	['u-color-js-gray-alt-light', 'link-gray-alt'],
]
className.forEach(([s, r]) => {
	observe(`.${s}`, {
		add(el) {
			el.classList.remove(s)
			el.classList.add(r)
		},
	})
})
