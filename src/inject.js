// Hide ads and promotions
const hide_ads = () => {
	$('body').removeClass('promo')
	$('.banner').removeClass('banner')
	const ads = ['.ad', '.c-promo', '.c-ad', '.c-banner', '.c-player__ad']
	ads.forEach((el) => el && $(el).remove())
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

	// Initial Replace
	replace()
	// Mutation Observer
	const obs = new MutationObserver(replace)
	obs.observe($('#root')[0], { subtree: true, childList: true })
}

// Run on Plugin Initialization
const initPlugin = () => {
	hide_ads()
	injext_css()
}

$(document).ready(() => {
	initPlugin()

	// Detect Location change
	let a = location.href
	new MutationObserver(() => {
		let b = location.href
		if (a === b) return
		a = b
		initPlugin()
	}).observe(document, { subtree: true, childList: true })
})
