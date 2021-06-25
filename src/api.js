const _c = str => str[0].toUpperCase() + str.slice(1)
const _json = (R) => JSON.parse(JSON.stringify(R).replace(/&amp/gi, "&").replace(/&copy/gi, "©").replace(/150x150/gi, "500x500").replace(/http:\/\//gi, 'https://').replace(/&#039\;|&quot\;/g, "'"))
const _song = (d, type, i = false) => {
	if (type === 'song') {
		const { id, image, label, year, ...s } = d.songs ? d.songs[0] : d
		const url = s.media_preview_url?.replace(/(.*)preview.saavncdn(.*)_96_p.mp4/, '$1aac.saavncdn$2_96.mp4')
		let array = {
			id, image, label, year, url, type,
			title: _c(s.song),
			album: _c(s.album),
			artists_p: _c(s.primary_artists),
			artists: s.singers,
			language: 'Soundtrack',
			token: s.perma_url?.replace(/.*\/(.*)/, '$1'),
			hd: s["320kbps"] === "true",
			dolby: s["is_dolby_content"],
		}
		if (i) array.track = i
		if (s.disabled && s.disabled == 'true') array.disabled = s.disabled
		if (s.language && s.language !== "unknown") array.language = _c(s.language)
		return array
	} else {
		let songs = []
		d.songs.forEach((s, i) => songs.push(_song(s, 'song', ++i)))
		console.log(d.songs);
		return ({
			type, songs,
			image: d.image,
			token: d.perma_url?.replace(/.*\/(.*)/, '$1'),
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