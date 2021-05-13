
//#region //* Single Download =====
const add_song_download_btn = () => {
	// $('.single_download_btn').remove();
	// Add button in each song
	$('li').find('figcaption').find('a.u-color-js-gray').each(function () {
		if ($(this).parents('article.o-snippet').find('.single_download_btn').length !== 0) return
		const Button = $('<div class="o-snippet__item single_download_btn"><span class="u-link"><i class="o-icon--large o-icon-download"></i></span></div>');
		const icon = Button.find('span').find('i.o-icon--large');
		try { var token = this.href.match(/.*\/(.*)/)[1] } catch (e) { return }
		// CLick Action
		Button.on('click', (e) => {
			e.preventDefault();
			icon.removeClass('o-icon-download').addClass('o-icon-download-progress');
			// On error function
			const error = () => {
				toast('Sorry! Cannot download this Song');
				icon.removeClass('o-icon-download-progress').addClass('o-icon-download')
			}
			// Get song Data
			getSongsData('song', token, (result, status) => {
				if (status) {
					toast(`Now Downloading Song : ${result.title}`);
					downloadWithData(
						result,
						() => icon.removeClass('o-icon-download-progress').addClass('o-icon-download'),
						() => error()
					)
				} else error()
			})
		});
		// Add Button 
		$(this).parents('article.o-snippet').find('.o-snippet__item:nth-last-of-type(2)').before(Button)
	});
};
//#endregion

//#region //* Album Download =====
const add_album_download_btn = () => {
	const firstBtn = $('.o-flag__body .o-layout>.o-layout__item:first-of-type')
	const Button = $('<p class="o-layout__item u-margin-bottom-none@sm album_download_btn"><a class="c-btn c-btn--tertiary c-btn--ghost c-btn--icon"><i class="o-icon--large o-icon-download"></i></a></p>');
	const icon = Button.find('i.o-icon--large');
	// CLick Action
	Button.on('click', () => {
		const token = window.location.href.match(/.*\/(.*)/)[1]
		icon.removeClass('o-icon-download').addClass('o-icon-download-progress');
		// Get album data
		getSongsData('album', token, (result, status) => {
			if (status) {
				// Display Toast
				toast(`Now Downloading Album : ${result.title}`)
				// Download zip file
				downloadSongsAsZip(result, () => {
					icon.addClass('o-icon-download').removeClass('o-icon-download-progress');
					toast("Compressing & Zipping the Downloads");
				})
			} else toast('Cannot download this Album')
		})
	});
	if (firstBtn.parent().find($('.album_download_btn')).length == 0)
		firstBtn.after(Button)
};
//#endregion

//#region //* Playlist Download =====
const add_playlist_download_btn = () => {
	const firstBtn = $('.o-flag__body .o-layout>.o-layout__item:first-of-type')
	const Button = $('<p class="o-layout__item u-margin-bottom-none@sm playlist_download_btn"><a class="c-btn c-btn--tertiary c-btn--ghost c-btn--icon"><i class="o-icon--large o-icon-download"></i></a></p>')
	const icon = Button.find('i.o-icon--large')
	// CLick Action
	Button.on('click', () => {
		const token = window.location.href.match(/.*\/(.*)/)[1]
		icon.removeClass('o-icon-download').addClass('o-icon-download-progress')
		// Get album data
		getSongsData('playlist', token, (result, status) => {
			if (status) {
				// Display Toast
				toast(`Now Downloading Playlist : ${result.title}`)
				// Download Zip
				downloadSongsAsZip(result, () => {
					icon.addClass('o-icon-download').removeClass('o-icon-download-progress');
					toast("Compressing & Zipping the Downloads");
				})
			} else toast('Cannot download this Playlist')
		})
	});
	if (firstBtn.parent().find($('.playlist_download_btn')).length == 0)
		firstBtn.after(Button)
};
//#endregion

//#region //? Add Download Quality selector on the Menu..
const createDownloadQuality = () => {
	var
		menuItem = $('<aside id="quality-dropdown" class="c-dropdown u-margin-right@sm"><div class="c-dropdown__header"><span class="c-dropdown__type"><span class="u-visible-visually@lg"></span>Qiality</span> <span class="c-dropdown__select curr_biterate"></span></div></aside>'),
		dropDown = $('<div class="c-dropdown__content"><div class="u-padding@sm"><h5 class="u-deci u-margin-bottom-none@sm">Download Quality</h5><p class="u-centi u-color-js-gray-alt-light u-margin-bottom-none@sm"><em>Pick a prefered quality</em></p></div><div class="o-message o-message--error">You must select a bitrate</div></div>'),
		dropDownList = $('<form id="song-biterate"><section class="u-scroll u-3/5-max-vh"><ul class="o-list-select"></ul></section></form>')
	// Biterates
	var bitrates = ['320', '192', '128', '64', '32', '16'];
	menuItem.find('.curr_biterate').first().text(localStorage.download_bitrate + ' kbps');
	bitrates = bitrates.map(rate => {
		const el = $(`<li class='o-list-select__item'>${rate} kbps</li>`);
		if (rate === localStorage.download_bitrate) el.addClass('selected')
		// Click Action
		el.on('click', e => {
			localStorage.download_bitrate = rate;
			// Change Selected Maek
			$(e.target).parent().find('.selected').removeClass('selected')
			$(e.target).addClass('selected');
			// Change label
			menuItem.find('.curr_biterate').first().text(`${localStorage.download_bitrate} kbps`);
			// Display Toast
			toast(`Download Quality changed to ${localStorage.download_bitrate}kbps`)
		});
		return el;
	});
	// Focus and Blur Action
	$(document).on('click', e => {
		if (!$(e.target).closest('#quality-dropdown').length) $('#quality-dropdown').removeClass('active')
		else $('#quality-dropdown').toggleClass('active')
	});
	dropDownList.append(bitrates);
	dropDown.append(dropDownList);
	menuItem.append(dropDown);
	$(menuItem).insertAfter($('#language-dropdown'))
};
//#endregion

//#region //? Download progress
const download_progress = () => {
	const wrapper = `<div id="download-bar"><div class="body-scroll"></div><div class="head"><i class="o-icon-download icon"></i><label>Downloads</label></div></div>`
	if ($('#download-bar').length == 0)
		$('.c-player').after(wrapper)
}
//#endregion

// Hide ads and promotions
var hideAds = () => {
	$('body').removeClass('promo')
	$('.banner').removeClass('banner')
	const ads = ['.ad', '.c-promo', '.c-ad', '.c-banner', '.c-player__ad']
	ads.forEach(el => { if (el) $(el).remove() })
};

//#region //? Toast Alert
const toast = (message) => {
	// create container
	$('<div class="c-toast__msg" />').html(message)
		.appendTo($('<div class="c-toast__row cStm" />')
			.appendTo($('.c-player ~ .c-toast')))
	const msgContainer = $('.c-player ~ .c-toast .c-toast__row.cStm')
	setTimeout(() => msgContainer.addClass('active'), 0)
	setTimeout(() => {
		msgContainer.removeClass('active')
		msgContainer.on('animationend transitionend', e => e.target.remove())
	}, 3000)
}
//#endregion

//#region //? Run on Plugin Initialization
var initPlugin = () => {
	hideAds();
	add_song_download_btn();
	add_album_download_btn();
	add_playlist_download_btn();
};


$(document).ready(() => {
	initPlugin();
	download_progress();
	createDownloadQuality();
	// Create toast to notify
	toast('Plugin is active and Functional')
	// hide download bar if no current downloads
	setInterval(() => {
		if ($('#download-bar .body-scroll').children().length == 0) $('#download-bar').removeClass('active')
	}, 2000);
	// check if classes of the .page-wrap changes then add the buttons again
	var oldSongListLen = 0;
	// update on list change
	setInterval(() => {
		if ($('ol.o-list-bare').find('li').length) {
			var songListLen = $('ol.o-list-bare').find('li').length;
			if (songListLen !== oldSongListLen) initPlugin();
			oldSongListLen = songListLen;
		}
	}, 1000);
});
//#endregion
