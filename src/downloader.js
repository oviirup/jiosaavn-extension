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
const getSongBlob = async (song, onSuccess = () => { }, onError = () => { }) => {
	// Get bitrate
	const bit = parseInt(localStorage.bitrate)
	// get cover image
	if (!song.available) return onError()
	var cover = song.image.replace('c.saavncdn.com', 'corsdisabledimage.tuhinwin.workers.dev')
	cover = await (await fetch(cover)).arrayBuffer()
	const url_raw = song.url.replace('aac.saavncdn.com', 'corsdisabledsong.tuhinwin.workers.dev')
	// create extension based on bitrate
	var extension = '.mp3'
	if (bit <= 64 || (bit == 320 && song.hd)) extension = `_${bit}.mp3`
	// sanitize url of the song
	const songUrl = url_raw.substr(0, url_raw.lastIndexOf('_')) + extension
	getURLArrayBuffer(songUrl, (arrayBuffer) => {
		const writer = new ID3Writer(arrayBuffer)
		const { title, album, artists_p, artists, year, language, track, label = '' } = song
		if (language) writer.setFrame('TCON', [_c(language)])
		if (track) writer.setFrame('TRCK', track)
		writer.setFrame('TIT2', title)
			.setFrame('TPE2', artists_p.split(', '))
			.setFrame('TPE1', artists.split(', '))
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
			(blob) => { ++a; count(); zip.file(`${_file(song.title)}.mp3`, blob) },
			() => { ++b; err = { ...err, [`${i + 1}`]: song.title } })
	})
	// Download the zip file
	const download = setInterval(() => {
		$('#download-bar label').attr({ 'data-a': a, 'data-c': n })
		if (a + b !== n) return
		clearInterval(download)
		if (b === n) onError(err)
		else if (a !== 0) setTimeout(() => {
			if (b !== 0) toast('Some songs are not downloaded')
			zip.generateAsync({ type: "blob" }).then((blob) => saveAs(blob, _file(title)))
			onSuccess(err)
		}, 1000);
	}, 500)
	download
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