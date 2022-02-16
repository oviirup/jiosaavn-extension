import React from 'jsx-dom'
import axios, {  Canceler } from 'axios'
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
	const w = large ? 24 : 36
	return (
		<div {...attr}>
			<span class={`jsdDlI ${iconClass}`}>
				<i class='o-icon--large o-icon-download' />
				<svg viewBox={`0 0 ${w} ${w}`} height={w} width={w} fill='none' strokeWidth={large?2:1} strokeLinecap='round'><circle cx={w/2} cy={w/2} r={w/2-1} /></svg>
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
	str = str.trim()
		.replace(/"/g, '\'')
		.replace(/[^a-z0-9!@#$%^&()_+=_\-{}\'\[\],.~\s]/gi, '_')
	return ext ? `${str}.${ext}` : str
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

export async function getBlob(
	url: string,
	type: 'audio/mp4' | 'image/jpeg',
	cancelToken?: (c:Canceler) => void
) {
	if (!type) return console.log('No blob type specified')
	return axios
		.get(url, {
			responseType: 'arraybuffer',
			cancelToken: new axios.CancelToken((c)=>{cancelToken && cancelToken(c)}),
		})
		.then((res) => new Blob([res.data], { type }) as Blob)
		.catch(() => null)
}

export async function downloadSong(data: Song, cancelToken?: (c: Canceler) => void) {
	const quality = (await browser.storage.sync.get(['quality']))?.quality
	const bit = (parseInt(quality) || 128) as Bitrate
	const blob = await getBlob(data.getURL(bit), 'audio/mp4', cancelToken)
	if (!blob) return
	const fileName = _file(data.title, 'm4a')
	saveAs(blob, fileName)
	// prettier-ignore
	console.log(`%cDownloaded : %c${fileName} %c${bit}kbps`,'color:gray','color:white','color:#52DB9A')
}

export async function downloadList(data: List, cancelToken?: (c: Canceler) => void) {
	const quality = (await browser.storage.sync.get(['quality']))?.quality
	const bit = parseInt(quality) as Bitrate
	const length = data.songs.length
	if (length === 0) return console.log(`The list does not contains any songs`)

	console.log(data)
	const zip = new JSZip()
	// get all songs
	const concurrent = 5
	console.log(`Downloading ${length} songs`)
	for (let i = 0; i < data.songs.length; i += concurrent) {
		const list = data.songs.slice(i, i + concurrent)
		if (i > 10) continue
		// prettier-ignore
		await Promise.all(list.map(async (song, c) => {
			const blob = await getBlob(song.getURL(bit), 'audio/mp4')
			if (!blob) return undefined
			const name = _file(song.title, 'm4a')
			zip.file(name, blob)
			console.log(`%c(${i+c+1}) %c${name} %c${bit}kbps`,'color:gray','color:white','color:#52DB9A')
		}))
	}
	// get the cover image
	const coverArt = await getBlob(data.image, 'image/jpeg')
	if (coverArt) zip.file('cover.jpg', coverArt)
	// create the zip file
	console.log('%cPlease wait while creating zip file', 'color:#FC843D;padding:15px 0')
	const zipBlob = await zip.generateAsync({ type: 'blob' })
	saveAs(zipBlob, _file(data.title, 'zip'))
	console.log('%cThe zip file is ready to download', 'color:#52DB9A;padding:15px 0')
}
