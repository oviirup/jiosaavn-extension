import { observe } from 'selector-observer'
import $ from 'jquery'

// Hide ads and promotions
observe('.banner', {
	add(el) {
		$('body').removeClass('promo')
		$('.banner').removeClass('banner')
		const ads = ['.ad', '.c-promo', '.c-ad', '.c-banner', '.c-player__ad']
		ads.forEach((el) => el && $(el).remove())
	},
})

// Injext CSS
const className = [
	['u-color-js-gray', 'link-gray'],
	['u-color-js-gray-alt-light', 'link-gray-alt'],
]
className.forEach(([s, r]) => {
	observe(`.${s}`, {
		add: (el) => $(el).removeClass(s).addClass(r),
	})
})
