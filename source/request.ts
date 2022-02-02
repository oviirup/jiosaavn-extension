import axios from 'axios'
import { ApiV3, Song, List } from './types'

/** Uppercase first letter */
export function _c(str: string): string {
	str = str.trim()
	return str.charAt(0).toUpperCase() + str.slice(1)
}
/** Modifies the JSON output from JioSaavn API */
export function _json(R: any): Object {
	const string = JSON.stringify(R)
		.replace(/&amp;?/gi, '&')
		.replace(/&copy;?/gi, '©')
		.replace(/&#039;?|&quot;?/g, "'")
		.replace(/http:/g, 'https:')
		.replace(/preview\.saavn/g, 'aac.saavn')
	return JSON.parse(string)
}

// prettier-ignore
/** Sanitise API output */
export function _song (
	data: any,
	type: 'song' | 'album' | 'palylist',
	track?: number,
	genre?: string
) {
	if (type === 'song') {
		// Get song data
		const d: ApiV3.song = data.songs ? data.songs[0] : data
		const { id, label, year, image, ...s } = d

		const url = s.media_preview_url?.replace(/96_p\.mp4$/, '96.mp4')
		const getURL = (bit: number): string => url.replace(/96\.mp4$/, `${bit}.mp4`)
		// prettier-ignore
		return {
			id, image, track, year, label, url, getURL,
			title: _c(s.song),
			album: _c(s.album),
			artist: s.singers.split(',').map(_c),
			album_artist: s.primary_artists.split(',').map(_c),
			genre: genre || _c(s.language || 'Soundtrack'),
		} as Song
	} else {
		// Get Album / Playlist data
		let songs: Song[] = data.songs.map((s: ApiV3.song, i: number) => {
			return _song(s, 'song', ++i)
		})
		return {
			songs,
			image: data.image,
			title: data.title || data.listname,
		} as List
	}
}

// prettier-ignore
/** Get song data from server */
export async function getSongData(
	token: string,
	type: 'song' | 'album' | 'palylist' = 'song'
) {
	const url = 'https://www.jiosaavn.com/api.php?__call=webapi.get&_marker=0&ctx=web6dot0'
	const params = { _format: 'json', n: -1, p: 1, api_version: 3, token, type }
	const response = await axios
		.get(url, { params })
		.then((res) =>  _json(res.data))
		.catch((e) => undefined)
	return response && _song(response, type)
}
