
/**
 * Get Song data
 * @param { 'song' | 'album' | 'playlist' } type
 * @param { string } token
 * @param { function } callback
 * @returns Object | null
 */
const get_songs_data = async (type, token) => {
	let result = false,
		url = 'https://www.jiosaavn.com/api.php?__call=webapi.get&_marker=0&ctx=web6dot0',
		data = { _format: 'json', n: -1, p: 1, api_version: 3, token, type, }
	await $.ajax({
		url, data, dataType: 'json',
		success: (res) => (result = _song(_json(res), type))
	})
	return result
}



const fetch_song = async (song) => {
	const { url } = song
	const blob = await fetch(url).then(e => {
		return e.status < 400 && e.blob()
	})
	return blob
}

const download_song = async (song, done = () => { }) => {
	const blob = await fetch_song(song)
	done()
	saveAs(blob, _file(song.title) + ext)
}

const download_list = async (data, done = () => { }) => {
	console.log(data);
	const { songs, title } = data
	if (songs.length < 1) return
	var zip = new JSZip()
	// add file to zip
	for (let i = 0; i < songs.length; i++) {
		const { title } = songs[i];
		const blob = await fetch_song(songs[i])
		if (blob) zip.file(_file(title) + ext, blob)
	}
	done()
	// Create ZIP file
	zip.generateAsync({ type: "blob" })
		.then((blob) => saveAs(blob, _file(title)))
}