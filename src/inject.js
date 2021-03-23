
//#region //* Add Download Button To Single Songs on the Screen
const add_song_download_btn = () => {
	$('.single_download_btn').remove();
	// Add button in each song
	$('li').find('figcaption').find('a.u-color-js-gray').each(function () {
		const that = $(this);
		const Button = $('<div class="o-snippet__item single_download_btn"><span class="u-link"><i class="o-icon--large u-pop-in o-icon-download"></i></span></div>');
		try { var token = this.href.match(/.*\/(.*)/)[1] } catch (e) { }
		// CLick Action
		Button.on('click', function (e) {
			e.preventDefault();
			const $btn = $(this);
			const icon = $btn.find('span').find('i.o-icon--large');
			icon.removeClass('o-icon-download').addClass('o-icon-download-progress');
			// Get song Data
			getSongsData("song", token, (result, status) => {
				if (status) {
					toast(`Now Downloading Song : ${result.title}`);
					downloadWithData(result, () => icon.removeClass('o-icon-download-progress').addClass('o-icon-download'))
				} else {
					toast('Cannot download this Song');
					icon.removeClass('o-icon-download-progress').addClass('o-icon-close');
				}
			})
		});
		that.parents('article.o-snippet').find('.o-snippet__item').last().after(Button)
	});
};
//#endregion

//#region // Add Album Download Button on Albums
const add_album_download_btn = () => {
	const firstBtn = $('.o-flag__body .o-layout>.o-layout__item:first-of-type')
	const Button = $('<p class="o-layout__item u-margin-bottom-none@sm album_download_btn"><a class="c-btn c-btn--tertiary c-btn--ghost c-btn--icon"><i class="o-icon--large o-icon-download"></i></a></p>');
	// CLick Action
	Button.on('click', () => {
		const token = window.location.href.match(/.*\/(.*)/)[1]
		// Get album data
		getSongsData("album", token, (result, status) => {
			if (status) {
				toast(`Now Downloading Album : ${result.title}`)
				downloadSongsAsZip(result.songs, result.title)
			} else toast('Cannot download this Album')
		})
	});
	if (firstBtn.parent().find($('.album_download_btn')).length == 0)
		firstBtn.after(Button)
};
//#endregion

//#region // Add Playlist Download Button on Albums
const add_playlist_download_btn = () => {
	const firstBtn = $('.o-flag__body .o-layout>.o-layout__item:first-of-type')
	const Button = $('<p class="o-layout__item u-margin-bottom-none@sm playlist_download_btn"><a class="c-btn c-btn--tertiary c-btn--ghost c-btn--icon"><i class="o-icon--large o-icon-download"></i></a></p>');
	// CLick Action
	Button.on('click', () => {
		const token = window.location.href.match(/.*\/(.*)/)[1]
		// Get album data
		getSongsData("playlist", token, (result, status) => {
			if (status) {
				toast(`Now Downloading Playlist : ${result.title}`)
				downloadSongsAsZip(result.songs, result.title)
			} else toast('Cannot download this Playlist')
		})
	});
	if (firstBtn.parent().find($('.playlist_download_btn')).length == 0)
		firstBtn.after(Button)
};
//#endregion


//#region // Add Download Quality selector on the Menu..
const createDownloadQuality = () => {
	var self = this;
	var menuItem = $('<aside id="quality-dropdown" class="c-dropdown u-margin-right@sm"><div class="c-dropdown__header"><span class="c-dropdown__type"><span class="u-visible-visually@lg"></span>Qiality</span> <span class="c-dropdown__select curr-down-rate"></span></div></aside>');
	var dropDown = $('<div class="c-dropdown__content"><div class="u-padding@sm"><h5 class="u-deci u-margin-bottom-none@sm">Download Quality</h5><p class="u-centi u-color-js-gray-alt-light u-margin-bottom-none@sm"><em>Pick a prefered quality</em></p></div><div class="o-message o-message--error">You must select a bitrate</div></div>');
	var dropDownList = $('<form id="song-biterate"><section class="u-scroll u-3/5-max-vh"><ul class="o-list-select"></ul></section></form>');
	var bitrates = ['320', '192', '128', '64', '32', '16'];
	menuItem.find('.curr-down-rate').first().text(localStorage.download_bitrate + " kbps");
	bitrates = bitrates.map(function (rate) {
		var el = $('<li class="o-list-select__item" ><a>' + rate + ' kbps</a></li>');
		if (rate === localStorage.download_bitrate) el.addClass('selected')
		el.on('click', () => {
			localStorage.download_bitrate = rate;
			$(this).parent().find('.selected').each(() => {
				$(this).removeClass('selected');
				$(this).find('a em').remove();
			});
			$(this).addClass('selected');
			menuItem.find('.curr-down-rate').first().text(localStorage.download_bitrate + ' kbps');
			toast(`Download Quality changed to ${localStorage.download_bitrate}kbps`)
		});
		return el;
	});
	// Click Action
	$(document).on("click", function (e) {
		if (!$(e.target).closest("#quality-dropdown").length) $('#quality-dropdown').removeClass('active')
		else $('#quality-dropdown').toggleClass('active')
	});
	dropDownList.append(bitrates);
	dropDown.append(dropDownList);
	menuItem.append(dropDown);
	$(menuItem).insertAfter($("#language-dropdown"))
};
//#endregion


//#region // Download progress
const download_progress = () => {
	const wrapper = `<div id="download-bar"><div class="body-scroll"></div><div class="head"><i class="o-icon-download icon"></i><label>Downloads</label></div></div>`
	if ($('#download-bar').length == 0)
		$('.c-player').after(wrapper)
}
//#endregion

//#region // Run on Plugin Initialization
var initPlugin = () => {
	add_song_download_btn();
	add_album_download_btn();
	add_playlist_download_btn();
	hideAds();
};

// Hide ads and promotions
var hideAds = () => {
	$('body').removeClass('promo')
	$('.banner').removeClass('banner')
	const ads = ['.ad', '.c-promo', '.c-ad', '.c-banner']
	ads.forEach(el => $(el).remove())
};

$(document).ready(() => {
	setTimeout(() => {
		initPlugin();
		download_progress();
		createDownloadQuality();
	}, 500);
	// check if classes of the .page-wrap changes then add the buttons again
	var oldSongListLen = 0;
	var inter = setInterval(() => {
		if ($('ol.o-list-bare').find('li').length) {
			if ($('#download-bar .body-scroll').children().length == 0) $('#download-bar').removeClass('active')
			var songListLen = $('ol.o-list-bare').find('li').length;
			if (songListLen !== oldSongListLen) initPlugin();
			oldSongListLen = songListLen;
		}
	}, 2000);
});
//#endregion

//#region // Toast Alert
const toast = (message) => {
	$('<div class="c-toast__msg" />').html(message)
		.appendTo($('<div class="c-toast__row" />')
			.appendTo($('.c-player ~ .c-toast')))
	const msgContainer = $('.c-player ~ .c-toast .c-toast__row')
	setTimeout(() => msgContainer.addClass('active'), 0)
	setTimeout(() => {
		msgContainer.removeClass('active')
		msgContainer.on('animationend transitionend', e => e.target.remove())
	}, 3000)
}
//#endregion
