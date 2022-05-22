import axios from 'axios'
import { saveAs } from 'file-saver'
import Browser from 'webextension-polyfill'
import { _song, _file, _file_song, storage } from '../utils'
import JSZip from 'jszip'

import type { Canceler } from 'axios'
import { ApiV3, Song, List, Bitrate } from '../types'
type Context = (C: Canceler) => void


/** Get song data from server */
export async function getSongData(
	token: string,
	type: 'song' | 'album' | 'palylist' = 'song'
) {
	const url = 'https://www.jiosaavn.com/api.php?__call=webapi.get&_marker=0&ctx=web6dot0'
	const params = { _format: 'json', n: -1, p: 1, api_version: 3, token, type }
	const { data } = await axios.get(url, { params }).catch((e) => ({ data: null }))
	return data && _song(data, type)
}

export async function getBlob(
	url: string,
	type: 'audio/mp4' | 'image/jpeg',
	cancelToken: Context = () => {}
) {
	if (!type) {
		console.log('No blob type specified')
		return null
	}
	return axios
		.get(url, { responseType: 'arraybuffer', cancelToken: new axios.CancelToken(cancelToken) })
		.then((res) => new Blob([res.data], { type }) as Blob)
		.catch(() => null)
}

export async function downloadSong(
	data: Song,
	cancelToken?: Context
) {
	const { quality = 128, format = '$title' } = await storage.get('quality', 'format')
	const bit = (parseInt(quality) || 128) as Bitrate
	const blob = await getBlob(data.getURL(bit), 'audio/mp4', cancelToken)
	if (!blob) return
	const fileName = _file_song(data, bit, format)
	saveAs(blob, fileName)
	// prettier-ignore
	console.log(`%cDownloaded : %c${fileName} %c${bit}kbps`,'color:gray','color:white','color:#52DB9A')
}

export async function downloadList(data: List, cancelToken?: (c: Canceler) => void) {
	const { quality = 128, format = '$title' } = await storage.get('quality', 'format')
	const bit = parseInt(quality) as Bitrate
	const total = data.songs.length
	if (total === 0) return console.log(`The list does not contains any songs`)
	let unfinished = 0

	console.log(data)
	const zip = new JSZip()
	// get all songs
	console.log(`Downloading ${total} songs`)
	const concurrent = 5
	for (let i = 0; i < data.songs.length; i += concurrent) {
		const list = data.songs.slice(i, i + concurrent)
		await Promise.all(list.map(async (song, c) => {
			const blob = await getBlob(song.getURL(bit), 'audio/mp4')
			if (!blob) {
				++unfinished
				return undefined
			}
			const name = _file_song(song, bit, format)
			zip.file(name, blob)
			console.log(`%c(${i+c+1}) %c${name} %c${bit}kbps`,'color:gray','color:white','color:#52DB9A')
		}))
	}
	if (unfinished === total) {
		return console.error('Unable to download any song')
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
