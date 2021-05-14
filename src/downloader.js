//#region //* sanitise
// capitalise
const __c = str => {
	str = str.charAt(0).toUpperCase() + str.slice(1)
	str = str.replace(/&#039;|&quot;/g, "'").replace(/\//g, "_")
	return str
};
// Get Song Data
const songData = (song, i) => {
	const url = song.media_preview_url.replace('preview.saavncdn.com', 'aac.saavncdn.com');
	const array = {
		id: song.id,
		title: __c(song.song),
		album: __c(song.album),
		prim_artists: song.primary_artists,
		singers: song.singers,
		image: song.image,
		url: url.replace('_96_p', '_160'),
		hd_content: song["320kbps"],
		year: song.year,
		date: song.release_date,
		buffer_url: { "96": url, "160": url.replace('_96_p', '_160'), "320": url.replace('_96_p', '_320') },
	}
	// inclusion list
	if (i) array.track = i;
	// Check if the language is empty
	if (song.language && song.language != "unknown") array["language"] = __c(song.language)
	return array;
}
// Get Songs Array
const songsArray = (source, track) => {
	var songs = [], i = 1;
	// get list of songs
	source.forEach((song) => songs.push(songData(song, track && i++)));
	return songs;
}

// sanitise response JSON
const responseJSON = (response) => JSON.parse(JSON.stringify(response).replace(/&amp;/gi, "&").replace(/&copy;/gi, "©").replace(/150x150/gi, "500x500").replace(/&#039;/, "'"));
//#endregion

//#region //* Get Downlaod URL from Server
// get ID from token
const getTheID = (token, type) => {
	const url = `https://www.jiosaavn.com/api.php?__call=webapi.get&ctx=wap6dot0&api_version=4&_format=json&_marker=0%3F_marker%3D0&type=${type}&token=${token}`;
	const id = fetch(url).then(res => res.json()).then(res => type == "song" ? res.songs[0].id : res.id)
	return id
}
// Dwonload Playlist or Album
const getSongsData = async (type, token, callback) => {
	// get the id
	var id = await getTheID(token, type), data = {}
	// Create data accordingly
	if (type == "album") data = { "albumid": id, "__call": "content.getAlbumDetails" }
	if (type == "playlist") data = { "listid": id, "__call": "playlist.getDetails" }
	if (type == "song") data = { "pids": id, "__call": "song.getDetails" }
	// Call to saavn server
	$.ajax({
		url: "https://www.jiosaavn.com/api.php?_format=json&_marker=0",
		dataType: "json", data,
		success: (res) => {
			res = responseJSON(res)
			var result = {}
			if (type == "song") result = songData(res[id])
			else result = {
				id: res.albumid || res.listid,
				title: res.title || res.listname,
				image: res.image,
				songs: songsArray(res.songs, type == "album"),
				type,
			}
			console.log('songs =>', result);
			callback(result)
		},
		error: () => callback()
	});
}
//#endregion

//#region //* XHR Request
// Get URL Response as an ArrayBuffer Object
const getURLArrayBuffer = (url, onload, onprogress, onerror) => {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
	if (onprogress) xhr.onprogress = e => {
		const progress = e.loaded / e.total;
		onprogress(progress < 1 ? progress : false);
	};
	xhr.onload = () => {
		if (xhr.status === 200) {
			onload(xhr.response)
		} else {
			onprogress && onprogress(false);
			onerror && onerror();
		}
	};
	xhr.send();
};
//#endregion

//#region //* Get Async Downloaded blob of the a Single Song
const getSongBlob = (song, success, error) => {
	// Get biterate
	const bit = parseInt(localStorage.download_bitrate);
	// get cover image
	var cover = song.image.replace('c.saavncdn.com', 'corsdisabledimage.tuhinwin.workers.dev');
	getURLArrayBuffer(cover, (coverArrayBuffer) => {
		const url_raw = song.url.replace('aac.saavncdn.com', 'corsdisabledsong.tuhinwin.workers.dev')
		// ctreate extension based on bitrate
		var extension = '.mp3'
		if (bit <= 64 || (bit == 320 && song.hd_content)) extension = `_${bit}.mp3`;
		// sanitise url of the song
		const songUrl = url_raw.substr(0, url_raw.lastIndexOf('_')) + extension;
		getURLArrayBuffer(songUrl, (arrayBuffer) => {
			const writer = new ID3Writer(arrayBuffer);
			const { title, album, prim_artists, singers, year, language, track, label = '' } = song
			if (language) writer.setFrame('TCON', [__c(language)]);
			if (track) writer.setFrame('TRCK', track)
			writer.setFrame('TIT2', title)
				.setFrame('TPE2', prim_artists.split(', '))
				.setFrame('TPE1', singers.split(', '))
				.setFrame('TALB', album)
				.setFrame('TYER', year)
				.setFrame('TBPM', bit)
				.setFrame('TPUB', label)
				.setFrame('APIC', { type: 3, data: coverArrayBuffer, description: title });
			writer.addTag();
			const blob = writer.getBlob();
			success(blob);
		},
			(value) => showProgress(song.title, song.id, value),
			() => error && error()
		);
	});
};
//#endregion

//#region //* Download a Single song with ID3 Meta Data (Song Album art and Artists)
const downloadWithData = (song, onSuccess, onError) => {
	getSongBlob(
		song,
		(blob) => {
			// Save file
			saveAs(blob, `${song.title}.mp3`);
			onSuccess && onSuccess();
		},
		() => { onError && onError() }
	)
};
//#endregion

//#region //* Download Set of Songs as a Zip
const downloadSongsAsZip = function (list, onSuccess = () => { }, onError = () => { }) {
	const { title, songs, image } = list
	// create a zip
	var zip = new JSZip()
	var a = 0, b = 0, c = 0
	// Download cover image for albums
	if (list.type == 'playlist') {
		var cover = image.replace('c.saavncdn.com', 'corsdisabledimage.tuhinwin.workers.dev');
		getURLArrayBuffer(cover, (image) => {
			zip.file(`_cover_.jpg`, image);
		})
	}
	songs.forEach((song) => {
		// get a single song blob
		getSongBlob(
			song,
			(blob) => {
				zip.file(`${song.title}.mp3`, blob)
				++a
				if ((a + b) === songs.length && a !== 0) setTimeout(() => {
					downloadZip(zip, title)
					onSuccess()
					if (b !== 0) toast('Some of the songs are not downloaded')
				}, 1000)
			},
			() => {
				if (++b === songs.length) onError()
			})
	})
}
//#endregion

//#region //* Download a Zip blob as File via FileSaver
const downloadZip = (zip, name, callback) => {
	zip.generateAsync({ type: "blob" })
		.then((blob) => {
			saveAs(blob, name);
			callback();
		});
};
//#endregion

//#region //* Show Progress
const showProgress = (name, id, value) => {
	if ($('#download-bar').find(`#${id}`).length == 0) {
		const wrapper = $(`<div id="${id}" class="download-wrapper" style="--p:0.15"><div class="wrap"><svg class="progress" viewbox="0 0 24 24"><circle cx="12" cy="12" r="11"/><circle cx="12" cy="12" r="11"/><path d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><p class="u-centi u-ellipsis u-color-js-gray-alt-light">${name}</p></div></div>`)
		$('#download-bar .body-scroll').append(wrapper)
	}
	const progress = $(`#download-bar #${id}`)
	progress.css("--p", value)
	$('#download-bar').addClass('active')
	if (!value) {
		progress.addClass('done hide')
		setTimeout(() => { progress.remove() }, 3250);
	}
}
//#endregion