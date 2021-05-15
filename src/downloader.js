//#region //* sanitize
// sanitize name
const __c = str => {
	str = str.charAt(0).toUpperCase() + str.slice(1)
	str = str.replace(/&#039\;|&quot/g, "'").replace(/\//g, "_")
	return str
}
// check availability
const __isAvailable = (song) => {
	let available = true
	if (!song.media_preview_url) available = false
	if (song.disabled === 'true') available = false
	return available
}
// Get Song Data
const songData = (song, i) => {
	if (!__isAvailable(song)) return
	const url = song.media_preview_url.replace('preview.saavncdn.com', 'aac.saavncdn.com')
	const array = {
		id: song.id,
		title: __c(song.song),
		album: __c(song.album),
		prim_artists: song.primary_artists,
		singers: song.singers,
		image: song.image,
		url: url.replace('_96_p', '_160'),
		hd: song["320kbps"] === "true",
		year: song.year,
		date: song.release_date,
		buffer_url: { "96": url, "160": url.replace('_96_p', '_160'), "320": url.replace('_96_p', '_320') },
	}
	if (i) array.track = i
	if (song.language && song.language != "unknown")
		array["language"] = __c(song.language)
	return array
}
// Get Songs Array
const songsArray = (source, track = false) => {
	var songs = [], i = 1
	source.forEach((song) => {
		if (__isAvailable(song))
			songs.push(songData(song, track && i++))
	})
	return songs
}

// sanitize response JSON
const __json = (response) => JSON.parse(JSON.stringify(response).replace(/&amp/gi, "&").replace(/&copy/gi, "©").replace(/150x150/gi, "500x500").replace(/&#039/, "'"))
//#endregion

//#region //* Get Download URL from Server
// get ID from token
const getTheID = (token, type) => {
	const url = `https://www.jiosaavn.com/api.php?__call=webapi.get&ctx=wap6dot0&api_version=4&_format=json&_marker=0%3F_marker%3D0&type=${type}&token=${token}`
	const id = fetch(url).then(res => res.json()).then(res => type == "song" ? res.songs[0].id : res.id)
	return id
}
// Download Playlist or Album
const getSongsData = async (type, token, callback = () => { }) => {
	// get the id
	var id = await getTheID(token, type), data = {}, result = false
	// Create data accordingly
	if (type === "album") data = { "albumid": id, "__call": "content.getAlbumDetails" }
	if (type === "playlist") data = { "listid": id, "__call": "playlist.getDetails" }
	if (type === "song") data = { "pids": id, "__call": "song.getDetails" }
	// Call to saavn server
	$.ajax({
		url: "https://www.jiosaavn.com/api.php?_format=json&_marker=0",
		dataType: "json", data,
		success: (res, status) => {
			if (status !== 'success') return
			res = __json(res)
			// organize the response
			if (type === "song") {
				if (!__isAvailable(res[id])) return
				result = songData(res[id])
			} else {
				const songs = songsArray(res.songs, type === "album")
				result = songs && {
					songs, type,
					id: res.albumid || res.listid,
					title: res.title || res.listname,
					image: res.image,
				}
			}
		}
	}).always(() => {
		console.log('songs =>', result)
		callback(result)
	})
}
//#endregion

//#region //* XHR Request
const getURLArrayBuffer = (url, onLoad = () => { }, onProgress = () => { }, onError = () => { }) => {
	const xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.responseType = 'arraybuffer'
	if (onProgress) xhr.onprogress = e => {
		const progress = e.loaded / e.total
		onProgress(progress < 1 ? progress : false)
	}
	xhr.onload = () => {
		if (xhr.status === 200) onLoad(xhr.response)
		else {
			onProgress(false)
			onError()
		}
	}
	xhr.send()
}
//#endregion

//#region //* Get Async Downloaded blob of the a Single Song
const getSongBlob = (song, onSuccess = () => { }, onError = () => { }) => {
	// Get bitrate
	const bit = parseInt(localStorage.bitrate)
	// get cover image
	var coverUrl = song.image.replace('c.saavncdn.com', 'corsdisabledimage.tuhinwin.workers.dev')
	getURLArrayBuffer(coverUrl, (cover) => {
		const url_raw = song.url.replace('aac.saavncdn.com', 'corsdisabledsong.tuhinwin.workers.dev')
		// create extension based on bitrate
		var extension = '.mp3'
		if (bit <= 64 || (bit == 320 && song.hd)) extension = `_${bit}.mp3`
		// sanitize url of the song
		const songUrl = url_raw.substr(0, url_raw.lastIndexOf('_')) + extension
		getURLArrayBuffer(songUrl, (arrayBuffer) => {
			const writer = new ID3Writer(arrayBuffer)
			const { title, album, prim_artists, singers, year, language, track, label = '' } = song
			if (language) writer.setFrame('TCON', [__c(language)])
			if (track) writer.setFrame('TRCK', track)
			writer.setFrame('TIT2', title)
				.setFrame('TPE2', prim_artists.split(', '))
				.setFrame('TPE1', singers.split(', '))
				.setFrame('TALB', album)
				.setFrame('TYER', year)
				.setFrame('TBPM', bit)
				.setFrame('TPUB', label)
				.setFrame('APIC', { type: 3, data: cover, description: title })
			writer.addTag()
			const blob = writer.getBlob()
			onSuccess(blob)
		},
			(value) => showProgress(song.title, song.id, value),
			() => onError()
		)
	})
}
//#endregion

//#region //* Download a Single song with ID3 Meta Data (Song Album art and Artists)
const downloadWithData = (song, onSuccess = () => { }, onError = () => { }) => {
	getSongBlob(
		song,
		(blob) => {
			saveAs(blob, `${song.title}.mp3`)
			onSuccess()
		},
		() => onError()
	)
}
//#endregion

//#region //* Download Set of Songs as a Zip
const downloadSongsAsZip = function (list, onSuccess = () => { }, onError = () => { }) {
	const { title, songs, image } = list, n = songs.length
	if (n === 0) return onError()
	// create a zip
	var zip = new JSZip()
	var a = 0, b = 0, err = {}
	// Download cover image for albums
	if (list.type == 'playlist' && image.includes('c.saavncdn.com')) {
		var cover = image.replace('c.saavncdn.com', 'corsdisabledimage.tuhinwin.workers.dev')
		getURLArrayBuffer(cover, (image) => zip.file(`_cover_.jpg`, image))
	}
	const count = () => $('#download-bar label').attr({ 'data-a': a, 'data-c': n })
	count()
	// get song blob
	songs.forEach((song, i) => {
		getSongBlob(
			song,
			(blob) => { ++a; count(); zip.file(`${song.title}.mp3`, blob) },
			() => { ++b; err = { ...err, [`${i + 1}`]: song.title } })
	})
	// Download the zip file
	const download = setInterval(() => {
		$('#download-bar label').attr({ 'data-a': a, 'data-c': n })
		if (a + b !== n) return
		clearInterval(download)
		if (b === n) onError(err)
		else if (a !== 0) setTimeout(() => {
			zip.generateAsync({ type: "blob" }).then((blob) => saveAs(blob, title))
			onSuccess(err)
		}, 1000);
	}, 500)
	download
}
//#endregion

//#region //* Download a Zip blob as File via FileSaver
const downloadZip = (zip, name, callback = () => { }) => {
	zip.generateAsync({ type: "blob" })
		.then((blob) => {
			saveAs(blob, name)
			callback()
		})
}
//#endregion

//#region //* Show Progress
const showProgress = (name, id, value) => {
	const bar = $('#download-bar')
	if (bar.find(`#${id}`).length == 0) {
		const wrapper = $(`<div id="${id}" class="download-wrapper" style="--p:0.15"><div class="wrap"><svg class="progress" viewbox="0 0 24 24"><circle cx="12" cy="12" r="11"/><circle cx="12" cy="12" r="11"/><path d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><p class="u-centi u-ellipsis u-color-js-gray-alt-light">${name}</p></div></div>`)
		bar.find('.body-scroll').append(wrapper)
	}
	const progress = $(`#download-bar #${id}`)
	progress.css("--p", value)
	bar.addClass('active')
	if (!value) {
		progress.addClass('done hide')
		setTimeout(() => { progress.remove() }, 3250)
	}
}
//#endregion