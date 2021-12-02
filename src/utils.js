// const proxy = 'http//localhost:3000'
const proxy = 'https://saavnex.vercel.app'
const ext = '.m4a'
// Uppercase first letter
const _c = (str) => str[0].toUpperCase() + str.slice(1)

// Sanitize file name
const _file = (str) => str.replace(/\./g, ',').replace(/\//g, '_')

// Sanitize api request
const _json = (R) => {
	const string = JSON.stringify(R)
		.replace(/&amp;?/gi, '&')
		.replace(/&copy;?/gi, '©')
		.replace(/&#039;?|&quot;?/g, "'")
		.replace(/150x150/gi, '500x500')
		.replaceAll('http://c.saavncdn.com', `https://h.saavncdn.com`)
		.replaceAll('http://preview.saavncdn.com', `https://aac.saavncdn.com`)
	return JSON.parse(string)
}

// Get song data and sanitize
const _song = (d, type, track = 3, genre) => {
	if (type === 'song') {
		// Get Single song data
		const { id, label, year, image, ...s } = d.songs ? d.songs[0] : d

		let a = s.singers.replace(/\s(&|&amp;?)\s/, ', ').split(', ')
		let b = a.map(x => x.toLowerCase());
		let artists = a.filter((e, i) => b.indexOf(e.toLowerCase()) !== i)

		let array = {
			id, image, track, artists, year, label,
			url: s.media_preview_url?.replace('96_p.mp4', '320.mp4'),
			title: _c(s.song),
			album: _c(s.album),
			album_artist: s.primary_artists.split(', '),
			genre: genre || _c(s.language || 'Soundtrack')
		}
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

const ff_meta = (s) => {
	let array = []
	Object.entries(s).forEach(([k, v]) => {
		if (!v) return
		array.push('-metadata', `${k}=${String(v)}`)
	})
	return array
}