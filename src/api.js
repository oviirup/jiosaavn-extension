const proxy = 'http://localhost:3000'
// const proxy = 'http://saavnex.vercel.app'

// Uppercase first letter
const _c = str => str[0].toUpperCase() + str.slice(1)
// Sanitize api request
const _json = (R) => {
	const str = JSON.stringify(R)
		.replace(/&amp/gi, '&').replace(/&copy/gi, '©')
		.replace(/&#039\;|&quot\;/gi, "'")
		.replace(/150x150/g, '500x500')
		.replace('http://c.saavncdn.com/', '')
		.replace('http://preview.saavncdn.com/', '')
	return JSON.parse(str)
}
/**
 * Sanitize fetched data
 * @param { Object } d object data to sanitize
 * @param { 'song' | 'album' | 'playlist' } type 
 * @param { Number | false } i either index the  song
 * @returns Object | null
 */
const _song = (d, type, i = false) => {
	if (type === 'song') {
		const { id, image, year, ...s } = d.songs ? d.songs[0] : d
		const url = s.media_preview_url?.replace('_p.mp4', '.mp4')

		let info = {
			id, image, year, url, type,
			title: _c(s.song),
			album: _c(s.album),
			artists_p: _c(s.primary_artists),
			artists: s.singers,
			language: 'Soundtrack',
		}
		if (i)
			info.track = i
		if (s.disabled && s.disabled == 'true')
			info.disabled = s.disabled
		if (s.language && s.language !== 'unknown')
			info.language = _c(s.language)
		return info
	} else {
		let songs = []
		d.songs.forEach((s, i) => songs.push(_song(s, 'song', ++i)))
		console.log(d.songs);
		return ({
			type, songs,
			image: d.image,
			id: d.albumid || d.listid,
			title: d.title || d.listname,
		})
	}
}

/**
 * Get Song data
 * @param {HTMLElement} button 
 * @param {'song'|'album'|'playlist'} type 
 * @param {string} token 
 * @param {function|null} callback 
 * @returns Object | null
 */
const getSongsData = (type, token, callback = () => { }) => {
	const data = {
		type, token,
		api_version: 3,
	}
	let result = false
	// Call to saavn server
	$.ajax({
		url: 'https://www.jiosaavn.com/api.php?__call=webapi.get&ctx=wap6dot0&n=-1&_format=json&_marker=0',
		dataType: "json",
		data,
		success: (res) => result = _json(_song(res, type))
	}).always(() => {
		console.log('songs =>', result)
		callback(result)
	})
}

/**
 * URL sanitization
 */
const _url = (url) => ({
	song: () => {
		const bit = localStorage.bitrate || '96'
		const ext = url.replace(/(.*)_96\.(mp\d|aac)/, `$1_${bit}.$2`)
		return `${proxy}/song/${ext}`
	},
	image: () => {
		const ext = url.replace('https://c.saavncdn.com/', '')
		return `${proxy}/image/${ext}`
	}
})

// Sanitize file name
const _file = str => str.replace(/\./g, ',').replace(/\//g, "_")