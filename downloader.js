// Convert Bytes
var bytesToSize = function (a, b) {
	if (0 === a) return "0 Bytes";
	var c = 1024,
		d = b || 2,
		e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
		f = Math.floor(Math.log(a) / Math.log(c));
	return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}
// Capitalise String
var capitalise = function (string) {
	const capital = string.charAt(0).toUpperCase() + string.slice(1)
	return capital;
}
// Get biterate
if (!localStorage.download_bitrate) localStorage.download_bitrate = '320';
var bitrateString = " [" + localStorage.download_bitrate + " kbps]";

// Get Downlaod URL from Server
var getDownloadURL = function (song, callback) {
	var postData = { "query": song };
	toast("Now Downloading Your Song")
	$.ajax({
		type: "GET",
		url: "https://songapi.thetuhin.com/api/link/", //using https://github.com/cachecleanerjeet/JiosaavnAPI
		crossDomain: true,
		dataType: "json",
		data: postData,
		success: function (result) {
			console.log(result);
			callback(result, 'success');
		},
		error: function (result) {
			callback(result, 'error');
			toast("Something Went Wrong !")
		}
	})
};

// Get URL Response as an ArrayBuffer Object
var getURLArrayBuffer = function (url, onload) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function () {
		if (xhr.status === 200)
			onload(xhr.response)
		else
			toast("Requested Url is Forbiden !");
	};
	xhr.onerror = function () {
		toast("Cannot reach Server, Network Error !");
	};
	xhr.send();
};


// Download a Single song with ID3 Meta Data (Song Album art and Artists)
var downloadWithData = function (songData, callback) {
	getSongBlob(songData, false, function (blob) {
		// File Name format
		saveAs(blob, songData.song + '.mp3');
		callback();
	});

};

// Get Async Downloaded blob of the a Single Song
var getSongBlob = function (song, bit, callback) {
	if (!bit) bit = localStorage.download_bitrate;
	var songCoverUrl = song.image;
	songCoverUrl = songCoverUrl.replace('c.saavncdn.com', 'corsdisabledimage.tuhinwin.workers.dev');
	console.log("Cover art => ", songCoverUrl);
	getURLArrayBuffer(songCoverUrl, function (coverArrayBuffer) {
		var songUrlraw = song.media_url;
		var songUrl = songUrlraw.replace('aac.saavncdn.com', 'corsdisabledsong.tuhinwin.workers.dev');
		var lastUnderscoreIndex = songUrl.lastIndexOf('_');
		if (bit == '128') {
			songUrl = songUrl.substr(0, lastUnderscoreIndex) + '.mp3';
		} else if (bit == '192') {
			songUrl = songUrl.substr(0, lastUnderscoreIndex) + '.mp3';
		} else {
			songUrl = songUrl.substr(0, lastUnderscoreIndex) + '_' + bit + '.mp3';
		}
		console.log("SongURL =>", songUrl);
		getURLArrayBuffer(songUrl, function (arrayBuffer) {
			const writer = new ID3Writer(arrayBuffer);
			writer.setFrame('TIT2', song.song)
				.setFrame('TPE1', song.primary_artists.split(', '))
				.setFrame('TCOM', [song.singers]) //note this for later
				.setFrame('TALB', song.album)
				.setFrame('TYER', song.year)
				.setFrame('TPUB', song.label)
				.setFrame('TCON', [capitalise(song.language)])
				.setFrame('TBPM', bit)
				.setFrame('APIC', {
					type: 3,
					data: coverArrayBuffer,
					description: song.song
				});
			writer.addTag();
			const blob = writer.getBlob();
			callback(blob);
		})
	});
};

// Download Set of Songs as a Zip
var downloadSetOfSongsAsZip = function (songs, name) {
	var zip = new JSZip();
	// create a folder in the name of album
	var album = zip.folder(name);
	var zipStat = downloadStatus.createRow();
	var albumStatus = 'Album : ' + name + " : Download in Progress";
	zipStat.status(albumStatus);
	songs.forEach(function (song, index) {
		// get the download url of song
		getDownloadURL(song, function (result, status) {
			if (status === 'success') {
				// get a single song blob
				getSongBlob(song, false, result.auth_url, function (blob) {
					album.file(song.title + '.mp3', blob);
					// check if all files are downloaded
					if (index + 1 === songs.length) {
						zipStat.status("Compressing & Zipping the Downloads");
						downloadZip(zip, name, function () {
							zipStat.status("Download Complete", true);
							zipStat.flushAll();
						});
					}
				}, false, true);
			}
		})
	});
};

// Update a Status of Download Queue and Stuff
// TODO : Bug when downloading Albums.. or Playlist
var downloadStatus = function () {
	var downStatus, downStatusWrapper;
	return {
		create: function () {
			$('.download-status-wrapper').remove();
			downStatusWrapper = $('<div class="download-status-wrapper"></div>');
			$('.c-player').prepend(downStatusWrapper);
		},
		createRow: function () {
			downStatus = $('<div class="download-status"> <span class="progress"></span><p class="status-text"></p><p class="status-right"></p></div>');
			downStatus.hide();
			downStatusWrapper.append(downStatus);
			return this;
		},
		el: function () {
			return downStatus;
		},
		hide: function () {
			downStatus.hide();
		},
		show: function () {
			downStatus.show();
		},
		progress: function (value) {
			downStatus.find('.progress').first().width(value + "%")
		},
		clear: function () {
			downStatus.find('p.status-text').first().html("");
			downStatus.find('p.status-right').first().html("");
		},
		reset: function () {
			this.clear();
			this.hide();
			this.progress(0);
		},
		flush: function () {
			downStatus.remove();
		},
		flushAll: function () {
			$('.download-status').remove();
		},
		status: function (message, hide) {
			this.show();
			if (hide) {
				this.reset();
				this.flush();
			} else {
				downStatus.find('p.status-text').first().html(message + "<span>.</span><span>.</span><span>.</span>")
			}
		},
		statusRight: function (message, hide) {
			var self = this;
			if (hide) {
				this.progress(100);
				setTimeout(function () {
					self.reset();
				}, 1500);
			}
			downStatus.find('p.status-right').first().html(message)
		}
	}
}();

// Download a Zip blob as File via FileSaver
var downloadZip = function (zip, name, callback) {
	zip.generateAsync({
		type: "blob"
	})
		.then(function (blob) {
			saveAs(blob, name);
			callback();
		});
};

// Show Song Download Progress
var singleShowSingleSongProgress = function (xhr, statusObject) {
	xhr.addEventListener("progress", updateProgress);
	xhr.addEventListener("load", transferComplete);
	function updateProgress(e) {
		var percentComplete = e.loaded / e.total;
		if (statusObject) {
			statusObject.statusRight(bytesToSize(e.loaded, 2) + "/" + bytesToSize(e.total, 2));
			statusObject.progress(percentComplete * 100);
		}
	}
	function transferComplete(e) {
		statusObject.reset();
		statusObject.flush();
	}
};
