import Browser from 'webextension-polyfill'
import type { ApiV3, Song, List, Bitrate } from './types'

/** Uppercase first letter */
export function _c(
	str: string
): string {
	str = str?.trim()
	return str && str.charAt(0).toUpperCase() + str.slice(1)
}

/** Sanitise File name */
export function _file(
	str: string,
	ext?: string
): string {
	str = str
		.trim()
		.replace(/"/g, "'")
		.replace(/[^a-z0-9!@#$%^&()_+=_\-{}\'\[\],.~\s]/gi, '_')
	return ext ? `${str}.${ext}` : str
}

/** Name Format */
export function _file_song(
	song: Song,
	bitrate: Bitrate,
	format?: string
): string {
	if (!format) format = '$title'
	const { title, artist, album_artist, track, album, genre, year } = song
	const fileName = format
		.replace(/\$title/g, title)
		.replace(/\$artist/g, artist.join(', '))
		.replace(/\$album_artist/g, album_artist.join(', '))
		.replace(/\$album/g, album)
		.replace(/\$track/g, String(track))
		.replace(/\$genre/g, genre)
		.replace(/\$bitrate/g, String(bitrate))
		.replace(/\$year/g, String(year))
	return _file(fileName, 'm4a')
}

/** Modifies the JSON output from JioSaavn API */
export function _json(obj: object): object {
	const string = JSON.stringify(obj)
		.replace(/&amp;?/gi, '&')
		.replace(/&copy;?/gi, '©')
		.replace(/&#039;?|&quot;?/g, "'")
		.replace(/http:/g, 'https:')
		.replace(/preview\.saavn/g, 'aac.saavn')
		.replace(/150x150\.jpg/g, '500x500.jpg')
	return JSON.parse(string)
}

/** Sanitise API output */
export function _song(
	data: any,
	type: 'song' | 'album' | 'palylist',
	track?: number,
	genre?: string
): Song | List {
	data = _json(data)
	if (type === 'song') {
		// Get song data
		const d: ApiV3.song = data.songs ? data.songs[0] : data
		const { id, label, year, image, ...s } = d

		const url = s.media_preview_url?.replace(/96_p\.mp4$/, '96.mp4')
		const getURL = (bit: number): string => url?.replace(/96\.mp4$/, `${bit}.mp4`)
		// prettier-ignore
		return {
			id, image, track, year, label, url, getURL,
			title: _c(s.song),
			album: _c(s.album),
			artist: s.singers?.split(',').map(_c),
			album_artist: s.primary_artists.split(',').map(_c),
			genre: genre || _c(s.language || 'Soundtrack'),
		}
	} else {
		// Get Album / Playlist data
		let songs: Song[] = data.songs.map((s: ApiV3.song, i: number) => {
			return _song(s, 'song', ++i)
		})
		return {
			songs,
			image: data.image,
			title: data.title || data.listname,
		}
	}
}


export const storage = {
	get: async (...args: string[]) => {
		return await Browser.storage.sync.get(args)
	},
	set: (args: Record<string, any>) => {
		return Browser.storage.sync.set(args)
	},
}
