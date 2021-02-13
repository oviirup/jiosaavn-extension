//#region //* Add Download Button To Single Songs on the Screen
var addDownloadButtonToAllSongs = function () {
	$('.single-download-button').remove();
	var songsEle = $('li').find('figcaption').find('a.u-color-js-gray');
	songsEle.each(function () {
		var $this = $(this);
		var btn = $('<div class="o-snippet__item single-download-button"><span class="u-link"><i class="o-icon--large u-pop-in o-icon-download"></i></span></div>');
		try { var song = this.href; } catch (e) { }
		btn.on('click', function (e) {
			e.preventDefault();
			var $btn = $(this);
			var iconBtn = $btn.find('span').find('i.o-icon--large')
			iconBtn.removeClass('o-icon-download');
			iconBtn.addClass('o-icon-download-progress');
			getDownloadURL(song, function (result, status) {
				if (status === 'success') {
					downloadWithData(result, function () {
						iconBtn.removeClass('o-icon-download-progress').addClass('o-icon-download');
					});
				}
				if (status === 'error') {
					iconBtn.removeClass('o-icon-download-progress').addClass('o-icon-close');
				}
			});
		});
		$this.parents('article.o-snippet').find('.o-snippet__item').last().after(btn)
	});
};
//#endregion

//#region // Add Album Download Button on Albums
var addAlbumDownloadButton = function () {
	var firstBtn = $('.o-flag__body .o-layout>.o-layout__item:first-of-type')
	$('.c-nav.c-nav--secondary').remove();
	var albumBtn = $('<p class="o-layout__item u-margin-bottom-none@sm download_btn"><a class="c-btn c-btn--tertiary c-btn--ghost c-btn--icon"><i class="o-icon--large o-icon-download"></i></a></p>');

	albumBtn.on('click', function () {
		var songs = [];
		$('.song-json').each(function () {
			songs.push(JSON.parse($(this).text()))
		});
		downloadSetOfSongsAsZip(songs, songs[0].album + bitrateString);
	});
	if (firstBtn.parent().find($('.download_btn')).length == 0)
		albumBtn.insertAfter(firstBtn)
};
//#endregion

//#region // Add Download Button on Playlist
var addPlaylistDownloadButton = function () {
	$('.playlist-download').remove();
	var playlistBtn = $('<li><a class="playlist-download btn">Download</a></li>');
	playlistBtn.on('click', function () {
		var songs = [];
		$('.song-json').each(function () {
			songs.push(JSON.parse($(this).text()))
		});
		downloadSetOfSongsAsZip(songs, $('.page-title').text() + bitrateString);
	});
	$('.playlist .page-header .actions').prepend(playlistBtn);
};
//#endregion

//#region // Add Download Quality selector on the Menu..
var createDownloadQuality = function () {
	var self = this;
	var menuItem = $('<aside id="quality-dropdown" class="c-dropdown u-margin-right@sm"><div class="c-dropdown__header"><span class="c-dropdown__type"><span class="u-visible-visually@lg"></span>Qiality</span> <span class="c-dropdown__select curr-down-rate"></span></div></aside>');
	var dropDown = $('<div class="c-dropdown__content"><div class="u-padding@sm"><h5 class="u-deci u-margin-bottom-none@sm">Download Quality</h5><p class="u-centi u-color-js-gray-alt-light u-margin-bottom-none@sm"><em>Pick the biterate of the songs you want to download</em></p></div><div class="o-message o-message--error">You must select a bitrate</div></div>');
	var dropDownList = $('<form id="song-biterate"><section class="u-scroll u-3/5-max-vh"><ul class="o-list-select"></ul></section></form>');
	var bitrates = ['320', '192', '128', '64', '32', '16'];
	menuItem.find('.curr-down-rate').first().text(localStorage.download_bitrate + " kbps");
	bitrates = bitrates.map(function (rate) {
		var el = $('<li class="o-list-select__item" ><a>' + rate + ' kbps</a></li>');
		if (rate === localStorage.download_bitrate) el.addClass('selected')
		el.on('click', function () {
			localStorage.download_bitrate = rate;
			$(this).parent().find('.selected').each(function () {
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

//#region // Run on Plugin Initialization
var initPlugin = function () {
	addDownloadButtonToAllSongs();
	addAlbumDownloadButton();
	addPlaylistDownloadButton();
};
var hideAds = function () {
	$('body').removeClass('promo')
	$('.banner').removeClass('banner')
	const ads = ['.ad', '.c-promo', '.c-ad', '.c-banner']
	ads.forEach(el => $(el).remove())
};

$(document).ready(function () {
	hideAds();
	setTimeout(function () { initPlugin(); }, 2000);
	createDownloadQuality();
	// check if classes of the .page-wrap changes then add the buttons again
	var oldSongListLen = 0;
	var inter = setInterval(function () {
		if ($('ol.o-list-bare').find('li').length) {
			var songListLen = $('ol.o-list-bare').find('li').length;
			if (songListLen !== oldSongListLen) initPlugin(), hideAds();
			oldSongListLen = songListLen;
		}
	}, 2000);
});
//#endregion

//#region // Toast Alert
var toast = function (message) {
	$('<div class="c-toast__msg" />').html(message)
		.appendTo($('<div class="c-toast__row" />')
			.appendTo($('.c-player+.c-toast')))
	var msgContainer = $('.c-player+.c-toast .c-toast__row')
	setTimeout(() => msgContainer.addClass('active'), 0)
	setTimeout(() => {
		msgContainer.removeClass('active')
		msgContainer.on('animationend transitionend', e => e.target.remove())
	}, 3000)
}
//#endregion
