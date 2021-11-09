// Hide ads and promotions
const hide_ads = () => {
	$('body').removeClass('promo')
	$('.banner').removeClass('banner')
	const ads = ['.ad', '.c-promo', '.c-ad', '.c-banner', '.c-player__ad']
	ads.forEach((el) => {
		if (el) $(el).remove()
	})
}

// Injext CSS
const injext_css = () => {
	const search = [
		['u-color-js-gray', 'link-gray'],
		['u-color-js-gray-alt-light', 'link-gray-alt'],
	]
	const replace = () =>
		search.forEach(([s, r]) => {
			const el = $(`.${s}`)
			if (el.length > 0) el.addClass(r).removeClass(s)
		})

	setInterval(replace, 250)
}

// Run on Plugin Initialization
const initPlugin = () => {
	console.clear()
	hide_ads()
	injext_css()
	console.log(1)
}

$(document).ready(() => {
	// setInterval(() => {
	initPlugin()
	// }, 1000)
})
