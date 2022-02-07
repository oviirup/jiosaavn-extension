import React from 'jsx-dom'
import axios from 'axios'
import { saveAs } from 'file-saver'
import browser from 'webextension-polyfill'
import { ApiV3, Song, List, Bitrate } from './types'
import JSZip from 'jszip'

interface ButtonProps extends React.AllHTMLAttributes<HTMLElement> {
	large?: boolean
}
export function Button(props: ButtonProps) {
	const { large = false, ...attr } = props
	const iconClass = large ? 'c-btn c-btn--tertiary c-btn--ghost c-btn--icon' : 'u-link'
	// prettier-ignore
	return (
		<div {...attr}>
			<span class={`jsdDlI ${iconClass}`}>
				<i class='o-icon--large o-icon-download' />
				<svg viewBox='0 0 24 24' height='24' width='24' fill='none' strokeWidth='2' strokeLinecap='round'><circle cx='12' cy='12' r='11' /></svg>
			</span>
		</div>
	)
}

/** Uppercase first letter */
export function _c(str: string): string {
	str = str?.trim()
	return str && str.charAt(0).toUpperCase() + str.slice(1)
}
/** Sanitise File name */
export function _file(str: string, ext?: string): string {
	str = str.trim().replace(/[^a-z0-9!@#$%^&()_+=_\-{}\[\],.~\s]/gi, '_')
	return ext ? `${str}.${ext}` : str
}
/** Modifies the JSON output from JioSaavn API */
export function _json(R: any): Object {
	const string = JSON.stringify(R)
		.replace(/&amp;?/gi, '&')
		.replace(/&copy;?/gi, '©')
		.replace(/&#039;?|&quot;?/g, "'")
		.replace(/http:/g, 'https:')
		.replace(/preview\.saavn/g, 'aac.saavn')
		.replace(/150x150\.jpg/g, '500x500.jpg')
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
			artist: s.singers?.split(',').map(_c),
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

export async function getBlob(url: string, type: 'audio/mp4' | 'image/jpeg') {
	if (!type) return console.log('No blob type specified')
	return axios
		.get(url, { responseType: 'arraybuffer' })
		.then((res) => new Blob([res.data], { type }) as Blob)
		.catch(() => null)
}

export async function downloadSong(data: Song, bit?: Bitrate) {
	const quality = (await browser.storage.sync.get(['quality']))?.quality
	if (!bit) bit = parseInt(quality) as Bitrate
	const blob = await getBlob(data.getURL(bit), 'audio/mp4')
	if (blob) saveAs(blob, _file(data.title, 'm4a'))
}

export async function downloadList(data: List, bit?: Bitrate) {
	const quality = (await browser.storage.sync.get(['quality']))?.quality
	if (!bit) bit = parseInt(quality) as Bitrate

	const zip = new JSZip()
	const zipName = _file(data.title, 'zip')
	// get all songs
	for (const song of data.songs) {
		const blob = await getBlob(song.getURL(bit), 'audio/mp4')
		if (blob) zip.file(_file(song.title, 'm4a'), blob)
	}
	// get the cover image
	const coverArt = await getBlob(data.image, 'image/jpeg')
	if (coverArt) zip.file('cover.jpg', coverArt)
	// create the zip file
	zip.generateAsync({ type: 'blob' }).then((blob) => saveAs(blob, zipName))
}
