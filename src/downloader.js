// const proxy = '//localhost:3000'
const proxy = '//saavnex.vercel.app'

//#region API Request Sanitization
// Uppercase first letter
const _c = (str) => str[0].toUpperCase() + str.slice(1)
// Sanitize file name
const _file = (str) => str.replace(/\./g, ',').replace(/\//g, '_')
// Sanitize api request
const _json = (R) => {
	const string = JSON.stringify(R)
		.replace(/&amp/gi, '&')
		.replace(/&copy/gi, '©')
		.replace(/&#039\;|&quot\;/g, "'")
		.replace(/150x150/gi, '500x500')
		.replace('//c.saavncdn.com', `${proxy}/image`)
		.replace('//preview.saavncdn.com', `${proxy}/song`)
	return JSON.parse(string)
}
// Get song data and sanitize
const _song = (d, type, i = false) => {
	if (type === 'song') {
		// Get Single song data
		const { image, label, language = 'Soundtrack', ...s } = d.songs[0] || d
		const url = s.media_preview_url?.replace('96_p.mp4', '96.mp4')
		let array = {
			image, url, label,
			title: _c(s.song),
			album: _c(s.album),
			artists_p: _c(s.primary_artists),
			artists: s.singers,
			language: 'Soundtrack',
		}
		if (i) array.track = i
		if (s.disabled && s.disabled == 'true') array.disabled = s.disabled
		if (s.language && s.language !== 'unknown') array.language = _c(s.language)
		return array
	} else {
		// Get Album / Playlist data
		let songs = []
		d.songs.forEach((s, i) => songs.push(_song(s, 'song', ++i)))
		return {
			songs,
			image: d.image,
			title: d.title || d.listname,
		}
	}
}
//#endregion

/**
 * Get Song data
 * @param { 'song' | 'album' | 'playlist' } type
 * @param { string } token
 * @param { function } callback
 * @returns Object | null
 */
const get_songs_data = async (type, token) => {
	let result = false,
		url = 'https://www.jiosaavn.com/api.php',
		data = {
			__call: 'webapi.get', _marker: 0,
			ctx: 'web6dot0', _format: 'json',
			api_version: 3, token, type,
		}

	await $.ajax({
		url, data, dataType: 'json',
		success: (res) => (result = _song(_json(res), type))
	})
	return result
}

const download_song = async (song) => {
	const { url, title, album, artists_p, artists, year, label } = song
	const buffer = await (await fetch(url)).arrayBuffer()
	const blob = new Blob([buffer], { type: 'audio/mp4' })
	saveAs(blob, `${title}.m4a`)
}