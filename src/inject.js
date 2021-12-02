const _page = () => $('#root >div:nth-of-type(2)').attr('class')

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

	new MutationObserver(replace)
		.observe($('#root')[0], { subtree: true, childList: true })
}

const add_song_download_btn = () => {
	// Mutation Observer
	const add_button = async () => {
		const element = $('li figcaption a.link-gray')
		if (element.length < 1) return

		await element.each(function () {
			const $el = $(this), class_name = 'jsdBTN_1'
			const token = $el.attr('href')?.match(/.*\/(.*)/)[1] || null
			const $parent = $el.parents('article.o-snippet')
			if ($parent.find(`.${class_name}`).length > 0) return

			const $btn = $(`
			<div class='o-snippet__item ${class_name}' data-song=${token}>
				<span class='u-link svd_dlI'><i class='o-icon--large o-icon-download'/></span>
				<svg viewBox='0 0 24 24' class='jsdSVG_r'><circle cx='12' cy='12' r='11'/></svg>
			</div>
			`)
			$btn.icon = $btn.find('span').find('i.o-icon--large')
			$btn.progress = $btn.find('span').find('svg.progress')

			$btn.on('click', async (e) => {
				const data = await get_songs_data('song', token)
				if (!data) return
				$btn.addClass('prog')
				download_song(data, () => $btn.removeClass('prog'))
			})
			$parent.find('.o-snippet__item:nth-last-of-type(2)').before($btn)
		})
	}

	new MutationObserver(add_button)
		.observe($('#root')[0], { subtree: true, childList: true })
}

const add_list_download_btn = () => {

	const add_button = () => {
		let cls = ['s', 'featured', 'album']
		if (!cls.includes(_page())) return

		const $firstBtn = $('.o-flag__body .o-layout>.o-layout__item:first-of-type')
		const class_name = 'jsdBTN_2'
		if ($firstBtn.parent().find($(`.${class_name}`)).length > 0) return

		const $btn = $(`
		<p class="o-layout__item u-margin-bottom-none@sm ${class_name}">
			<a class="c-btn c-btn--tertiary c-btn--ghost c-btn--icon">
			<i class="o-icon--large o-icon-download svd_dlI"></i>
			<svg viewBox='0 0 24 24' class='jsdSVG_r'><circle cx='12' cy='12' r='11'/></svg>
			</a>
		</p>
		`)

		// detect type
		const type = _page() === 'album' ? 'album' : 'playlist'

		// CLick Action
		$btn.on('click', async () => {
			const token = window.location.href.match(/.*\/(.*)/)[1]
			const data = await get_songs_data(type, token)
			if (!data && data?.songs.length < 1) return
			$btn.addClass('prog')
			download_list(data, () => $btn.removeClass('prog'))
		})
		$firstBtn.after($btn)
	}
	new MutationObserver(add_button)
		.observe($('#root')[0], { subtree: true, childList: true })
}

// Run on Plugin Initialization
const initPlugin = () => {
	hide_ads()
	injext_css()
	add_song_download_btn()
	add_list_download_btn()
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
