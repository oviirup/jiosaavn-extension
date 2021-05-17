const _c = str => (str[0].toUpperCase() + str.slice(1)).replace(/\//g, "_")
const _file = str => str.replace(/\./g,',')
const _avl = (song) => (!song.media_preview_url) ? false : (song.disabled === 'true') ? false : true
const _json = (R) => JSON.parse(JSON.stringify(R)
	.replace(/&amp/gi, "&")
	.replace(/&copy/gi, "©")
	.replace(/150x150/gi, "500x500")
	.replace(/http:\/\//gi, 'https://')
	.replace(/&#039\;|&quot\;/g, "'")
)
const _s = (d, type, i = false) => {
	if (type === 'song') {
		const s = d.songs ? d.songs[0] : d
		const url = s.media_preview_url?.replace('preview.saavncdn.com', 'aac.saavncdn.com').replace('_96_p.', '_96.')
		const array = {
			id: s.id,
			title: _c(s.song),
			album: _c(s.album),
			image: s.image,
			artists_p: _c(s.primary_artists),
			artists: _c(s.singers),
			language: 'Soundtrack',
			available: _avl(s),
			label: s.label,
			year: s.year,
			url: url,
			hd: s["320kbps"] === "true",
			dolby: s["is_dolby_content"]
		}
		if (i) array.track = i
		if (s.language && s.language !== "unknown") array["language"] = _c(s.language)
		return array
	} else {
		let songs = []
		d.songs.forEach((s, i) => songs.push(_s(s, 'song', ++i)))
		return ({
			type, songs,
			id: d.albumid || d.listid,
			title: d.title || d.listname,
			image: d.image,
		})
	}

}
// Get songs data
const getSongsData = (type, token, callback = () => { }) => {
	let result = false, data = { type, token, api_version: 3 }
	if (type === 'playlist') data.n = -1
	// Call to saavn server
	$.ajax({
		url: 'https://www.jiosaavn.com/api.php?__call=webapi.get&ctx=wap6dot0&_format=json&_marker=0',
		dataType: "json", data,
		success: (res, status) => { if (status === 'success') result = _json(_s(res, type)) }
	}).always(() => {
		console.log('songs =>', result)
		callback(result)
	})
}

// MORE COMING